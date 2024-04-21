from django.db import models

# Create your models here.
class Report(models.Model):
    REASONS = [
    ('P','Problema de calidad'),
    ('D','Derecho de Autor'),
    ('E','Problemas de envio/logistica'),
    ('C','Comportamiento abusivo del vendedor/comprador'),
    ('S','Spam o publicidad'),
    ('F', 'Fraude o estafa'),
    ('R', 'Robo de diseño/idea'),
    ('I', 'Inapropiado')
]
    title = models.CharField(max_length=100)
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE, null=True, blank=True)
    user = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE, null=True, blank=True, related_name='user')
    author_user = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE, related_name='author_user')  
    reason = models.CharField(max_length=1, choices=REASONS)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='reports/', null=True)

