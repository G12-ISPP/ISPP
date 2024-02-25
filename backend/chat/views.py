from django.http import JsonResponse
from django.views import View
from .models import ChatRoom, Message
from django.core.exceptions import ObjectDoesNotExist

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
