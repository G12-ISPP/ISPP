from django.db import models
from users.models import CustomUser
from community.models import Post

# Create your models here.

class Comment(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    content = models.TextField(max_length=200)

    def __str__(self):
        return f"Comment by {self.user} on {self.post}"
