from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import SearchHistory
from .serializers import SearchHistorySerializer


# Get current user's search history
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_search_history(request):

    searches = SearchHistory.objects.filter(
        user=request.user
    ).order_by('-searched_at')

    serializer = SearchHistorySerializer(
        searches,
        many=True
    )

    return Response({
        'count': searches.count(),
        'search_history': serializer.data
    })


# Delete one search history item
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_search_history(request, search_id):

    search = SearchHistory.objects.filter(
        id=search_id,
        user=request.user
    ).first()

    if not search:
        return Response(
            {'error': 'Search history item not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    search.delete()

    return Response({
        'message': 'Search history item deleted successfully'
    })


# Clear all search history
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def clear_search_history(request):

    deleted_count, _ = SearchHistory.objects.filter(
        user=request.user
    ).delete()

    return Response({
        'message': 'Search history cleared successfully',
        'deleted_count': deleted_count
    })