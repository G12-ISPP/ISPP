from django.urls import path
from .views import create_custom_design, confirm, cancel,details, list_searching_printer_designs, loguedUser
from django.conf import settings
from django.conf.urls.static import static  

urlpatterns = [
    path('my-design', create_custom_design, name='create_custom_design'),
    path('confirm/<int:id>', confirm, name='confirm'),
    path('cancel/<int:id>', cancel, name='cancel'),
    path('details/<int:id>', details, name='details'),
    path('details-to-printer/<int:id>', details, name='details_to_printer'),
    path('loguedUser', loguedUser, name='loguedUser'),
    path('searching_printer', list_searching_printer_designs, name='list_searching_printer_designs')

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
