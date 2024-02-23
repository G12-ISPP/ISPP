from rest_framework import serializers
from .models import CustomDesign

class CustomDesignSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomDesign
        fields = ('custom_design_id', 'design_file', 'name', 'volume', 'area', 'dimensions', 'weight', 'quality', 'quantity', 'price')

