from django.urls import path
from .views import save_calculation, list_calculations

urlpatterns = [
    path("save/", save_calculation),
    path("list/", list_calculations),
]
