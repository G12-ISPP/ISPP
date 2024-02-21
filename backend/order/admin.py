from django.contrib import admin
from order.models import Order, OrderProduct

# Register your models here.
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id','buyer','date','status','price')
    search_fields = ('id','buyer','date','status','price')
    list_filter = ('status','price')

@admin.register(OrderProduct)
class OrderProductAdmin(admin.ModelAdmin):
    list_display = ('order','product','quantity')
    search_fields = ('order','product','quantity')
    list_filter = ('quantity',)