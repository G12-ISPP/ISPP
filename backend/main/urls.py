"""
URL configuration for main project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from order.views import create_order, confirm_order, cancel_order, order_details, my_orders

urlpatterns = [
    path('admin/', admin.site.urls),
    path('tasks/', include('tasks.urls')),
    path('products/', include('products.urls')),
    path('designs/', include('custom_design.urls')),
    path('users/', include('users.urls')),
    path('products/', include('products.urls')),
    path('chat/', include('chat.urls')),
    path('newOrder', create_order, name='create_order'),
    path('order/confirm/<str:order_id>', confirm_order, name='confirm_order'),
    path('order/cancel/<str:order_id>', cancel_order, name='cancel_order'),
    path('order/details/<uuid:order_id>', order_details, name='order_details'),
    path('order/myorders', my_orders, name='my_orders')
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
