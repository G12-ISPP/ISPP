

from django.conf.urls.static import static
from django.urls import path

from conversion_to_stl.views import convert_to_stl
from main import settings

urlpatterns = [
                  path('api/v1/convert_to_stl', convert_to_stl, name='convert_to_stl')  # Register the ProductsView class
              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
