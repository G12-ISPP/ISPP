from rest_framework import status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from .models import CustomDesign
from .serializer import CustomDesignSerializer
from django.views.decorators.csrf import csrf_exempt
import json
from paypalrestsdk import Payment
from django.shortcuts import redirect
from django.http import HttpResponseRedirect
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.http import FileResponse
from django.http import JsonResponse
from users.serializer import UserSerializer
import base64
from django.conf import settings

ruta_backend = settings.RUTA_BACKEND
ruta_frontend = settings.RUTA_FRONTEND



@api_view(['POST'])
@parser_classes((MultiPartParser, FormParser))
def create_custom_design(request):
    data_json = request.POST.get('data')
    if data_json:
        data = json.loads(data_json)
        design_file = request.FILES.get('file')
        if design_file:
            name = data.get('name')
            quantity = data.get('quantity')
            quality = data.get('quality')
            dimensions = data.get('dimensions')
            area = data.get('area')
            volume = data.get('volume')
            weight = data.get('weight')
            price = data.get('price')     
            postal_code = data.get('postal_code')
            address = data.get('address')
            city = data.get('city')
            buyer_mail = data.get('buyer_mail')

            custom_design = CustomDesign.objects.create(
                name=name,
                quantity=quantity,
                quality=quality,
                dimensions=dimensions,
                area=area,
                volume=volume,
                weight=weight,
                price=price,
                design_file=design_file,
                postal_code=postal_code,
                address=address,
                city=city,
                buyer_mail=buyer_mail,
                payed=False
            )
            paypal_payment = Payment({
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "transactions": [{
                    "amount": {
                        "total": str(price),
                        "currency": "EUR"
                    },
                    "description": "Encargo de diseño personalizado."
                }],
                "redirect_urls": {
                    "return_url": request.build_absolute_uri('/designs/confirm/' + str(custom_design.custom_design_id)),
                    "cancel_url": request.build_absolute_uri('/designs/cancel/' + str(custom_design.custom_design_id))
                }
            })

            if paypal_payment.create():
                payment_url = paypal_payment.links[1]['href']  
                return Response({'paypal_payment_url': payment_url}, status=status.HTTP_200_OK)
            else:
                messages.error(request, 'Error al procesar el pago con PayPal.')
                return redirect('/checkout/')

        else:
            return Response('Invalid data', status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response('Invalid data', status=status.HTTP_400_BAD_REQUEST)


def confirm(request, id):
    if request.method == 'GET':
        custom_design = get_object_or_404(CustomDesign, custom_design_id=id)

        custom_design.payed = True
        custom_design.save()
        return HttpResponseRedirect(ruta_frontend+'/designs/details/' + str(custom_design.custom_design_id))
    else:
        return HttpResponse('El método HTTP no es compatible.', status=405)

def cancel(request, id):
    if request.method == 'GET':
        custom_design = get_object_or_404(CustomDesign, custom_design_id=id)
        custom_design.delete()
        return HttpResponseRedirect(ruta_frontend+'/designs/canceled')
    else:
        return HttpResponse('El método HTTP no es compatible.', status=405)

@api_view(['GET'])
def details(request, id):
    custom_design = get_object_or_404(CustomDesign, custom_design_id=id)
    serializer = CustomDesignSerializer(custom_design)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@csrf_exempt
def loguedUser(request):
    print(request.user)
    if request.method == 'GET':
        if request.user.is_authenticated:
            user = request.user
            serializer = UserSerializer(user)
            print(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            print("no logueado")
            return Response({"message": "No hay usuario logueado"}, status=status.HTTP_200_OK)