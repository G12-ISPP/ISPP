from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.decorators import api_view
from rest_framework.response import Response

from products.serializer import ProductSerializer
from users.models import CustomUser
from .models import Product

ruta_backend = settings.RUTA_BACKEND
ruta_frontend = settings.RUTA_FRONTEND


@api_view(['POST'])
@csrf_exempt
@login_required
def add_product(request):
    if request.method == 'POST':
        product_type = request.data.get('product_type')
        price = request.data.get('price')
        name = request.data.get('name')
        description = request.data.get('description')
        stock_quantity = request.data.get('stock_quantity')
        show = request.data.get('show')
        image = request.FILES.get('file')
        design = request.FILES.get('design') if product_type == 'D' else None

        # Verificar que todos los campos requeridos estén presentes
        if not all([product_type, price, name, description, image, stock_quantity, show]):
            return JsonResponse({'error': 'Todos los campos son obligatorios'}, status=400)

        # Verificar el tipo de producto
        if product_type not in dict(Product.TYPE_CHOICES):
            return JsonResponse({'error': 'Tipo de producto no válido'}, status=400)

        # Validar el precio
        try:
            price = float(price)
            if not (0 < price < 1000000):
                return JsonResponse({'error': 'El precio debe estar entre 0 y 1,000,000'}, status=400)
        except ValueError:
            return JsonResponse({'error': 'El precio debe ser un número válido'}, status=400)

        # Validar la cantidad de stock
        try:
            stock_quantity = int(stock_quantity)
            if not (0 < stock_quantity <= 100):
                return JsonResponse({'error': 'La cantidad debe estar entre 1 y 100'}, status=400)
        except ValueError:
            return JsonResponse({'error': 'La cantidad de stock debe ser un número entero válido'}, status=400)
        

        # Guardar el producto en la base de datos
        if request.user.is_authenticated:
            if show == 'true':
                products_showed = Product.objects.filter(seller=request.user, show=True)
                user = CustomUser.objects.get(username=request.user)
                if (user.seller_plan & user.designer_plan): 
                    if (products_showed.count() > 7):
                        return JsonResponse({'error': 'Ya hay 8 productos destacados'}, status=400)
                    else:
                        show = True
                elif (user.seller_plan):
                    if (products_showed.count() > 4):
                            return JsonResponse({'error': 'Ya hay 5 productos destacados'}, status=400)
                    else:
                        show = True
                elif (user.designer_plan):
                    if (products_showed.count() > 2):
                            return JsonResponse({'error': 'Ya hay 3 productos destacados'}, status=400)
                    else:
                        show = True
                else:
                    return JsonResponse({'error': 'No puedes destacar productos sin contratar un plan'}, status=400)
            else:
                show = False
            
            product = Product(
                product_type=product_type,
                price=price,
                name=name,
                description=description,
                stock_quantity=stock_quantity,
                seller=request.user,
                image=image,
                design=design,
                show=show 
            )
            product.save()

            return JsonResponse({'message': 'Producto añadido correctamente'}, status=201)

    return JsonResponse({'error': 'Método no permitido'}, status=405)

# Create your views here.
class ProductsView(viewsets.ModelViewSet):
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.all()
        type_filter = self.request.query_params.get('product_type')
        search_query = self.request.query_params.get('search')
        seller_filter = self.request.query_params.get('seller')  
        
        if type_filter:
            queryset = queryset.filter(product_type=type_filter)
        if seller_filter: 
            queryset = queryset.filter(seller_id=seller_filter)
        if search_query:
            queryset = queryset.filter(Q(name__icontains=search_query) | Q(description__icontains=search_query))
                
        return queryset
  
    def get_serializer_context(self):
        """Asegura que la request esté disponible en el contexto del serializador."""
        return {'request': self.request}


    @action(detail=True, methods=['get'])
    def get_product_data(self, request, pk=None):
        product = self.get_object()
        serializer = self.get_serializer(product)
        print(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)
  
    @action(detail=True, methods=['put'])
    def edit_product(self, request, pk=None):
        product = self.get_object()
        if request.user != product.seller:
            return Response({'error': 'No tienes permiso para editar este producto'}, status=status.HTTP_403_FORBIDDEN)

        price = request.data.get('price')
        name = request.data.get('name')
        description = request.data.get('description')
        stock_quantity = request.data.get('stock_quantity')
        show = request.data.get('show')
        image = request.FILES.get('file') if 'file' in request.FILES else None
        design = request.FILES.get('design') if product.product_type == 'D' else None

        if not all([price, name, description, show, stock_quantity]):
            return Response({'error': 'Todos los campos son obligatorios'}, status=status.HTTP_400_BAD_REQUEST)

        if show == 'true':
            show = True
        else:
            show = False
            
        try:
            price = float(price)
            if not (0 < price < 1000000):
                return Response({'error': 'El precio debe estar entre 0 y 1,000,000'}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response({'error': 'El precio debe ser un número válido'}, status=status.HTTP_400_BAD_REQUEST)

        if product.product_type == 'D':
            stock_quantity = 1
        else:
            try:
                stock_quantity = int(stock_quantity)
                if not (0 < stock_quantity <= 100):
                    return Response({'error': 'La cantidad debe estar entre 1 y 100'}, status=status.HTTP_400_BAD_REQUEST)
            except ValueError:
                return Response({'error': 'La cantidad de stock debe ser un número entero válido'}, status=status.HTTP_400_BAD_REQUEST)

        product.price = price
        product.name = name
        product.description = description
        product.show = show
        product.stock_quantity = stock_quantity
        if image:
            if product.image:
                product.image.delete(save=False)
            product.image = image

        if design:
            if product.design:
                product.design.delete(save=False)
            product.design = design

        product.save()
        return Response({'message': 'Producto actualizado correctamente'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['delete'])
    def delete_product(self, request, pk=None):
        product = get_object_or_404(Product, pk=pk)
        if not (request.user == product.seller or request.user.is_staff):
            return Response({'error': 'No tienes permiso para eliminar este producto'}, status=status.HTTP_403_FORBIDDEN)
        product.delete()
        return Response({'message': 'Producto eliminado correctamente'}, status=status.HTTP_204_NO_CONTENT)