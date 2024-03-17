from django.urls import path, include
from rest_framework import routers
from rest_framework.documentation import include_docs_urls
from users.views import UsersView  
from .views import UserCreateAPIView, LoginView, get_user_id_by_username

router = routers.DefaultRouter()
router.register('users', UsersView, basename='users') 

urlpatterns = [
    path('api/v1/', include(router.urls)),
    path('register/', UserCreateAPIView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('get-user-id/<str:username>/', get_user_id_by_username, name='get_user_id_by_username'),
    path('update-profile/<int:pk>/', UsersView.as_view({'patch': 'update_profile'}), name='update_profile'),

]