from django.http import JsonResponse
from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from products.serializer import ProductSerializer
from .models import Product


class AddProductAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        print(request.data)
        data = request.data
        product_type = data.get('product_type')
        price = data.get('price')
        name = data.get('name')
        description = data.get('description')
        stock_quantity = data.get('stock_quantity')
        image = request.FILES.get('file')

        # Verificar que todos los campos requeridos estén presentes
        if not all([product_type, price, name, description, image]):
            return JsonResponse({'error': 'Todos los campos son obligatorios'}, status=status.HTTP_400_BAD_REQUEST)

        # Verificar el tipo de producto
        if product_type not in dict(Product.TYPE_CHOICES):
            return JsonResponse({'error': 'Tipo de producto no válido'}, status=status.HTTP_400_BAD_REQUEST)

        # Validar el precio
        try:
            price = float(price)
            if not (0 < price < 1000000):
                return JsonResponse({'error': 'El precio debe estar entre 0 y 1,000,000'}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return JsonResponse({'error': 'El precio debe ser un número válido'}, status=status.HTTP_400_BAD_REQUEST)

        # Validar la cantidad de stock
        try:
            stock_quantity = int(stock_quantity)
            if not (0 < stock_quantity <= 100):
                return JsonResponse({'error': 'La cantidad debe estar entre 1 y 100'}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return JsonResponse({'error': 'La cantidad de stock debe ser un número entero válido'}, status=status.HTTP_400_BAD_REQUEST)

        # Guardar el producto en la base de datos
        product = self.create_product(product_type, price, name, description, stock_quantity, request.user, image)
        # Añade al contexto el request para que el serializador pueda accede

        self.request = request

        serializer = ProductSerializer(product, context={'request': request})
        return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)

    def create_product(self, product_type, price, name, description, stock_quantity, seller, image):
        return Product.objects.create(
            product_type=product_type,
            price=price,
            name=name,
            description=description,
            stock_quantity=stock_quantity,
            seller=seller,
            image=image
        )



# Create your views here.
class ProductsView(viewsets.ModelViewSet):
  serializer_class = ProductSerializer

  def get_queryset(self):
    queryset = Product.objects.all()
    type_filter = self.request.query_params.get('product_type')
    if type_filter:
      queryset = queryset.filter(product_type=type_filter)
    return queryset
  
  def get_serializer_context(self):
        """Asegura que la request esté disponible en el contexto del serializador."""
        return {'request': self.request}


  @action(detail=True, methods=['get'])
  def get_product_data(self, request, pk=None):
      product = self.get_object()
      serializer = self.get_serializer(product)
      return Response(serializer.data, status=status.HTTP_200_OK)