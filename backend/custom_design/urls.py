from django.urls import path
from .views import create_custom_design, confirm, cancel
from django.conf import settings
from django.conf.urls.static import static  

urlpatterns = [
    path('my-design', create_custom_design, name='create_custom_design'),
    path('confirm/<int:id>', confirm, name='confirm'),
    path('cancel/<int:id>', cancel, name='cancel'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
