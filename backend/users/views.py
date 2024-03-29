import re
from datetime import datetime
from functools import wraps

from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import EmailMultiAlternatives
from django.db.models import Q
from django.http import HttpResponseRedirect
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect
from django.template.loader import get_template
from django.urls import reverse
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.utils.translation import activate
from django.utils.translation import gettext_lazy as _
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from paypalrestsdk import Payment
from rest_framework import generics
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.decorators import api_view
from rest_framework.exceptions import APIException
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from users.serializer import ProfileUpdateSerializer
from users.serializer import UserSerializer
from .models import CustomUser
from .utils import validate_email, get_user

ruta_frontend = settings.RUTA_FRONTEND

class UsersView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = CustomUser.objects.all()

    def get_queryset(self):
        search_query = self.request.query_params.get('search')

        queryset = CustomUser.objects.all()
        if search_query:
            queryset = queryset.filter(
                Q(username__icontains=search_query) | 
                Q(first_name__icontains=search_query) |
                Q(last_name__icontains=search_query)
            )

        return queryset

  # New function
    @action(detail=True, methods=['get'])
    def get_user_data(self, request, pk=None):
        user = self.get_object()
        serializer = self.get_serializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['patch'])
    def update_profile(self, request, pk=None):
        user = self.get_object()
        serializer = ProfileUpdateSerializer(user, data=request.data, partial=True)
        postal_code = request.data.get('postal_code')
        try:
            postal_code = int(postal_code)
            if postal_code < 1000 or postal_code > 52999:
                raise ValidationError({'postal_code': ['El código postal debe ser un número entero entre 1000 y 52999']})
        except ValueError:
            raise ValidationError({'postal_code': ['El código postal debe ser un número entero válido']})
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
def translate(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        activate(settings.LANGUAGE_CODE)
        return view_func(request, *args, **kwargs)
    return _wrapped_view

class UserCreateAPIView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    @translate
    def post(self, request, *args, **kwargs):
        errors = {}
        if len(request.data.get('password')) < 4 or not re.search(r'\d', request.data.get('password')) or not re.search(r'[a-zA-Z]', request.data.get('password')):
            errors['password'] = ['La contraseña debe tener al menos 4 caracteres de los cuales al menos uno debe ser un dígito y otro una letra']
        postal_code = request.data.get('postal_code')
        try:
            postal_code = int(postal_code)
            if postal_code < 1000 or postal_code > 52999:
                errors['postal_code'] = ['El código postal debe ser un número entero entre 1000 y 52999']
        except ValueError:
            errors['postal_code'] = ['El código postal debe ser un número entero válido']
        address = request.data.get('address')
        if len(address) < 5:
            errors['address'] = ['La dirección debe tener al menos 5 caracteres']
        elif len(address) > 255:
            errors['address'] = ['La dirección no puede tener más de 255 caracteres']
        city = request.data.get('city')
        if len(city) < 3:
            errors['city'] = ['La ciudad debe tener al menos 3 caracteres']
        elif len(city) > 50:
            errors['city'] = ['La ciudad no puede tener más de 50 caracteres']
        username = request.data.get('username')
        if len(username) < 4:
            errors['username'] = ['El nombre de usuario debe tener al menos 4 caracteres']
        elif len(username) > 30:
            errors['username'] = ['El nombre de usuario no puede tener más de 30 caracteres']
        email = request.data.get('email')
        if len(email) > 50:
            errors['email'] = ['El email no puede tener más de 50 caracteres']
        if not validate_email(email):
            errors['email'] = ['El email no es válido']
        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        try:
            user_json = super().post(request, *args, **kwargs)
            user = CustomUser.objects.get(username=request.data.get('username'))


            # Generar el token único
            token = default_token_generator.make_token(user)

            # Generar la URL de verificación por correo electrónico
            uid = urlsafe_base64_encode(force_bytes(user.pk))

            # Enviar el correo electrónico de verificación
            template = get_template('verification_email.html')
            content = template.render(
                {'verify_url': ruta_frontend + "/verify-email/" + uid + "/" + token + "/", 'username': user.username})
            message = EmailMultiAlternatives(
                'Verificación de correo electrónico',
                content,
                settings.EMAIL_HOST_USER,
                [user.email]
            )

            message.attach_alternative(content, 'text/html')
            message.send()

            return user_json
        except ValidationError as e:
            error_detail = dict(e.detail)
            translated_errors = {key: [_(value[0])] for key, value in error_detail.items()}
            return Response(translated_errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            error_message = str(e)
            print(error_message)
            return Response({'error': _('An error occurred.')}, status=status.HTTP_400_BAD_REQUEST)

class VerifyEmailView(APIView):

    def get(self, request, uidb64, token):
        user = get_user(uidb64)
        print(user)
        if user is not None and default_token_generator.check_token(user, token):
            if user.email_verified:
                return Response({'message': 'Usuario ya verificado.'}, status=200)
            user.email_verified = True
            user.save()
            return Response({'message': '¡Correo verificado! Gracias por confirmar tu dirección de correo electrónico.'}, status=200)
        else:
            return Response({'message': 'Token inválido'}, status=400)

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user is None:
            raise APIException('Invalid username or password')
        if not user.email_verified:
            raise APIException('Email not verified')
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'token': str(refresh.access_token),
            'userId': user.id,  # Aquí devolvemos el userID
            'message': 'Login successful'
        }, status=status.HTTP_200_OK)
    

def get_user_id_by_username(request, username):
    # Busca el usuario por username. Si no existe, devuelve un error 404
    user = get_object_or_404(CustomUser, username=username)
    
    # Devuelve el id del usuario como respuesta JSON
    return JsonResponse({'user_id': user.id})

@api_view(['POST'])
@csrf_exempt
def buy_plan(request):
    if request.user.is_authenticated:
        sellerP = request.data['sellerPlan']
        buyerP = request.data['buyerPlan']
        designerP = request.data['designerPlan']
        price = 0
        if sellerP :
            price += 15
        if buyerP :
            price += 10
        if designerP :
            price += 15

        url = '/obtainPlan/' + str(request.data['sellerPlan']) + '/' + str(request.data['buyerPlan']) + '/'  + str(request.data['designerPlan']) +'/' + str(request.user.id)
        cancel_url = ruta_frontend + 'cancel-plan'
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
                    "return_url": request.build_absolute_uri(url),
                    "cancel_url": request.build_absolute_uri(cancel_url)
                }
            })

        if paypal_payment.create():
            payment_url = paypal_payment.links[1]['href']  
            return Response({'paypal_payment_url': payment_url}, status=status.HTTP_200_OK)
        else:
            return redirect('/')
        

    return JsonResponse({'success': 'Plan comprado exitosamente'}, status=201)

def obtain_plan(request, plan_seller, plan_buyer, plan_designer,user_id):
    user = CustomUser.objects.get(id=user_id)
    if plan_buyer:
        user.buyer_plan = True
        user.buyer_plan_date = datetime.now()
    if plan_seller:
        user.seller_plan = True
        user.seller_plan_date = datetime.now()
    if plan_designer:
        user.designer_plan = True
        user.is_designer = True
        user.designer_plan_date = datetime.now()

    user.save()
    return HttpResponseRedirect(ruta_frontend + '/confirm-plan')

# Following Functions
@api_view(['GET'])
@csrf_exempt
@login_required
def follow_toggle(request, user_id):
    user = CustomUser.objects.get(id=user_id)
    if request.user in user.followers.all():
        user.followers.remove(request.user)
        user.save()
        request.user.followings.remove(user)
        request.user.save()
        print(user.followers.all())
        print(request.user.followings.all())
        return JsonResponse({'success': 'Ya no sigues a ' + user.username}, status=201)
    else:
        user.followers.add(request.user)
        user.save()
        request.user.followings.add(user)
        request.user.save()
        print(user.followers.all())
        print(request.user.followings.all())
        return JsonResponse({'success': 'Ahora sigues a ' + user.username}, status=201)


@api_view(['GET'])
@csrf_exempt
@login_required
def follow_status(request, user_id):
    user = CustomUser.objects.get(id=user_id)

    if request.user in user.followers.all():
        return JsonResponse({'follows': True}, status=201)
    else:
        return JsonResponse({'follows': False}, status=201)


