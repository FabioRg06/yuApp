# Generated by Django 5.1.5 on 2025-02-14 04:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Users', '0004_alter_userprogress_unique_together_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprogress',
            name='score',
            field=models.FloatField(default=0.0),
        ),
    ]
