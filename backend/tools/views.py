from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def material_calc_view(request):
    current = request.data['current']
    target = request.data['target']
    table = request.data['table']
    result = calc_material(current, target, table)
    return Response(result)
