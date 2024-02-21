from django.db import models

# Create your models here.
class Opinion(models.Model):
    id = models.AutoField(primary_key=True)
    author = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE, related_name='author')
    target_user = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE, related_name='target_user')
    date = models.DateField(auto_now_add=True)
    score = models.IntegerField(choices=[(i, i) for i in range(1, 6)], blank=False, null=False)
    description = models.TextField(max_length=500, null=False, blank=False)