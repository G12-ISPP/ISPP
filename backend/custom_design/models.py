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

    buyer = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE,null=True)
    postal_code = models.CharField(max_length=5,null=False,blank=False,default='41720')
    address = models.CharField(max_length=255, null=True)
    city = models.CharField(max_length=50,null=False,blank=False,default='a')
    buyer_mail = models.EmailField(max_length=254,null=False,blank=False,default='a@a.com')


    date = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    
    def __str__(self):
        return self.name