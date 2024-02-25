from rest_framework import generics, status, viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.exceptions import ErrorDetail, APIException
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from .models import CustomUser
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import viewsets, status
from rest_framework.exceptions import ValidationError
from .models import CustomUser

from rest_framework.decorators import action
from users.serializer import UserSerializer
from django.utils.translation import gettext_lazy as _
from functools import wraps
from django.utils.translation import activate
from django.conf import settings


class UsersView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = CustomUser.objects.all()

  # New function
    @action(detail=True, methods=['get'])
    def get_user_data(self, request, pk=None):
        user = self.get_object()
        serializer = self.get_serializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
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
        try:
            return super().post(request, *args, **kwargs)
        except ValidationError as e:
            error_detail = dict(e.detail)
            translated_errors = {key: [_(value[0])] for key, value in error_detail.items()}
            print(translated_errors)
            return Response(translated_errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            error_message = str(e)
            print(error_message)
            return Response({'error': _('An error occurred.')}, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user is None:
            raise APIException('Invalid username or password')
        refresh = RefreshToken.for_user(user)
        return Response({'token': str(refresh.access_token), 'message': 'Login successful'}, status=status.HTTP_200_OK)
    
class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Logout successful'}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)    

