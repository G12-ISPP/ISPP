from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from tokens.views import CustomTokenObtainPairView

urlpatterns = [
    path('api/v1/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/token/refresh/', TokenRefreshView.as_view(), name='token_refresh')
]