from django.urls import path
from .views import create_custom_design, confirm, cancel,details, update_status_finish, list_searching_printer_designs, loguedUser, update_design_status, details_to_printer,custom_designs_to_print, custom_designs_request
from django.conf import settings
from django.conf.urls.static import static  

urlpatterns = [
    path('my-design', create_custom_design, name='create_custom_design'),
    path('confirm/<uuid:id>', confirm, name='confirm'),
    path('cancel/<uuid:id>', cancel, name='cancel'),
    path('details/<uuid:id>', details, name='details'),
    path('details-to-printer/<uuid:id>', details_to_printer, name='details_to_printer'),
    path('loguedUser', loguedUser, name='loguedUser'),
    path('searching_printer', list_searching_printer_designs, name='list_searching_printer_designs'),
    path('update-status/<uuid:design_id>/', update_design_status, name='update_design_status'),
    path('update-status-finish/<uuid:design_id>/',update_status_finish , name='update_design_status_finish'),
    path('to-print/<str:printer_id>/', custom_designs_to_print, name='custom_designs_to_print'),
    path('requests/<str:buyer_id>/', custom_designs_request, name='custom_designs_request'),


] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)