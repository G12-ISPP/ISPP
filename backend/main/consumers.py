import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async

from chat.models import ChatRoom, Message


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        # Unirse a un grupo de chat
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Salir de un grupo de chat
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Recibir mensaje del WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        user = self.scope["user"]
        author_name = user.username if not user.is_anonymous else "Anónimo"

        room_id = int(self.scope['url_route']['kwargs']['room_name'])
        room = await sync_to_async(ChatRoom.objects.get)(id=room_id)


        # Asume que el usuario anónimo no puede guardar mensajes en la base de datos
        if not user.is_anonymous:
            await sync_to_async(Message.objects.create)(
                room=room,
                author=user,
                content=message
            )

        # Enviar mensaje al grupo, incluyendo el nombre del autor
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'author': author_name  # Incluye el nombre de usuario o "Anónimo"
            }
        )



    # Recibir mensaje del grupo
    # Recibir mensaje del grupo
    async def chat_message(self, event):
        message = event['message']
        author = event['author']  # Recoge el autor del evento

        # Enviar mensaje al WebSocket, incluyendo el autor
        await self.send(text_data=json.dumps({
            'message': message,
            'author': author  # Envía el nombre de usuario al cliente
        }))

