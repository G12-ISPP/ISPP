from django.urls import path
from .views import CreateCustomDesignView, LoguedUserView, ConfirmDesignView, CancelDesignView, DesignDetailsView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('my-design', CreateCustomDesignView.as_view(), name='create_custom_design'),
    path('confirm/<int:id>', ConfirmDesignView.as_view(), name='confirm'),
    path('cancel/<int:id>', CancelDesignView.as_view(), name='cancel'),
    path('details/<int:id>', DesignDetailsView.as_view(), name='details'),
    path('loguedUser', LoguedUserView.as_view(), name='loguedUser')
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
