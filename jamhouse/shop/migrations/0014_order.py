# Generated by Django 4.1.6 on 2023-04-22 13:55

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import shop.models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('shop', '0013_set_archived'),
    ]

    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('creation_time', models.DateTimeField(blank=True, null=True)),
                ('status', models.IntegerField(choices=[(0, 'OPEN'), (1, 'PENDING'), (3, 'COMPLETE'), (4, 'CANCELLED')], default=shop.models.OrderStatus['OPEN'])),
                ('items', models.ForeignKey(blank=True, on_delete=django.db.models.deletion.DO_NOTHING, to='shop.item')),
                ('sets', models.ForeignKey(blank=True, on_delete=django.db.models.deletion.DO_NOTHING, to='shop.set')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
