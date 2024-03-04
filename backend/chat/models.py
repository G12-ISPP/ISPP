from django.db import models
from users.models import CustomUser

class ChatRoom(models.Model):
    title = models.CharField(max_length=255)
    members = models.ManyToManyField(CustomUser, related_name='chatrooms')

    def __str__(self):
        return self.title

class Message(models.Model):
    room = models.ForeignKey(ChatRoom, related_name='messages', on_delete=models.CASCADE)
    author = models.ForeignKey(CustomUser, related_name='messages', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.author.username + ": " + self.content[:20]
