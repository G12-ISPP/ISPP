from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'
        
    def create(self, validated_data):
        permissions_data = validated_data.pop('user_permissions', None)
        groups_data = validated_data.pop('groups', None)
        user = CustomUser.objects.create_user(**validated_data)
        if permissions_data:
            user.user_permissions.set(permissions_data)
        if groups_data:
            user.groups.set(groups_data)
        return user
    
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email']  # Ajusta esto según los datos que quieras enviar al frontend

class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'city', 'postal_code', 'profile_picture']