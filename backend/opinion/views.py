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
            target_user_id = request.data.get('target_user')
            date = request.data.get('date')

            if not all([description, score, target_user_id, date]):
                return JsonResponse({'error': 'Todos los campos son obligatorios'}, status=400)

            if request.user.id == int(target_user_id):
                return JsonResponse({'error': 'No puedes dejarte una opinión a ti mismo'}, status=403)

            if int(score) < 1 or int(score) > 5:
                return JsonResponse({'error': 'La puntuación debe estar entre 1 y 5'}, status=400)

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
