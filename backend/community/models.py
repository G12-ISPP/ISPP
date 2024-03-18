from django.db import models

# Create your models here.
class Post(models.Model):
    name = models.CharField(max_length=30)
    description = models.TextField(max_length=200)
    image = models.ImageField(upload_to='posts/')    
    users = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE)

    def __str__(self):
        return self.name