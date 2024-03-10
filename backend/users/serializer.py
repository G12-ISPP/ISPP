from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'
        
    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user
    
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email']  # Ajusta esto según los datos que quieras enviar al frontend