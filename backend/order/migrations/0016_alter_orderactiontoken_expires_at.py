# Generated by Django 5.0.2 on 2024-04-20 13:41

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('order', '0015_alter_orderactiontoken_expires_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='orderactiontoken',
            name='expires_at',
            field=models.DateTimeField(default=datetime.datetime(2024, 4, 25, 13, 41, 17, 471712, tzinfo=datetime.timezone.utc)),
        ),
    ]