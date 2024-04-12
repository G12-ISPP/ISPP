from django.urls import path
from comment.views import CommentViewSet  

urlpatterns = [
    path('add_comment/', CommentViewSet.add_comment, name='add_comment'),
    path('update_comment/<int:pk>/', CommentViewSet.update_comment, name='update_comment'),
    path('delete_comment/<int:pk>/', CommentViewSet.delete_comment, name='delete_comment'),
]