from rest_framework import status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from .models import CustomDesign
from .serializer import CustomDesignSerializer
import json

@api_view(['POST'])
@parser_classes((MultiPartParser, FormParser))
def create_custom_design(request):
    data_json = request.POST.get('data')
    if data_json:
        data = json.loads(data_json)
        design_file = request.FILES.get('file')
        if design_file:
            name = data.get('name')
            quantity = data.get('quantity')
            quality = data.get('quality')
            dimensions = data.get('dimensions')
            area = data.get('area')
            volume = data.get('volume')
            weight = data.get('weight')
            price = data.get('price')        
            custom_design = CustomDesign.objects.create(
                name=name,
                quantity=quantity,
                quality=quality,
                dimensions=dimensions,
                area=area,
                volume=volume,
                weight=weight,
                price=price,
                design_file=design_file
            )
            serializer = CustomDesignSerializer(custom_design, many=False)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response('Invalid data', status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response('Invalid data', status=status.HTTP_400_BAD_REQUEST)


