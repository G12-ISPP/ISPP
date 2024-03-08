from rest_framework import serializers
from opinion.models import Opinion

class OpinionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Opinion
        fields = '__all__'
