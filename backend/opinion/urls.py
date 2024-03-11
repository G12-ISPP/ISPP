from django.urls import path, include
from rest_framework import routers
from rest_framework.documentation import include_docs_urls
from opinion.views import OpinionView  
from django.conf import settings
from django.conf.urls.static import static  

router = routers.DefaultRouter()
router.register('opinion', OpinionView, basename='opinion')  # Register the ProductsView class

urlpatterns = [
    path('api/v1/', include(router.urls)),
    path('add-opinion', OpinionView.add_opinion, name='add_opinion'),
]