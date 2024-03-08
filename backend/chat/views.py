from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views import View

from chat.serializers import ChatRoomSerializer
from .models import ChatRoom, Message
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from users.models import CustomUser
from django.views.decorators.http import require_http_methods
from django.utils.timezone import now
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from django.contrib.auth import get_user_model
import json

def get_user_from_token(token):
    try:
        # Intenta decodificar el token y obtener el usuario
        decoded_token = AccessToken(token)
        user_id = decoded_token['user_id']
        User = get_user_model()
        user = User.objects.get(id=user_id)
        return user
    except (TokenError, InvalidToken, CustomUser.DoesNotExist) as e:
        # Maneja los errores si el token es inválido o el usuario no existe
        print(e)
        return None

@csrf_exempt
def post_message(request, room_id):
    if request.method == 'POST':
    
        data = json.loads(request.body.decode('utf-8'))
        content = data.get('content', '')
        username = data.get('username', '')

        #user = CustomUser.objects.filter(username=username).first()
        token = request.headers.get('Authorization', '').split(' ')[1]
        user = get_user_from_token(token)
        room = get_object_or_404(ChatRoom, id=room_id)
        if user is None:
            return JsonResponse({'error': 'Invalid token'}, status=401)        

        if user in room.members.all():
            room, created = ChatRoom.objects.get_or_create(id=room_id)
            message = Message.objects.create(room=room, content=content, author=user)

            return JsonResponse({"success": True, "message_id": message.id})
        else:
            return JsonResponse({'error': 'Este usuario no pertenece al Chat'}, status=401)   
    else:
        return JsonResponse({"error": "Method not allowed"}, status=405)
    
@require_http_methods(["GET"])
def get_messages(request, room_id):
    # Extrae el token de la cabecera de autorización
    token = request.headers.get('Authorization', '').split(' ')[1]
    user = get_user_from_token(token)
    
    if user is None:
        return JsonResponse({'error': 'Invalid token'}, status=401)

    # Ahora usa el objeto `user` directamente en lugar de `request.user`
    room = get_object_or_404(ChatRoom, id=room_id)
    
    if user in room.members.all():
        messages = Message.objects.filter(room=room).values('id', 'content', 'author__username', 'timestamp')
        return JsonResponse(list(messages), safe=False)
    else:
        return JsonResponse({'error': 'User is not a member of this chatroom'}, status=403)
    

@require_http_methods(["GET"])
def get_chatroom(request, room_id):
    token = request.headers.get('Authorization', '').split(' ')[1]
    user = get_user_from_token(token)
    
    if user is None:
        return JsonResponse({'error': 'Invalid token'}, status=401)

    room = get_object_or_404(ChatRoom, id=room_id)
    
    if user in room.members.all():
        room_serializer = ChatRoomSerializer(room)  # Serializa la instancia de ChatRoom
        return JsonResponse(room_serializer.data, safe=False)  # Devuelve los datos serializados
    else:
        return JsonResponse({'error': 'User is not a member of this chatroom'}, status=403)
    
    
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
    
