from django.utils.deprecation import MiddlewareMixin

class CookieToHeaderMiddleware(MiddlewareMixin):
    """Extrae el token de la cookie y lo coloca en el header Authorization"""

    def process_request(self, request):
        token = request.COOKIES.get("access_token")
        if token:
            request.META["HTTP_AUTHORIZATION"] = f"Bearer {token}"
