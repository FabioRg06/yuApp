# Generated by Django 5.1.5 on 2025-02-14 00:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Lessons', '0002_remove_lesson_lesson_type_lesson_description_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='lesson',
            name='score',
            field=models.FloatField(default=0.0),
        ),
    ]
