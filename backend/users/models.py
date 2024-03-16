from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxValueValidator, MinValueValidator

class CustomUser(AbstractUser):

    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    address = models.CharField(max_length=255)
    postal_code = models.IntegerField(
        validators=[    
            MaxValueValidator(52999),
            MinValueValidator(0000)
        ]
    )
    city = models.CharField(max_length=50)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_designer = models.BooleanField(default=False)
    is_printer = models.BooleanField(default=False)

    buyer_plan = models.BooleanField(default=False)
    buyer_plan_date = models.DateField(null=True, blank=True)
    seller_plan = models.BooleanField(default=False)
    seller_plan_date = models.DateField(null=True, blank=True)
    designer_plan = models.BooleanField(default=False)
    designer_plan_date = models.DateField(null=True, blank=True)

    USERNAME_FIELD = 'username'
    
    REQUIRED_FIELDS = ['email', 'address', 'city','postal_code']

    def __str__(self):
        return self.username
        