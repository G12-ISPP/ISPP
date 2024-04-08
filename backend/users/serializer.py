from rest_framework import serializers
from .models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    class Meta:
        model = CustomUser
        fields = '__all__'

    def create(self, validated_data):
        permissions_data = validated_data.pop('user_permissions', None)
        groups_data = validated_data.pop('groups', None)
        followings_data = validated_data.pop('followings', [])
        followers_data = validated_data.pop('followers', [])
        user = CustomUser.objects.create_user(**validated_data)
        if permissions_data:
            user.user_permissions.set(permissions_data)
        if groups_data:
            user.groups.set(groups_data)
        # Añadir las relaciones followings y followers después de crear el usuario
        user.followings.set(followings_data)
        user.followers.set(followers_data)
        return user
    
    def get_image_url(self, obj):
        request = self.context.get('request')
        if request and obj.profile_picture and hasattr(obj.profile_picture, 'url'):
            return request.build_absolute_uri(obj.profile_picture.url)
        else:
            return None
    
    def get_following_count(self, obj):
        return obj.followings.count()
    
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email']  # Ajusta esto según los datos que quieras enviar al frontend

class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'city', 'postal_code', 'address', 'profile_picture']
