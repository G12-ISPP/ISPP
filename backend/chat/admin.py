from django.contrib import admin

from chat.models import ChatRoom, Message

class ChatRoomAdmin(admin.ModelAdmin):
    list_display = ('id', 'title')  # Agrega 'id' y otros campos que quieras mostrar
    search_fields = ('title',)  # Campos por los que se puede buscar

class MessageAdmin(admin.ModelAdmin):
    
    list_display = ('room', 'author', 'content', 'timestamp')
    list_filter = ('room', 'author', 'timestamp')  # Filtros en la barra lateral
    search_fields = ('content',)  # Permite buscar mensajes por contenido

admin.site.register(ChatRoom, ChatRoomAdmin)
admin.site.register(Message, MessageAdmin)
