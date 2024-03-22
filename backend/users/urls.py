from django.urls import path, include
from rest_framework import routers
from rest_framework.documentation import include_docs_urls
from users.views import UsersView, follow_toggle, follow_status, VerifyEmailView
from .views import UserCreateAPIView, LoginView, get_user_id_by_username

router = routers.DefaultRouter()
router.register('users', UsersView, basename='users') 

urlpatterns = [
    path('api/v1/', include(router.urls)),
    path('register/', UserCreateAPIView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('get-user-id/<str:username>/', get_user_id_by_username, name='get_user_id_by_username'),
    path('update-profile/<int:pk>/', UsersView.as_view({'patch': 'update_profile'}), name='update_profile'),
    path('api/v1/follow/<int:user_id>/toggle/', follow_toggle, name='follow_toggle'),
    path('api/v1/follow/<int:user_id>/status/', follow_status, name='follow_status'),
    path('api/v1/verify-email/<str:uidb64>/<str:token>/', VerifyEmailView.as_view(), name='verify_email'),
]