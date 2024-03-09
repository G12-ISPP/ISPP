from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from rest_framework import routers

from products.views import ProductsView, AddProductAPIView

router = routers.DefaultRouter()
router.register('products', ProductsView, basename='products')  # Register the ProductsView class

urlpatterns = [
    path('api/v1/', include(router.urls)),
    path('add-product', AddProductAPIView.as_view(), name='add_product'),
    ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
