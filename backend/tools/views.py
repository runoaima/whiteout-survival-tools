import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import ToolCalculation
from .firebase_auth import verify_firebase_token


def _get_uid(request):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise Exception("No token")

    token = auth_header.replace("Bearer ", "")
    return verify_firebase_token(token)


@csrf_exempt
def save_calculation(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)

    try:
        uid = _get_uid(request)
    except Exception:
        return JsonResponse({"error": "Unauthorized"}, status=401)

    body = json.loads(request.body)

    ToolCalculation.objects.create(
        user_uid=uid,
        tool=body["tool"],
        title=body.get("title", ""),
        input_data=body["input"],
        result_data=body["result"],
    )

    return JsonResponse({"status": "ok"})


def list_calculations(request):
    try:
        uid = _get_uid(request)
    except Exception:
        return JsonResponse({"error": "Unauthorized"}, status=401)

    items = ToolCalculation.objects.filter(
        user_uid=uid
    ).order_by("-created_at")

    return JsonResponse({
        "results": [
            {
                "id": i.id,
                "tool": i.tool,
                "title": i.title,
                "created_at": i.created_at,
                "input": i.input_data,
                "result": i.result_data,
            }
            for i in items
        ]
    })
