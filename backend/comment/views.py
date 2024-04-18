from django.http import JsonResponse
from rest_framework import viewsets
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets
from rest_framework.decorators import api_view

from community.models import Post
from users.models import CustomUser
from .models import Comment
from .serializer import CommentSerializer


# Create your views here.

class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer

    @api_view(['POST'])
    @csrf_exempt
    def add_comment(request):
        if request.method == 'POST':
            post_id = request.data.get('post_id')
            content = request.data.get('comment')
            user_id = request.data.get('user_id')
            try:
                user = get_object_or_404(CustomUser, id=user_id)
                post = get_object_or_404(Post, id=post_id)
            except Exception as e:
                return JsonResponse({'error': 'El usuario o el post no existe'}, status=404)
            if len(content) > 200:
                return JsonResponse({'error': 'El comentario no puede tener más de 200 caracteres'}, status=400)
            if Comment.objects.filter(user=user, post=post).exists():
                return JsonResponse({'error': 'Ya has comentado este post'}, status=403)
            comment = Comment(user=user, post=post, content=content)
            comment.save()
            return JsonResponse({'message': 'Comentario añadido correctamente'}, status=201)
        
    @api_view(['PUT'])
    @csrf_exempt
    def update_comment(request, pk):
        if request.method == 'PUT':
            comment = get_object_or_404(Comment, id=pk)
            content = request.data.get('comment')
            if not comment:
                return JsonResponse({'error': 'El comentario no existe'}, status=404)
            if len(content) > 200:
                return JsonResponse({'error': 'El comentario no puede tener más de 200 caracteres'}, status=400)
            comment.content = content
            comment.save()
            return JsonResponse({'message': 'Comentario actualizado correctamente'}, status=200)
        
    @api_view(['DELETE'])
    @csrf_exempt
    def delete_comment(request, pk):
        if request.method == 'DELETE':
            comment = get_object_or_404(Comment, id=pk)
            if not comment:
                return JsonResponse({'error': 'El comentario no existe'}, status=404)
            comment.delete()
            return JsonResponse({'message': 'Comentario eliminado correctamente'}, status=200)
        
    @api_view(['GET'])
    def get_comments(request, postid):
        if request.method == 'GET':
            post = get_object_or_404(Post, id=postid)
            if not post:
                return JsonResponse({'error': 'El post no existe'}, status=404)
            comments = Comment.objects.filter(post=post)
            serializer = CommentSerializer(comments, many=True)
            print(comments)
            return JsonResponse(serializer.data, safe=False, status=200)

