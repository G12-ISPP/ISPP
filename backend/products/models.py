from django.db import models

# Create your models here.
class Product(models.Model):
    TYPE_CHOICES = [
        ('P','Printer'),
        ('D','Design'),
        ('M','Material'),
        ('I','Impression')
    ]
    product_type = models.CharField(max_length=1, choices=TYPE_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    name = models.CharField(max_length=30)
    description = models.TextField(max_length=200)
    show = models.BooleanField(default=False)
    stock_quantity = models.IntegerField(default=0)
    seller = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE)
    imageRoute = models.CharField(max_length=100, default='')
    image = models.ImageField(upload_to='products/')