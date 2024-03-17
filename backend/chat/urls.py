from django import views
from django.urls import path
from .views import GetOrCreateChatRoom, get_chatroom, post_message, get_messages, chat_users  # Asegúrate de importar tu vista aquí

urlpatterns = [
    # Tus otras URLs aquí...
    path('chatroom/', GetOrCreateChatRoom.as_view(), name='get_or_create_chatroom'),
    path('chatroom/<int:room_id>', get_chatroom, name='get_chatroom'),
    path('<int:room_id>/post_message/', post_message, name='post_message'),
    path('<int:room_id>/messages/', get_messages, name='get_messages'),
    path('chat-users/', chat_users, name='chat-users'),


]
