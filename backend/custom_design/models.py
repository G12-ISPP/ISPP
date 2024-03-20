from django.db import models

class CustomDesign(models.Model):

    STATUS_CHOICES = [
            ('searching', 'Buscando impresor'),
            ('printing', 'Imprimiendo'),
            ('printed', 'Impreso'),
        ]

    COLOR_CHOICES = [
        ('red', 'Rojo'),
        ('green', 'Verde'),
        ('blue', 'Azul'),
    ]

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

    buyer = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE, related_name='bought_designs', null=True)
    postal_code = models.CharField(max_length=5,null=False,blank=False,default='41720')
    address = models.CharField(max_length=255, null=True)
    city = models.CharField(max_length=50,null=False,blank=False,default='a')
    buyer_mail = models.EmailField(max_length=254,null=False,blank=False,default='a@a.com')

    payed = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='searching',
        help_text='Estado del diseño personalizado'
    )

    printer = models.ForeignKey('users.CustomUser', on_delete=models.SET_NULL, null=True, blank=True, related_name='printed_designs', help_text='Impresor asignado al diseño')

    color = models.CharField(max_length=20, choices=COLOR_CHOICES, default='red', help_text='Color del diseño')

    def __str__(self):
        return self.name