from django.urls import path, include
from rest_framework import routers
from rest_framework.documentation import include_docs_urls
from products.views import ProductsView  
from .views import add_product
from django.conf import settings
from django.conf.urls.static import static  

router = routers.DefaultRouter()
router.register('products', ProductsView, basename='products')  # Register the ProductsView class

urlpatterns = [
    path('api/v1/', include(router.urls)),
    path('add-product', add_product, name='add_product'),
    ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)