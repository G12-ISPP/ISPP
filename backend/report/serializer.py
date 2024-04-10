from rest_framework import serializers
from report.models import Report


class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ('id', 'title', 'description', 'product', 'user', 'author_user', 'reason', 'created_at', 'image_url')

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            return request.build_absolute_uri(obj.image.url)
        else:
            return None