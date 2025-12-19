# accounts/authentication.py
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .firebase import verify_id_token
from .models import User

class FirebaseAuthentication(BaseAuthentication):
    def authenticate(self, request):
        header = request.headers.get("Authorization")
        if not header:
            return None
        try:
            token = header.replace("Bearer ", "")
            uid = verify_id_token(token)
            user, _ = User.objects.get_or_create(firebase_uid=uid)
            return (user, None)
        except Exception:
            raise AuthenticationFailed("Invalid Firebase token")
