from rest_framework import serializers
from .models import CustomDesign

class CustomDesignSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomDesign
        fields = '__all__'

