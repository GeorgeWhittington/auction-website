# Generated by Django 4.1.6 on 2023-03-30 14:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0010_remove_set_images_item_images'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='image',
            name='name',
        ),
        migrations.RemoveField(
            model_name='image',
            name='path',
        ),
        migrations.AddField(
            model_name='image',
            name='alt',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='image',
            name='img',
            field=models.ImageField(blank=True, upload_to=''),
        ),
    ]
