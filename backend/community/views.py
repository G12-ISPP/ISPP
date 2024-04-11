from tokenize import TokenError
from django.shortcuts import render
from requests import Response
from users.models import CustomUser
from community.serializer import PostSerializer, PostSerializerWrite
from community.models import Post, Like
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework.views import APIView
from django.http import JsonResponse
from django.db.models import Q
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from django.db import IntegrityError


# Create your views here.
def get_user_from_token(token):
    try:
        decoded_token = AccessToken(token)
        user_id = decoded_token['user_id']
        User = get_user_model()
        user = CustomUser.objects.get(id=user_id)
        return user
    except (TokenError, InvalidToken, CustomUser.DoesNotExist) as e:
        return None
    
class GetUserFromTokenView(APIView):
    def post(self, request, format=None):
        token = request.headers.get('Authorization', '').split(' ')[1]
        current_user = get_user_from_token(token)
        aux = []
        for user in current_user.followings.all():
            aux.append(user.id)


        return JsonResponse({'id': current_user.id, 'username': current_user.username, 'email': current_user.email, 'following': aux})

class PostViewClass(APIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(users=self.request.user)

    def get_queryset(self):
        queryset = Post.objects.all()
        name = self.request.query_params.get('name', None)
        if name is not None:
            queryset = queryset.filter(Q(name__icontains=name))
        return queryset

    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return PostSerializer
        else:
            return PostSerializerWrite

    def get_permissions(self):
        if self.action == 'list' or self.action == 'retrieve':
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_serializer_context(self):
        return {'request': self.request, 'format': self.format_kwarg, 'view': self}

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        like_users_ids = instance.like_set.values_list('user__id', flat=True)

        post_data = serializer.data
        post_data['likes'] = list(like_users_ids)
        print(post_data)
        return Response(post_data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=204)

    def perform_update(self, serializer):
        serializer.save(users=self.request.user)    

    def get_post_by_usernames(self, request, username):
        queryset = Post.objects.filter(users__username=username)
        serializer = PostSerializer(queryset, many=True)
        return Response(serializer.data)
    
    def get_post_by_userids(request, userid):
        queryset = Post.objects.filter(users=userid)
        serializer = PostSerializer(queryset, many=True, context={'request': request})

        data = []
        for post in queryset:
            post_data = serializer.data.pop(0)  # Tomamos el primer elemento de la lista
            post_data['likes'] = list(post.like_set.values_list('user__username', flat=True))  # Agregamos los IDs de usuarios que dieron like al post
            data.append(post_data)

        return JsonResponse(data, safe=False)
    




@api_view(['POST'])
@csrf_exempt
@login_required
def add_post(request):
    if request.method == 'POST':
        name = request.data.get('name')
        description = request.data.get('description')
        users = get_user_from_token(request.headers.get('Authorization', '').split(' ')[1])
        image = request.FILES.get('file')

        # Verificar que todos los campos requeridos estén presentes
        if not all([name, description, image]):
            return JsonResponse({'error': 'Todos los campos son obligatorios'}, status=400)

        # Guardar el psot en la base de datos
        if request.user.is_authenticated:
            post = Post(
                name=name,
                description=description,
                users=users,
                image=image 
            )
            post.save()

            return JsonResponse({'message': 'Post añadido correctamente'}, status=201)

    return JsonResponse({'error': 'Método no permitido'}, status=405)

@api_view(['POST'])
@csrf_exempt
@login_required
def like(request, postId):
    if request.method == 'POST':
        token = request.headers.get('Authorization', '').split(' ')[1]
        user = get_user_from_token(token)
        if user is None:
            return JsonResponse({'error': 'Invalid token'}, status=401) 
        
        post = get_object_or_404(Post, id=postId)
        
        try:
            if Like.objects.filter(user=user, post=post).exists():
                return JsonResponse({'error': 'Ya existe un like para este usuario y post.'}, status=400)

            Like.objects.create(
                user=user,
                post=post
            )
            return JsonResponse({'message': 'Like creado exitosamente!'}, status=200)
        except Exception as e:
            return JsonResponse({'error': f'Error al crear el like: {e}'}, status=500)

@api_view(['DELETE'])
@csrf_exempt
@login_required
def delete_like(request, postId):
    if request.method == 'DELETE':
        token = request.headers.get('Authorization', '').split(' ')[1]
        user = get_user_from_token(token)
        if user is None:
            return JsonResponse({'error': 'Invalid token'}, status=401) 
        
        post = Post.objects.get(id=postId)

        try:
            like = Like.objects.get(user=user, post=post)
            like.delete()
            return JsonResponse({'message': 'Like eliminado exitosamente!'}, status=200)
        except Like.DoesNotExist:
            return JsonResponse({'error': 'No existe un like para este usuario y post.'}, status=404)
        except Exception as e:
            return JsonResponse({'error': f'Error al eliminar el like: {e}'}, status=500)