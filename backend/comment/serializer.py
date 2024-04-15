from rest_framework import serializers
from .models import Comment

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

    def create(self, validated_data):
        user = validated_data.pop('user')
        post = validated_data.pop('post')
        comment = Comment.objects.create(user=user, post=post, **validated_data)
        return comment
    
    def update(self, instance, validated_data):
        instance.content = validated_data.get('content', instance.content)
        instance.save()
        return instance
    
    def delete(self, instance):
        instance.delete()
        return instance