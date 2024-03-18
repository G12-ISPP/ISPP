import os
import uuid

from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view

from conversion_to_stl.to_stl import MeshProcessor


# Create your views here.

@api_view(['POST'])
@csrf_exempt
def convert_to_stl(request):
    if request.method == 'POST':
        image = request.FILES.get('file')

        # Verificar que el archivo esté presente
        if not image:
            return JsonResponse({'error': 'La foto es obligatoria'}, status=400)

        if image.size > 30 * 1024 * 1024:  # 10 MB en bytes
            return JsonResponse({'error': 'El tamaño del archivo debe ser menor a 30 MB'}, status=400)

        # # Generar un nombre de archivo único con un UUID
        # unique_filename = str(uuid.uuid4())
        # file_name = f'{unique_filename}.jpg'  # Utiliza la extensión de archivo adecuada

        # Generar un nombre de archivo único con un UUID
        unique_filename = str(uuid.uuid4())
        extension = image.name.split('.')[-1]
        file_name = f'{unique_filename}.{extension}'

        # Rutas de archivos temporales y de salida
        temp_dir = 'media/tmp/'
        temp_path = os.path.join(temp_dir, file_name)
        output_stl_path = os.path.join(temp_dir, f'output_{unique_filename}.stl')

        # Verificar si la carpeta temporal existe, si no, crearla
        if not os.path.exists(temp_dir):
            os.makedirs(temp_dir)

        # Guardar el archivo de forma temporal
        with open(temp_path, 'wb') as destination:
            destination.write(image.read())

        # Procesar la malla y guardarla en formato STL
        mesh_processor = MeshProcessor(temp_path, output_stl_path)
        mesh_processor.process_and_write()

        # Abrir y leer el archivo STL convertido
        with open(output_stl_path, 'rb') as stl_file:
            response = HttpResponse(stl_file.read(), content_type='application/octet-stream')
            response['Content-Disposition'] = f'attachment; filename=output_{unique_filename}.stl'

        # Eliminar archivos temporales
        os.remove(temp_path)
        os.remove(output_stl_path)

        return response

    return JsonResponse({'error': 'Método no permitido'}, status=405)



