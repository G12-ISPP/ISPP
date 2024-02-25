import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main.settings')
django.setup()
from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path
from .consumers import ChatConsumer



django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
  "http": django_asgi_app,
  "websocket": AuthMiddlewareStack(
      URLRouter([
          path("ws/chat/<str:room_name>/", ChatConsumer.as_asgi()),
      ])
  ),
})
