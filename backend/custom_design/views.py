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
from django.core.mail import send_mail, EmailMessage
from django.template.loader import render_to_string

ruta_backend = settings.RUTA_BACKEND
ruta_frontend = settings.RUTA_FRONTEND

@api_view(['GET'])
def list_searching_printer_designs(request):
    if not request.user.is_authenticated:
        return Response({'message': 'No estás logueado. Por favor, inicia sesión.'}, status=status.HTTP_401_UNAUTHORIZED)
    elif not request.user.is_printer:
        return Response({'message': 'No tienes permiso para acceder a esta página. Solo los impresores pueden ver los diseños.'}, status=status.HTTP_403_FORBIDDEN)

    designs = CustomDesign.objects.filter(status='searching')
    if not designs.exists():
        return Response({'message': 'No hay diseños disponibles'}, status=status.HTTP_404_NOT_FOUND)

    serializer = CustomDesignSerializer(designs, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@csrf_exempt
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
                payed=False,
                status='searching',
            )

            if request.user.is_authenticated:
                custom_design.buyer = request.user
                custom_design.save()

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
        send_confirmation_email(custom_design)
        return HttpResponseRedirect(ruta_frontend+'/designs/details/' + str(custom_design.custom_design_id))
    else:
        return HttpResponse('El método HTTP no es compatible.', status=405)

def send_confirmation_email(cd):
    try:
        asunto = 'Confirmación de tu pedido en Shar3d'
        contexto = {'cd': cd}
        mensaje = render_to_string('confirmation_email.html', contexto)

        sender_email = settings.EMAIL_HOST_USER
        recipient_email = cd.buyer_mail
        
        send_mail(asunto, '', sender_email, [recipient_email], html_message=mensaje)
    except Exception as e:
        print(f"Error al enviar el correo: {e}")


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
def details_to_printer(request, id):
    custom_design = get_object_or_404(CustomDesign, custom_design_id=id)
    serializer = CustomDesignSerializer(custom_design)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@csrf_exempt
def update_design_status(request, design_id):
    if request.method == 'POST':
        try:
            design = CustomDesign.objects.get(custom_design_id=design_id)
            design.status = 'printing'
            design.printer = request.user
            design.save()

            body = f"""
            Ha sido seleccionado para imprimir la pieza que se adjunta en este correo. Por favor, una vez finalizada la impresión, acuda a Correos y envíala a la ciudad {design.city}, a la dirección {design.address}.
            Recibirás el coste de impresión de {design.price - design.quantity * (3+3+2)} €, más 3 euros por el servicio, y los gastos de envío.
            """

            subject = 'Puede empezar a imprimir'
            from_email = settings.EMAIL_HOST_USER
            to = [design.printer.email]

            email = EmailMessage(subject, body, from_email, to)
            email.attach_file(design.design_file.path) 

            email.send()

            return JsonResponse({'status': 'success', 'message': 'Diseño actualizado a imprimiendo y correo enviado.'})
        except CustomDesign.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Diseño no encontrado.'})
    else:
        return JsonResponse({'status': 'error', 'message': 'Método no permitido.'})



@api_view(['GET'])
@csrf_exempt
def loguedUser(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            user = request.user
            serializer = UserSerializer(user)
            print(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"message": "No hay usuario logueado"}, status=status.HTTP_200_OK)