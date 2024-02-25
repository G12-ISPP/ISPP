import json
from urllib.parse import parse_qs
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

from backend.users.models import CustomUser

class MyAsyncWebsocketConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Obtener el token de la query string
        query_string = self.scope['query_string'].decode()
        params = parse_qs(query_string)
        token = params.get('token', [None])[0]

        if token is not None:
            # Verificar el token y obtener el usuario
            user = await self.get_user_from_token(token)
            if user is not None:
                self.scope['user'] = user
                await self.accept()
                return
            else:
                await self.close(code=4001)  # Código de error personalizado para "token inválido"
        else:
            self.scope['user'] = AnonymousUser()
            await self.accept()

    @database_sync_to_async
    def get_user_from_token(self, token):
        try:
            # Verificar el token y obtener el usuario
            access_token = AccessToken(token)
            user_id = access_token['user_id']
            user = CustomUser.objects.get(id=user_id)
            return user
        except (InvalidToken, TokenError, CustomUser.DoesNotExist):
            return None
