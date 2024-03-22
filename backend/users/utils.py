import re

from django.shortcuts import get_object_or_404
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode

from users.models import CustomUser


def validate_email(email):
    patron = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.compile(patron).match(email)

def get_user(uidb64):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = get_object_or_404(CustomUser, pk=uid)
    except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
        user = None
    return user