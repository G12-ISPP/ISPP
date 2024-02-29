from django import views
from django.urls import path
from .views import GetOrCreateChatRoom, post_message, get_messages  # Asegúrate de importar tu vista aquí

urlpatterns = [
    # Tus otras URLs aquí...
    path('chatroom/', GetOrCreateChatRoom.as_view(), name='get_or_create_chatroom'),
    path('<int:room_id>/post_message/', post_message, name='post_message'),
    path('<int:room_id>/messages/', get_messages, name='get_messages'),


]
