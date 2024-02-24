from django.urls import path, include
from rest_framework import routers
from rest_framework.documentation import include_docs_urls
from users.views import UsersView  

router = routers.DefaultRouter()
router.register('users', UsersView, basename='users') 

urlpatterns = [
    path('api/v1/', include(router.urls)),
]