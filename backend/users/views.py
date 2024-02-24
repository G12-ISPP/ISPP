from django.shortcuts import render

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