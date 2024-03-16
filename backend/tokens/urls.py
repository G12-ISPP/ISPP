from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('api/v1/token/refresh/', TokenRefreshView.as_view(), name='token_refresh')
]