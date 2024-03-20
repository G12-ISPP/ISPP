from django.contrib import admin
from community.models import Post

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description', 'image', 'users', 'fecha')  # Agrega 'id' y otros campos que quieras mostrar
    search_fields = ('id', 'name', 'description', 'image', 'users', 'fecha')  # Campos por los que se puede buscar
