from django.shortcuts import render
from users.models import CustomUser
from chat.views import get_user_from_token
from rest_framework import viewsets
from django.conf import settings
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from opinion.models import Opinion
from opinion.serializer import OpinionSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

class OpinionView(viewsets.ModelViewSet):
    serializer_class = OpinionSerializer

    ruta_backend = settings.RUTA_BACKEND
    ruta_frontend = settings.RUTA_FRONTEND

    @api_view(['POST'])
    @csrf_exempt
    @login_required
    def add_opinion(request):
        if request.method == 'POST':
            # Verifica si el usuario ya ha dejado una opinión para el usuario objetivo
            existing_opinion = Opinion.objects.filter(author=request.user, target_user_id=request.data.get('target_user')).exists()
            if existing_opinion:
                return JsonResponse({'error': 'Ya has dejado una opinión para este usuario'}, status=403)

            description = request.data.get('description')
            score = request.data.get('score')
            target_user_id = request.data.get('target_user')
            date = request.data.get('date')

            if not all([description, score, target_user_id, date]):
                return JsonResponse({'error': 'Todos los campos son obligatorios'}, status=400)

            if request.user.id == int(target_user_id):
                return JsonResponse({'error': 'No puedes dejarte una opinión a ti mismo'}, status=403)

            if int(score) < 1 or int(score) > 5:
                return JsonResponse({'error': 'La puntuación debe estar entre 1 y 5'}, status=400)

            if len(description) < 10 or len(description) > 255:
                return JsonResponse({'error': 'La descripción debe tener entre 10 y 255 caracteres'}, status=400)

            try:
                target_user = CustomUser.objects.get(id=target_user_id)
            except CustomUser.DoesNotExist:
                return JsonResponse({'error': 'El usuario objetivo no existe'}, status=400)

            if request.user.is_authenticated:
                opinion = Opinion(
                    author=get_user_from_token(request.headers.get('Authorization', '').split(' ')[1]),
                    target_user=target_user,
                    date=date,
                    score=score,
                    description=description,
                )
                opinion.save()

                return JsonResponse({'message': 'Opinión añadida correctamente'}, status=201)

        return JsonResponse({'error': 'Método no permitido'}, status=405)
    
    def get_queryset(self):
        queryset = Opinion.objects.all()
        user_filter = self.request.query_params.get('target_user')
        
        if user_filter:
            queryset = queryset.filter(target_user=user_filter)
                
        return queryset
    
    def get_serializer_context(self):
            """Asegura que la request esté disponible en el contexto del serializador."""
            return {'request': self.request}


    @action(detail=True, methods=['get'])
    def get_opinion_data(self, request, pk=None):
        opinion = self.get_object()
        serializer = self.get_serializer(opinion)
        return Response(serializer.data, status=status.HTTP_200_OK)
