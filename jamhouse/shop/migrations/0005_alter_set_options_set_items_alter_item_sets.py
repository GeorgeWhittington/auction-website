# Generated by Django 4.1.6 on 2023-02-10 12:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0004_rename_item_desc_item_description_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='set',
            options={'verbose_name_plural': 'Sets'},
        ),
        migrations.AddField(
            model_name='set',
            name='items',
            field=models.ManyToManyField(blank=True, to='shop.item'),
        ),
        migrations.AlterField(
            model_name='item',
            name='sets',
            field=models.ManyToManyField(blank=True, to='shop.set'),
        ),
    ]
