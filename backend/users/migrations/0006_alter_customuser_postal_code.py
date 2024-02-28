# Generated by Django 5.0.2 on 2024-02-27 18:07

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_remove_customuser_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='postal_code',
            field=models.IntegerField(validators=[django.core.validators.MaxValueValidator(52999), django.core.validators.MinValueValidator(1000)]),
        ),
    ]