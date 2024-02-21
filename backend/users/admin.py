from django.contrib import admin
from users.models import CustomUser
# Register your models here.

@admin.register(CustomUser)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('username','name')
    search_fields = ('username',)
    list_filter = ('username',)