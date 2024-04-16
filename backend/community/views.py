from tokenize import TokenError
from django.shortcuts import render
from requests import Response
from comment.serializer import CommentSerializer
from users.models import CustomUser
from community.serializer import PostSerializer, PostSerializerWrite
from community.models import Post
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
from comment.models import Comment
from django.shortcuts import get_object_or_404



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
        return Response(serializer.data)

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
        return JsonResponse(serializer.data, safe=False)
    
    def get_post_by_id(request, postid):
        queryset = Post.objects.filter(id=postid)
        serializer = PostSerializer(queryset, many=True ,context={'request': request})

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


@api_view(['GET'])
def get_comments(request, postid):
    if request.method == 'GET':
        post = get_object_or_404(Post, id=postid)
        if not post:
            return JsonResponse({'error': 'El post no existe'}, status=404)
        comments = Comment.objects.filter(post=post)
        serializer = CommentSerializer(comments, many=True)
        return JsonResponse(serializer.data, safe=False, status=200)