from django.shortcuts import render
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from .models import Order, OrderProduct
import json
from paypalrestsdk import Payment
from django.shortcuts import redirect
from django.http import HttpResponseRedirect
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.http import FileResponse
from django.http import JsonResponse
import base64
from rest_framework import status
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from products.models import Product
from products.serializer import ProductSerializer
from django.http import JsonResponse
import uuid
from .serializer import OrderSerializer
from datetime import datetime
from django.core.mail import send_mail
from django.template.loader import render_to_string
from users.models import CustomUser
from django.core.serializers import serialize

ruta_backend = settings.RUTA_BACKEND
ruta_frontend = settings.RUTA_FRONTEND

# Create your views here.
@api_view(['POST'])
@csrf_exempt
def create_order(request):
    order = Order.objects.create(
        id= uuid.uuid4(),
        price = 0,
        status = 'P',
        address = request.data['address'],
        city = request.data['city'],
        postal_code = request.data['postal_code'],
        buyer_mail = request.data['buyer_mail'],
        payment='T',
        date = datetime.now(),
        payed = False
    )
    if request.user.is_authenticated:
        order.buyer = request.user
    cart = json.loads(request.data['cart'])
    price = 0
    for item in cart:
        product_id = item['id']
        quantity = item['quantity']
        try:
            product = Product.objects.get(id=product_id)
            if product.product_type != 'D':
                if product.stock_quantity < quantity:
                    return JsonResponse({'error': 'No hay suficiente stock de ' + product.name}, status=400)
                price += 2*quantity
            OrderProduct.objects.create(order=order, product=product, quantity=quantity)
            product.save()
        except Product.DoesNotExist:
            return JsonResponse({'error': 'El producto con ID {} no existe'.format(product_id)}, status=400)
        price += product.price * quantity
    order.price = price
    order.price += 5
    order.save()
    paypal_payment = Payment({
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "transactions": [{
                    "amount": {
                        "total": str(order.price),
                        "currency": "EUR"
                    },
                    "description": "Encargo de diseño personalizado."
                }],
                "redirect_urls": {
                    "return_url": request.build_absolute_uri('/order/confirm/' + str(order.id)),
                    "cancel_url": request.build_absolute_uri('/order/cancel/' + str(order.id))
                }
            })

    if paypal_payment.create():
        payment_url = paypal_payment.links[1]['href']  
        return Response({'paypal_payment_url': payment_url}, status=status.HTTP_200_OK)
    else:
        return redirect('/order/cancel/' + str(order.id))

    return JsonResponse({'success': 'Pedido creado exitosamente'}, status=201)

def confirm_order(request, order_id):
    order = get_object_or_404(Order, id=order_id)
    order.payed = True
    order.save()
    op = OrderProduct.objects.filter(order=order)
    for order_product in op:
        product = order_product.product
        if(product.product_type != 'D'):
            product.stock_quantity -= order_product.quantity
            product.save()
    send_order_confirmation_email(order, op)
    
    return HttpResponseRedirect(ruta_frontend + '/order/details/' + str(order.id))

def send_order_confirmation_email(order, order_products):
    try:
        asunto = 'Confirmación de tu pedido en Shar3d'
        contexto = {'order': order, 'order_products': order_products}
        mensaje = render_to_string('order_confirmation_email.html', contexto)

        sender_email = settings.EMAIL_HOST_USER
        recipient_email = order.buyer_mail

        send_mail(asunto, '', sender_email, [recipient_email], html_message=mensaje)
    except Exception as e:
        print(f"Error al enviar el correo: {e}")

def cancel_order(request, order_id):
    order = get_object_or_404(Order, id=order_id)
    order.delete()
    return HttpResponseRedirect(ruta_frontend + '/order/cancel/' )

@api_view(['GET'])
def order_details(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
        if order.payed == False:
            return JsonResponse({'error': 'El pedido no existe'}, status=403)
        
        order_products = list(OrderProduct.objects.filter(order_id=order_id))
        products = []
        for p in order_products:
            products.append({'id': p.product_id, 'quantity':p.quantity})

        order_details = {
            'id': order.id,
            'buyer': order.buyer.email if order.buyer else None,
            'price': order.price,
            'status': order.status,
            'address': order.address,
            'city': order.city,
            'postal_code': order.postal_code,
            'payment': order.payment,
            'date': order.date,
            'payed': order.payed,
            'buyer_mail': order.buyer_mail,
            'products': products
        }
        return JsonResponse(order_details)
    except Exception:
        return JsonResponse({'error': 'El pedido no existe'}, status=404)

@api_view(['GET'])
def my_orders(request):
    try:
        if request.user.is_authenticated:
            username = request.user
            user = CustomUser.objects.get(username=username)
            orders = Order.objects.filter(buyer=user.id, payed=True)
            
            orders_serialized = serialize('json', orders)
            orders_list = [item['fields'] for item in json.loads(orders_serialized)]
            for i, order in enumerate(orders):
                orders_list[i]['pk'] = str(order.pk)
                productId = list(OrderProduct.objects.filter(order_id=order.pk))[0].product_id
                product = Product.objects.get(pk=productId)
                orders_list[i]['imageRoute'] = product.imageRoute

            
            empty = not orders_list
            
            orders_data = {
                'orders': orders_list,
                'empty': empty
            }
        return JsonResponse(orders_data)
    except Exception as e:
        print(e)
        return JsonResponse({'error': 'Internal server error'}, status=500)