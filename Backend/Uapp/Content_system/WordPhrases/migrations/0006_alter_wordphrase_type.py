# Generated by Django 5.1.5 on 2025-03-04 01:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('WordPhrases', '0005_remove_wordphrase_lesson'),
    ]

    operations = [
        migrations.AlterField(
            model_name='wordphrase',
            name='type',
            field=models.CharField(choices=[('word', 'Word'), ('phrase', 'Phrase')], default='word', max_length=10),
        ),
    ]
