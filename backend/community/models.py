from django.db import models
from users.models import CustomUser

# Create your models here.
class Post(models.Model):
    name = models.CharField(max_length=30)
    description = models.TextField(max_length=200)
    image = models.ImageField(upload_to='posts/')    
    users = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE)
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Like(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'post']

    def __str__(self):
        return f"Like by {self.user} on {self.post} at {self.created_at}"