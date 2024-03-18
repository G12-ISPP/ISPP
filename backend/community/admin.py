from django.contrib import admin
from community.models import Post

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description', 'image', 'users')  # Agrega 'id' y otros campos que quieras mostrar
    search_fields = ('id', 'name', 'description', 'image', 'users')  # Campos por los que se puede buscar
