from datetime import timedelta
from django.utils import timezone
from django.db import models
import uuid

# Create your models here.
class Order(models.Model):
    STATUS_CHIOCES = [
        ('P','Pendiente'),
        ('C','Cancelado'),
        ('E','Enviado'),
        ('R','En reparto')
    ]

    PAYMENT_CHOICES = [
        ('C','Contrareembolso'),
        ('T','Transferencia')
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    buyer = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=1, choices=STATUS_CHIOCES)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=50)
    postal_code = models.CharField(max_length=5)
    payment = models.CharField(max_length=1, choices=PAYMENT_CHOICES)
    date = models.DateField(auto_now_add=True)
    products = models.ManyToManyField('products.Product', through='OrderProduct')
    payed = models.BooleanField(default=False)
    buyer_mail = models.EmailField(max_length=254,null=False,blank=False,default='a@a.com')

class OrderProduct(models.Model):
    STATUS_CHIOCES = [
        ('Pendiente','Pendiente'),
        ('Cancelado','Cancelado'),
        ('Enviado','Enviado'),
        ('En reparto','En reparto')
    ]
    state = models.CharField(max_length=10, choices=STATUS_CHIOCES, default='Pendiente')
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)

class OrderActionToken(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    seller = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE)  # Nuevo campo para el vendedor
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(default=timezone.now() + timedelta(days=5)) # 5 días de validez

    def is_valid(self):
        return timezone.now() < self.expires_at