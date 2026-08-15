from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer

@api_view(['POST'])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({'message': 'User registered successfully', 'username': user.username, 'email': user.email}, status=201)
    return Response(serializer.errors, status=400)

@api_view(['POST'])
def login(request):
    identifier = (request.data.get('email') or request.data.get('username') or '').strip()
    password = request.data.get('password', '')
    user = User.objects.filter(email__iexact=identifier).first()
    username = user.username if user else identifier
    user = authenticate(request, username=username, password=password)
    if not user:
        return Response({'detail': 'Invalid email/username or password.'}, status=401)
    refresh = RefreshToken.for_user(user)
    return Response({'refresh': str(refresh), 'access': str(refresh.access_token)})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user
    return Response({
        'id': user.id,
        'username': user.username,
        'name': user.get_full_name() or user.username,
        'email': user.email,
        'is_staff': user.is_staff,
        'is_superuser': user.is_superuser,
    })
