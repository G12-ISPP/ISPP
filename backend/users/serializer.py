from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
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
    
    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.profile_picture and hasattr(obj.profile_picture, 'url'):
            return request.build_absolute_uri(obj.profile_picture.url)
        else:
            return None

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username']