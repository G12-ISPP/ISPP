from django.urls import path, include
from report.views import ReportView
from rest_framework import routers
from django.conf.urls.static import static  
from django.conf import settings

router =   routers.DefaultRouter()
router.register('reports', ReportView, basename='reports')  # Register the ReportView class

urlpatterns = [
    path('api/v1/', include(router.urls)),
    path('add-report-product', ReportView.add_report_product, name='add_report'),
    path('add-report-user', ReportView.add_report_user, name='add_report_user'),
    ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


