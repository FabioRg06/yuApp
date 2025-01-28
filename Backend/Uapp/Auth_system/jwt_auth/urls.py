from django.urls import path
from .views import ValidateTokenView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("validate-token/", ValidateTokenView.as_view(), name="validate-token"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
