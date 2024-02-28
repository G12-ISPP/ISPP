from django.http import JsonResponse
from django.views import View
from .models import ChatRoom, Message
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from users.models import CustomUser

class ChatRoomMessagesView(View):
    def get(self, request, room_id):
        # Intenta obtener el ChatRoom por ID
        try:
            chat_room = ChatRoom.objects.get(pk=room_id)
            # Aquí, implementa la lógica para recuperar los mensajes del chat_room
            messages = Message.objects.filter(room=chat_room).values('id', 'content', 'author__username', 'timestamp')
            return JsonResponse({"messages": list(messages)})
        except ObjectDoesNotExist:
            return JsonResponse({"error": "ChatRoom not found"}, status=404)


class GetOrCreateChatRoom(APIView):
    def post(self, request):
        print("HOLA DESDE EL POST EN EL BACKKKKKK")
        # Asume que recibes los IDs de los usuarios como parte de la solicitud
        user_id_1 = request.data.get('currentUserID')
        user_id_2 = request.data.get('otherUserID')

        print(user_id_1)
        print(user_id_2)

        # Asegúrate de que ambos usuarios existen
        try:
            user1 = CustomUser.objects.get(id=user_id_1)
            user2 = CustomUser.objects.get(id=user_id_2)
        except CustomUser.DoesNotExist:
            return Response({'error': 'Uno o ambos usuarios no existen.'}, status=status.HTTP_404_NOT_FOUND)

        # Buscar una sala de chat existente
        chatrooms_user1 = set(user1.chatrooms.all())
        chatrooms_user2 = set(user2.chatrooms.all())
        common_chatrooms = chatrooms_user1.intersection(chatrooms_user2)

        if common_chatrooms:
            chatroom = common_chatrooms.pop()  # Obtiene una sala de chat en común
        else:
            # Crea una nueva sala de chat si no existe una en común
            chatroom = ChatRoom.objects.create(title=f"Chat entre {user1.username} y {user2.username}")
            chatroom.members.add(user1, user2)

        return Response({'chatroomID': chatroom.id}, status=status.HTTP_200_OK)