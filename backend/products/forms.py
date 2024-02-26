from django import forms
from .models import Product

class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ['product_type', 'price', 'name', 'description', 'stock_quantity' ,'imageRoute']
