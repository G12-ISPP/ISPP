from django.shortcuts import render
from requests import Response
from report.serializer import ReportSerializer
from report.models import Report
from rest_framework import viewsets
from rest_framework import status

# Create your views here.
class ReportView(viewsets.ModelViewSet):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer

    def get_queryset(self):
        return Report.objects.all()

    def post_report(self, request):
        serializer = ReportSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_report(self, request, pk):
        report = Report.objects.get(id=pk)
        serializer = ReportSerializer(report)
        return Response(serializer.data)