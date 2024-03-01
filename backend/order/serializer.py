from rest_framework import serializers
from .models import Order, OrderProduct
from products.serializer import ProductSerializer

class OrderProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderProduct
        fields = ['order', 'product', 'quantity']

class OrderSerializer(serializers.ModelSerializer):
    products = OrderProductSerializer()
    
    class Meta:
        model = Order
        fields = ['id', 'buyer', 'price', 'status', 'address', 'city', 'postal_code', 'payment', 'date', 'payed', 'buyer_mail']