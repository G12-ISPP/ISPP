import json

from django.conf import settings
from django.contrib import messages
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404
from django.shortcuts import redirect
from django.template.loader import render_to_string
from paypalrestsdk import Payment
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView

from chat.views import get_user_from_token
from users.serializer import UserSerializer
from .models import CustomDesign
from .serializer import CustomDesignSerializer

ruta_frontend = 'your_frontend_path'  # Replace with your actual frontend path

User = get_user_model()


class CreateCustomDesignView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
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

                if request.user.is_authenticated:
                    custom_design.buyer = request.user
                    custom_design.save()

                paypal_payment = Payment({
                    "intent": "sale",
                    "payer": {"payment_method": "paypal"},
                    "transactions": [{
                        "amount": {
                            "total": str(price),
                            "currency": "EUR"
                        },
                        "description": "Encargo de diseño personalizado."
                    }],
                    "redirect_urls": {
                        "return_url": request.build_absolute_uri(
                            '/designs/confirm/' + str(custom_design.custom_design_id)),
                        "cancel_url": request.build_absolute_uri(
                            '/designs/cancel/' + str(custom_design.custom_design_id))
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


class ConfirmDesignView(APIView):
    def get(self, request, id, *args, **kwargs):
        custom_design = get_object_or_404(CustomDesign, custom_design_id=id)
        custom_design.payed = True
        custom_design.save()
        self.send_confirmation_email(custom_design)
        return HttpResponseRedirect(ruta_frontend + '/designs/details/' + str(custom_design.custom_design_id))

    def send_confirmation_email(self, cd):
        try:
            asunto = 'Confirmación de tu pedido en Shar3d'
            contexto = {'cd': cd}
            mensaje = render_to_string('confirmation_email.html', contexto)

            sender_email = settings.EMAIL_HOST_USER
            recipient_email = cd.buyer_mail

            send_mail(asunto, '', sender_email, [recipient_email], html_message=mensaje)
        except Exception as e:
            print(f"Error al enviar el correo: {e}")


class CancelDesignView(APIView):
    def get(self, request, id, *args, **kwargs):
        custom_design = get_object_or_404(CustomDesign, custom_design_id=id)
        custom_design.delete()
        return HttpResponseRedirect(ruta_frontend + '/designs/canceled')


class DesignDetailsView(APIView):
    def get(self, request, id, *args, **kwargs):
        custom_design = get_object_or_404(CustomDesign, custom_design_id=id)
        serializer = CustomDesignSerializer(custom_design)
        return Response(serializer.data, status=status.HTTP_200_OK)


class LoguedUserView(APIView):
    def get(self, request, *args, **kwargs):
        token = request.headers.get('Authorization', '').split(' ')[1]
        user = get_user_from_token(token)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        return Response({"message": "No hay usuario logueado"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

