from django.urls import path
from .views import ChatRoomMessagesView  # Asegúrate de importar tu vista aquí

urlpatterns = [
    # Tus otras URLs aquí...
    path('<int:room_id>/messages/', ChatRoomMessagesView.as_view(), name='chatroom-messages'),
]
