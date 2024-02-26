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

class OrderProduct(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)