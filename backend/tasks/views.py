from django.shortcuts import render
from rest_framework import viewsets

from tasks.models import Task
from tasks.serializer import TaskSerializer


# Create your views here.
class TaskView(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    queryset = Task.objects.all()

