# myproject/asgi.py
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter
from .routing import application as channels_applications  # Asegúrate de que la ruta sea correcta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main.settings')

django_asgi_app = get_asgi_application()

from channels.auth import AuthMiddlewareStack

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": channels_applications,
})
