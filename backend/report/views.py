import datetime
from genericpath import exists
from django.http import HttpResponse, JsonResponse
import json
from django.shortcuts import render
from requests import Response
from opinion.tests import User
from products.models import Product
from users.models import CustomUser
from community.views import get_user_from_token
from report.serializer import ReportSerializer
from report.models import Report
from rest_framework import viewsets
from rest_framework import status
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
class ReportView(viewsets.ModelViewSet):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer

    def get_queryset(self):
        return Report.objects.all()

    @api_view(['POST'])
    def add_report_product(request):
        if request.method == 'POST':
            author_user = get_user_from_token(request.headers.get('Authorization', '').split(' ')[1])
            image = request.data.get('file')
            title = request.data.get('title')
            description = request.data.get('description')
            reason = request.data.get('reason')
            product = Product.objects.get(id=request.data.get('product'))
            created_at = datetime.datetime.now()

            if not all([author_user, image, title, description, reason, created_at, product]):
                return JsonResponse({'error': 'Todos los campos son obligatorios'}, status=400)

            if Report.objects.filter(product=product, author_user=author_user).__len__() > 0:
                return JsonResponse({'error': 'Ya has reportado a este producto'}, status=400)
            
            if request.user.is_authenticated:    
                report = Report(
                    author_user=author_user,
                    image=image,
                    title=title,
                    description=description,
                    reason=reason,
                    created_at=created_at,
                    product=product,
                    user=None
                )

                report.save()

                return JsonResponse({'message': 'Producto reportado correctamente'}, status=201)

            return JsonResponse({'error': 'No se ha podido añadir el reporte'}, status=400)
        
    def get_report(self, request, pk):
        report = Report.objects.get(id=pk)
        serializer = ReportSerializer(report)
        return Response(serializer.data)
        
    @api_view(['POST'])
    def add_report_user(request):
        if request.method == 'POST':
            author_user = get_user_from_token(request.headers.get('Authorization', '').split(' ')[1])
            image = request.data.get('file')
            title = request.data.get('title')
            description = request.data.get('description')
            reason = request.data.get('reason')
            user = User.objects.get(id=request.data.get('user'))
            created_at = datetime.datetime.now()

            if not all([author_user, image, title, description, reason, created_at, user]):
                return JsonResponse({'error': 'Todos los campos son obligatorios'}, status=400)

            if Report.objects.filter(user=user, author_user=author_user).__len__() > 0:
                return JsonResponse({'error': 'Ya has reportado a este usuario'}, status=400)
            
            if request.user.is_authenticated:    
                report = Report(
                    author_user=author_user,
                    image=image,
                    title=title,
                    description=description,
                    reason=reason,
                    created_at=created_at,
                    product=None,
                    user=user
                )

                report.save()

                return JsonResponse({'message': 'Usuario reportado correctamente'}, status=201)

            return JsonResponse({'error': 'No se ha podido añadir el reporte'}, status=400)
        
        
    def get_report_user(self, request, pk):
        report = Report.objects.get(id=pk)
        serializer = ReportSerializer(report)
        return Response(serializer.data)