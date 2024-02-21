from django.contrib import admin
from opinion.models import Opinion

# Register your models here.

@admin.register(Opinion)
class OpinionAdmin(admin.ModelAdmin):
    list_display = ('id','author','target_user','date','score','description')
    search_fields = ('id','author','target_user','date','score','description')
    list_filter = ('score',)