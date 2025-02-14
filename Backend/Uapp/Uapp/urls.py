"""
URL configuration for Uapp project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/', include('Auth_system.Users.urls')),
    path('api/token/',include('Auth_system.jwt_auth.urls')),
    path('api/chapters/',include('Content_system.Chapters.urls')),
    path('api/lessons/',include('Content_system.Lessons.urls')),
    path('api/tags/',include('Content_system.Tags.urls')),
    path('api/word-phrases/',include('Content_system.WordPhrases.urls')),
    path('api/questions/',include('Content_system.Questions.urls'))
]
