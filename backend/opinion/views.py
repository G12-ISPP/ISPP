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

class OpinionView(viewsets.ModelViewSet):
    serializer_class = OpinionSerializer

    ruta_backend = settings.RUTA_BACKEND
    ruta_frontend = settings.RUTA_FRONTEND


    @api_view(['POST'])
    @csrf_exempt
    @login_required
    def add_opinion(request):
        if request.method == 'POST':
            description = request.data.get('description')
            score = request.data.get('score')
            target_user = CustomUser.objects.get(id=request.data.get('target_user'))
            date = request.data.get('date')

            # Verificar que todos los campos requeridos estén presentes
            if not all([description, score, target_user, date]):
                return JsonResponse({'error': 'Todos los campos son obligatorios'}, status=400)

            # Guardar la opinion en la base de datos
            if request.user.is_authenticated:
                opinion = Opinion(
                    author=get_user_from_token(request.headers.get('Authorization', '').split(' ')[1]),
                    target_user=target_user,
                    date=date,
                    score=score,
                    description=description,
                )
                opinion.save()

                return JsonResponse({'message': 'Opinion añadido correctamente'}, status=201)

        return JsonResponse({'error': 'Método no permitido'}, status=405)