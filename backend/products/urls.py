from django.urls import path
from .views import add_product
from django.conf import settings
from django.conf.urls.static import static  

urlpatterns = [
    path('add-product', add_product, name='add-product'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
