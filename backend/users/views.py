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

class UsersView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = CustomUser.objects.all()

  # New function
    @action(detail=True, methods=['get'])
    def get_user_data(self, request, pk=None):
        user = self.get_object()
        serializer = self.get_serializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
      
class UserCreateAPIView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            return super().post(request, *args, **kwargs)
        except APIException as e:
            # print(type(e.detail.values()[0].string))
            error_message = str(next(iter(e.detail.values()))[0])
            error_detail = ErrorDetail(string=error_message, code='generic_error')
            
            return Response({'error': error_detail}, status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as e:
            error_detail = dict(e.detail)
            return Response(error_detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            error_message = str(e)
            print(error_message)
            return Response({'error': error_message}, status=status.HTTP_400_BAD_REQUEST)



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
