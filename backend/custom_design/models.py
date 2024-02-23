from django.db import models

# Create your models here.
class CustomDesign(models.Model):

    custom_design_id = models.AutoField(primary_key=True)
    design_file = models.FileField(upload_to='designs/')
    name = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField(default=1)
    quality = models.CharField(max_length=50)
    
    dimensions = models.JSONField(default=dict)
    
    area = models.DecimalField(max_digits=10, decimal_places=2)
    volume = models.DecimalField(max_digits=10, decimal_places=2)
    weight = models.DecimalField(max_digits=10, decimal_places=2)
    
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return self.name