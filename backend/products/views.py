from django.shortcuts import render

from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .forms import ProductForm

@api_view(['POST'])
def add_product(request):
    if request.method == 'POST':
        form = ProductForm(request.POST)
        if form.is_valid():
            product = form.save(commit=False)
            product.seller = request.user
            product.save()
            return JsonResponse({'message': 'Product added successfully'})
        else:
            return Response(form.errors, status=400)
