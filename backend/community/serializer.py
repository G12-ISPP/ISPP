from rest_framework import serializers
from community.models import Post

class PostSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    class Meta:
        model = Post
        fields = ('id', 'name', 'description', 'users', 'image', 'image_url')
    
    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            return request.build_absolute_uri(obj.image.url)
        else:
            return None

class PostSerializerWrite(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    class Meta:
        model = Post
        fields = ('id', 'name', 'description', 'users', 'image', 'image_url')
    
    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            return request.build_absolute_uri(obj.image.url)
        else:
            return None
