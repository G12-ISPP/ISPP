from rest_framework import viewsets
from rest_framework.decorators import action
from products.models import Product
from products.serializer import ProductSerializer
from django.http import JsonResponse
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from .models import Product
from django.http import JsonResponse
from django.core.files.storage import FileSystemStorage
from django.conf import settings

ruta_backend = settings.RUTA_BACKEND
ruta_frontend = settings.RUTA_FRONTEND


@api_view(['POST'])
@csrf_exempt
def add_product(request):
    if request.method == 'POST':
        product_type = request.data.get('product_type')
        price = request.data.get('price')
        name = request.data.get('name')
        description = request.data.get('description')
        stock_quantity = request.data.get('stock_quantity')
        image = request.FILES.get('file')

        # Verificar que todos los campos requeridos estén presentes
        if not all([product_type, price, name, description, image]):
            return JsonResponse({'error': 'Todos los campos son obligatorios'}, status=400)

        # Verificar el tipo de producto
        if product_type not in dict(Product.TYPE_CHOICES):
            return JsonResponse({'error': 'Tipo de producto no válido'}, status=400)

        # Validar el precio
        try:
            price = float(price)
            if price <= 0:
                return JsonResponse({'error': 'El precio debe ser mayor que cero'}, status=400)
        except ValueError:
            return JsonResponse({'error': 'El precio debe ser un número válido'}, status=400)

        # Validar la cantidad de stock
        try:
            stock_quantity = int(stock_quantity)
            if stock_quantity < 0:
                return JsonResponse({'error': 'La cantidad de stock no puede ser negativa'}, status=400)
        except ValueError:
            return JsonResponse({'error': 'La cantidad de stock debe ser un número entero válido'}, status=400)

        # Guardar el producto en la base de datos
        if request.user.is_authenticated:
            product = Product(
                product_type=product_type,
                price=price,
                name=name,
                description=description,
                stock_quantity=stock_quantity,
                seller=request.user 
            )
            product.save()

            image = request.FILES.get('file')
            image_name = f'{product.id}.jpg'  # Generar el nombre de la imagen basado en el ID del producto
            product.imageRoute = image_name
            product.save()

            return JsonResponse({'message': 'Producto añadido correctamente'}, status=201)

    return JsonResponse({'error': 'Método no permitido'}, status=405)

@api_view(['POST'])
@csrf_exempt
def upload_image(request):
    if request.method == 'POST':
        image = request.FILES.get('file')
        if image:
            fs = FileSystemStorage(location='/public')
            filename = fs.save(image.name, image)
            uploaded_file_url = fs.url(filename)
            return JsonResponse({'image_url': uploaded_file_url})
        return JsonResponse({'error': 'No se seleccionó ninguna imagen'}, status=400)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

# Create your views here.
class ProductsView(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    queryset = Product.objects.all()

    @action(detail=True, methods=['get'])
    def get_product_data(self, request, pk=None):
        product = self.get_object()
        serializer = self.get_serializer(product)
