import firebase_admin
from firebase_admin import auth, credentials
import os

_app = None

def get_firebase_app():
    global _app
    if _app:
        return _app

    key_path = os.getenv("FIREBASE_KEY_PATH")

    if not key_path:
        raise RuntimeError("FIREBASE_KEY_PATH is not set")

    cred = credentials.Certificate(key_path)
    _app = firebase_admin.initialize_app(cred)
    return _app


def verify_id_token(token):
    get_firebase_app()
    return auth.verify_id_token(token)
