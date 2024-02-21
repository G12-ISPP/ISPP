from django.contrib import admin
from products.models import Product

# Register your models here.
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id','name','price','stock_quantity','product_type','description')
    search_fields = ('id','name','price','stock_quantity','product_type','description')
    list_filter = ('product_type','price','stock_quantity')
