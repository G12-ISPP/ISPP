from genericpath import exists
from django.http import HttpResponse, JsonResponse
import json
from django.shortcuts import render
from requests import Response
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
            author = get_user_from_token(request.headers.get('Authorization', '').split(' ')[1])
            data = json.loads(request.body)
            data['author_user'] = author.id
            serializer = ReportSerializer(data=data)
            if Report.objects.filter(product=data['product'], author_user=author.id).__len__() > 0:
                return HttpResponse(status=status.HTTP_401_UNAUTHORIZED)
            if serializer.is_valid():
                serializer.save()
                return HttpResponse(status=status.HTTP_201_CREATED)
            return HttpResponse( status=status.HTTP_400_BAD_REQUEST)
        
    def get_report(self, request, pk):
        report = Report.objects.get(id=pk)
        serializer = ReportSerializer(report)
        return Response(serializer.data)
    
    @api_view(['POST'])
    def add_report_user(request):
        if request.method == 'POST':
            author = get_user_from_token(request.headers.get('Authorization', '').split(' ')[1])
            data = json.loads(request.body)
            data['author_user'] = author.id
            serializer = ReportSerializer(data=data)
            if Report.objects.filter(user=data['user'], product=None).__len__() > 0:
                return JsonResponse({'error': 'Ya has reportado a este usuario'}, status=401)
            if serializer.is_valid():
                serializer.save()
                return HttpResponse(status=status.HTTP_201_CREATED)
            return HttpResponse( status=status.HTTP_400_BAD_REQUEST)
        
    def get_report_user(self, request, pk):
        report = Report.objects.get(id=pk)
        serializer = ReportSerializer(report)
        return Response(serializer.data)