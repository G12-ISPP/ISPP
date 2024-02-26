from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.decorators import action
from products.models import Product
from products.serializer import ProductSerializer

# Create your views here.
class ProductsView(viewsets.ModelViewSet):
  serializer_class = ProductSerializer

  def get_queryset(self):
    queryset = Product.objects.all()
    type_filter = self.request.query_params.get('product_type')
    if type_filter:
      queryset = queryset.filter(product_type=type_filter)
    return queryset

  # New function
  @action(detail=True, methods=['get'])
  def get_product_data(self, request, pk=None):
      product = self.get_object()
      serializer = self.get_serializer(product)
      return Response(serializer.data, status=status.HTTP_200_OK)