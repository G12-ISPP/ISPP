from django import forms
from .models import Opinion

class ProductForm(forms.ModelForm):
    class Meta:
        model = Opinion
        fields = ['description', 'score', 'target_user', 'author', 'date']