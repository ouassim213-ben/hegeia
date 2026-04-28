from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Q, Max, Count
from .models import Post, Appointment, Availability, Comment, Like, Message, DailyProgress
from .serializers import (
    RegisterSerializer, UserSerializer, PostSerializer, 
    SpecialistSerializer, SpecialistDetailSerializer, 
    AppointmentSerializer, AvailabilitySerializer,
    UserUpdateSerializer, UserAppointmentHistorySerializer,
    CommentSerializer, MessageSerializer, DailyProgressSerializer
)
import logging

logger = logging.getLogger(__name__)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')
        
        user = User.objects.filter(email=email).first()
        if user and not user.check_password(password):
            user = None

        if user:
            if hasattr(user, 'profile') and user.profile.role == 'NUTRITIONIST' and not user.profile.is_approved:
                return Response({'error': 'Your account is pending admin approval. Please wait.'}, status=status.HTTP_403_FORBIDDEN)
            
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': UserSerializer(user).data
            })
        else:
            return Response({'error': 'Wrong Credentials'}, status=status.HTTP_400_BAD_REQUEST)

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Post.objects.filter(is_validated=True).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=['post'], url_path='toggle-like')
    def toggle_like(self, request, pk=None):
        post = self.get_object()
        user = request.user
        like_qs = Like.objects.filter(post=post, user=user)
        if like_qs.exists():
            like_qs.delete()
            return Response({'status': 'unliked', 'likes_count': post.likes.count()}, status=status.HTTP_200_OK)
        else:
            Like.objects.create(post=post, user=user)
            return Response({'status': 'liked', 'likes_count': post.likes.count()}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='add-comment')
    def add_comment(self, request, pk=None):
        post = self.get_object()
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, post=post)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SpecialistListView(generics.ListAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = SpecialistSerializer

    def get_queryset(self):
        queryset = User.objects.filter(profile__role='NUTRITIONIST', profile__is_approved=True)
        tier = self.request.query_params.get('tier')
        if tier:
            tier = tier.lower()
            if tier == 'premium':
                pass 
            elif tier == 'standard':
                queryset = queryset.filter(profile__tier__in=['basic', 'standard'])
            elif tier == 'basic':
                queryset = queryset.filter(profile__tier='basic')
            else:
                queryset = queryset.filter(profile__tier=tier)
        return queryset

class SpecialistDetailView(generics.RetrieveAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = SpecialistDetailSerializer
    queryset = User.objects.filter(profile__role='NUTRITIONIST', profile__is_approved=True)

class CreateAppointmentView(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = AppointmentSerializer

    def perform_create(self, serializer):
        specialist = serializer.validated_data.get('specialist')
        date = serializer.validated_data.get('date')
        time = serializer.validated_data.get('time')
        
        if Appointment.objects.filter(specialist=specialist, date=date, time=time).exists():
            from rest_framework import serializers
            raise serializers.ValidationError({"error": "This time slot is already booked."})
        
        serializer.save(patient=self.request.user)

class ManageAvailabilityView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        if not hasattr(request.user, 'profile') or request.user.profile.role != 'NUTRITIONIST':
            return Response({'error': 'Only specialists can have availability.'}, status=status.HTTP_403_FORBIDDEN)
        availabilities = Availability.objects.filter(specialist=request.user)
        serializer = AvailabilitySerializer(availabilities, many=True)
        return Response(serializer.data)

    def post(self, request):
        if not hasattr(request.user, 'profile') or request.user.profile.role != 'NUTRITIONIST':
            return Response({'error': 'Only specialists can configure availability.'}, status=status.HTTP_403_FORBIDDEN)
        data = request.data
        Availability.objects.filter(specialist=request.user).delete()
        new_availabilities = [Availability(specialist=request.user, **d) for d in data]
        Availability.objects.bulk_create(new_availabilities)
        return Response(AvailabilitySerializer(Availability.objects.filter(specialist=request.user), many=True).data)

class CurrentUserInfoView(generics.RetrieveUpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserUpdateSerializer

    def get_object(self):
        return self.request.user

class UserAppointmentListView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserAppointmentHistorySerializer

    def get_queryset(self):
        return Appointment.objects.filter(Q(patient=self.request.user) | Q(specialist=self.request.user)).order_by('-created_at')

class MessageViewSet(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = MessageSerializer

    def get_queryset(self):
        user = self.request.user
        partner_id = self.request.query_params.get('partner')
        chat_type = self.request.query_params.get('chat_type', 'SUPPORT')
        qs = Message.objects.filter(Q(sender=user) | Q(receiver=user)).filter(chat_type=chat_type)
        if partner_id:
            qs = qs.filter(Q(sender_id=partner_id) | Q(receiver_id=partner_id))
        return qs.order_by('timestamp')

    def perform_create(self, serializer):
        receiver_id = self.request.data.get('receiver')
        chat_type = self.request.data.get('chat_type', 'SUPPORT')
        if receiver_id:
            serializer.save(sender=self.request.user, receiver_id=receiver_id, chat_type=chat_type)
        else:
            admin = User.objects.filter(is_superuser=True).first() or User.objects.get(pk=1)
            serializer.save(sender=self.request.user, receiver=admin, chat_type='SUPPORT')

class NutritionistPatientsView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        if not hasattr(request.user, 'profile') or request.user.profile.role != 'NUTRITIONIST':
            return Response({'error': 'Only nutritionists can access this.'}, status=status.HTTP_403_FORBIDDEN)
        appointments = Appointment.objects.filter(specialist=request.user).order_by('-created_at')
        serializer = UserAppointmentHistorySerializer(appointments, many=True, context={'request': request})
        return Response(serializer.data)

class DailyProgressViewSet(viewsets.ModelViewSet):
    serializer_class = DailyProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        patient_id = self.request.query_params.get('patient_id')
        if hasattr(user, 'profile') and user.profile.role == 'NUTRITIONIST' and patient_id:
            return DailyProgress.objects.filter(user_id=patient_id)
        return DailyProgress.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# Admin Views
class AdminPendingPostsView(generics.ListAPIView):
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = PostSerializer
    def get_queryset(self): return Post.objects.filter(is_validated=False)

class AdminValidatePostView(APIView):
    permission_classes = (permissions.IsAdminUser,)
    def post(self, request, pk):
        post = Post.objects.get(pk=pk)
        post.is_validated = not post.is_validated
        post.save()
        return Response({'status': 'success', 'is_validated': post.is_validated})

class AdminDeletePostView(generics.DestroyAPIView):
    permission_classes = (permissions.IsAdminUser,)
    queryset = Post.objects.all()

class AdminUserListView(generics.ListAPIView):
    permission_classes = (permissions.IsAdminUser,)
    queryset = User.objects.all()
    serializer_class = UserSerializer

class AdminUserDeleteView(generics.DestroyAPIView):
    permission_classes = (permissions.IsAdminUser,)
    queryset = User.objects.all()

class PendingNutritionistsView(generics.ListAPIView):
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = UserSerializer
    def get_queryset(self): return User.objects.filter(profile__role='NUTRITIONIST', profile__is_approved=False)

class ApproveUserView(APIView):
    permission_classes = (permissions.IsAdminUser,)
    def post(self, request, pk):
        user = User.objects.get(pk=pk)
        if hasattr(user, 'profile'):
            user.profile.is_approved = True
            user.profile.save()
            return Response({'status': 'success'})
        return Response({'error': 'Profile not found'}, status=404)

class MessageAdminListView(APIView):
    permission_classes = (permissions.IsAdminUser,)
    def get(self, request):
        messages = Message.objects.filter(Q(sender__is_superuser=True) | Q(receiver__is_superuser=True))
        user_ids = set()
        for msg in messages:
            if not msg.sender.is_superuser: user_ids.add(msg.sender_id)
            if not msg.receiver.is_superuser: user_ids.add(msg.receiver_id)
        users = User.objects.filter(id__in=user_ids)
        result = []
        for user in users:
            last_msg = Message.objects.filter(Q(sender=user, receiver__is_superuser=True) | Q(sender__is_superuser=True, receiver=user)).order_by('-timestamp').first()
            result.append({
                'id': user.id,
                'name': f"{user.first_name} {user.last_name}".strip() or user.username,
                'last_message': last_msg.content if last_msg else '',
                'last_timestamp': last_msg.timestamp if last_msg else None
            })
        return Response(result)

class MarkMessagesReadView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    def post(self, request, partner_id):
        Message.objects.filter(sender_id=partner_id, receiver=request.user, is_read=False).update(is_read=True)
        return Response({'status': 'read'})

class SupportInboxView(APIView):
    permission_classes = (permissions.IsAdminUser,)
    def get(self, request):
        queries = Message.objects.filter(receiver__is_superuser=True).order_by('-timestamp')
        return Response(MessageSerializer(queries, many=True).data)

class SendPlanToPatientView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    def post(self, request):
        patient_id = request.data.get('patient_id')
        plan_title = request.data.get('plan_title', 'a nutrition plan')
        patient = User.objects.get(pk=patient_id)
        content = f"✨ Your nutritionist has sent you a new plan: '{plan_title}'."
        Message.objects.create(sender=request.user, receiver=patient, content=content)
        return Response({'status': 'success'})
