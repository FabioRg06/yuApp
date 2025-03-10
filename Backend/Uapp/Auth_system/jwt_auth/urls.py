from django.urls import path
from .views import ValidateTokenView, CookieTokenRefreshView, LogoutView

urlpatterns = [
    path("validate-token/", ValidateTokenView.as_view(), name="validate-token"),
    path("refresh/", CookieTokenRefreshView.as_view(), name="cookie_token_refresh"),
    path("logout/", LogoutView.as_view(), name="logout"),  
]