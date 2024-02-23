from django.urls import path, include
from rest_framework import routers
from rest_framework.documentation import include_docs_urls
from products.views import ProductsView  

router = routers.DefaultRouter()
router.register('products', ProductsView, basename='products')  # Register the ProductsView class

urlpatterns = [
    path('api/v1/', include(router.urls)),
]