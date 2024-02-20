from django.urls import path, include
from rest_framework import routers
from rest_framework.documentation import include_docs_urls

from tasks.views import TaskView

router = routers.DefaultRouter()
router.register('tasks', TaskView, 'tasks')

urlpatterns = [
    path('api/v1/', include(router.urls)),
    path('docs/', include_docs_urls(title='Task API'))
]