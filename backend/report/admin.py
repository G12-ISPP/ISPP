# Register your models here.
from django.contrib import admin
from report.models import Report

# Register your models here.
@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('id','title','description','product','user','created_at')
    search_fields = ('id','title','description','product','user','created_at')
    list_filter = ('title','product','user','created_at')