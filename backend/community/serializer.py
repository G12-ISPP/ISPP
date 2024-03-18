from rest_framework import serializers
from community.models import Post

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('id', 'name', 'description', 'users')

class PostSerializerWrite(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('name', 'description', 'users')