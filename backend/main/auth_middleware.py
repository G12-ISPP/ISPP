# myproject/middleware.py
from tokenize import TokenError
from urllib.parse import parse_qs
from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from django.db import close_old_connections
from jwt import InvalidTokenError
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth.models import AnonymousUser

from users.models import CustomUser  # Asumiendo que tienes un modelo de usuario personalizado

@database_sync_to_async
def get_user_from_token(token_key):
    try:
        # Decodifica el token y obtiene el usuario
        print(f"Decodificando token: {token_key}")  # Agrega un log aquí
        access_token = AccessToken(token_key)
        user = CustomUser.objects.get(id=access_token["user_id"])
        return user
    except (InvalidTokenError, TokenError, CustomUser.DoesNotExist) as e:
        print(f"Error al decodificar el token: {e}")  # Agrega un log aquí
        return AnonymousUser()

class TokenAuthMiddleware:
    """
    Middleware personalizado para manejar la autenticación por token en WebSockets.
    """
    
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        close_old_connections()
        # Decodifica la cadena de bytes a una cadena UTF-8
        query_string = scope["query_string"].decode()
        # Parsea la cadena de consulta a un diccionario
        params = parse_qs(query_string)
        token = params.get("token", [None])[0]
        if token:
            scope["user"] = await get_user_from_token(token)
        else:
            scope["user"] = AnonymousUser()
        return await self.inner(scope, receive, send)