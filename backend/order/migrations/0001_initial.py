# Generated by Django 4.2.7 on 2024-02-21 10:02

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('status', models.CharField(choices=[('P', 'Pendiente'), ('C', 'Cancelado'), ('E', 'Enviado'), ('R', 'En reparto')], max_length=1)),
                ('address', models.CharField(max_length=255)),
                ('city', models.CharField(max_length=50)),
                ('postal_code', models.CharField(max_length=5)),
                ('payment', models.CharField(choices=[('C', 'Contrareembolso'), ('T', 'Transferencia')], max_length=1)),
                ('date', models.DateField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='OrderProduct',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.IntegerField(default=1)),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='order.order')),
            ],
        ),
    ]
