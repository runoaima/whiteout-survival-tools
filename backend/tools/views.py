from rest_framework.decorators import api_view
from rest_framework.response import Response
from .services.material_calc import calc_material

@api_view(['POST'])
def material_calc_view(request):
    current = request.data['current']
    target = request.data['target']
    table = request.data['table']
    result = calc_material(current, target, table)
    return Response(result)
