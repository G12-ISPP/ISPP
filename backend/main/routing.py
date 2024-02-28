import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main.settings')
django.setup()
from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path
from .consumers import ChatConsumer
from .auth_middleware import TokenAuthMiddleware



django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
  "http": django_asgi_app,
  "websocket": TokenAuthMiddleware(  
      URLRouter([
          path("ws/chat/<int:room_id>", ChatConsumer.as_asgi()),  
      ])
  ),
})