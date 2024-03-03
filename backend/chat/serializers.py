from rest_framework import serializers
from .models import ChatRoom, Message
from users.serializer import CustomUserSerializer

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'author', 'content', 'timestamp']

class ChatRoomSerializer(serializers.ModelSerializer):
    members = serializers.SerializerMethodField()

    class Meta:
        model = ChatRoom
        fields = ['title', 'members']

    def get_members(self, obj):
        # Obtiene los miembros del chatroom
        members = obj.members.all()
        # Utiliza el CustomUserSerializer para serializar los miembros
        return CustomUserSerializer(members, many=True).data