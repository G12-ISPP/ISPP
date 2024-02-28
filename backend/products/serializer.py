from rest_framework import serializers
from products.models import Product


class ProductSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    class Meta:
        model = Product
        fields = ('id', 'product_type', 'price', 'name', 'description', 'show', 'stock_quantity', 'seller', 'imageRoute', 'image_url')

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            return request.build_absolute_uri(obj.image.url)
        else:
            return None