from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.exceptions import ErrorDetail, APIException
from rest_framework import status

from django.shortcuts import render
from .serializer import CustomUserSerializer
from .models import CustomUser

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

def valores_diccionario(diccionario):
    valores = []
    for valor in diccionario.values():
        if isinstance(valor, dict):
            valores.extend(valores_diccionario(valor))
        else:
            valores.append(valor)
    return valores