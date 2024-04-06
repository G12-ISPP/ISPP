from django.urls import path, include
from report.views import ReportView
from rest_framework import routers

router =   routers.DefaultRouter()
router.register('reports', ReportView, basename='reports')  # Register the ReportView class

urlpatterns = [
    path('api/v1/', include(router.urls)),
    path('add-report', ReportView.add_report, name='add_report'),
    ]


