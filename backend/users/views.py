from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.exceptions import ErrorDetail, APIException
from rest_framework import status

from django.shortcuts import render
from .serializer import CustomUserSerializer
from .models import CustomUser
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.decorators import action
from users.models import CustomUser
from users.serializer import UserSerializer

# Create your views here.
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
    serializer_class = CustomUserSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            return super().post(request, *args, **kwargs)
        except APIException as e:
            # print(type(e.detail.values()[0].string))
            error_message = str(next(iter(e.detail.values()))[0])
            error_detail = ErrorDetail(string=error_message, code='generic_error')
            
            return Response({'error': error_detail}, status=status.HTTP_400_BAD_REQUEST)
