# Generated by Django 4.2.7 on 2024-02-24 09:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('custom_design', '0004_customdesign_address_customdesign_buyer_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='customdesign',
            name='buyer_mail',
            field=models.EmailField(default='a@a.com', max_length=254),
        ),
    ]
