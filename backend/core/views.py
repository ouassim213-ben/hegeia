from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import Post, Appointment, Availability, Comment, Like
from .serializers import (
    RegisterSerializer, UserSerializer, PostSerializer, 
    SpecialistSerializer, SpecialistDetailSerializer, 
    AppointmentSerializer, AvailabilitySerializer,
    UserUpdateSerializer, UserAppointmentHistorySerializer,
    CommentSerializer
)

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
            # Check approval for Nutritionists
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
        # Filter for validated posts for the general feed
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

# Admin Specific Views
class AdminPendingPostsView(generics.ListAPIView):
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = PostSerializer

    def get_queryset(self):
        return Post.objects.filter(is_validated=False)

class AdminValidatePostView(APIView):
    permission_classes = (permissions.IsAdminUser,)

    def post(self, request, pk):
        try:
            post = Post.objects.get(pk=pk)
            post.is_validated = not post.is_validated
            post.save()
            return Response({'status': 'success', 'is_validated': post.is_validated})
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

class AdminDeletePostView(generics.DestroyAPIView):
    permission_classes = (permissions.IsAdminUser,)
    queryset = Post.objects.all()
    serializer_class = PostSerializer

class AdminUserListView(generics.ListAPIView):
    permission_classes = (permissions.IsAdminUser,)
    queryset = User.objects.all()
    serializer_class = UserSerializer

class AdminUserDeleteView(generics.DestroyAPIView):
    permission_classes = (permissions.IsAdminUser,)
    queryset = User.objects.all()
    serializer_class = UserSerializer

class PendingNutritionistsView(generics.ListAPIView):
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = UserSerializer

    def get_queryset(self):
        # Filter for Nutritionists who are not yet approved
        return User.objects.filter(profile__role='NUTRITIONIST', profile__is_approved=False)

class ApproveUserView(APIView):
    permission_classes = (permissions.IsAdminUser,)

    def post(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            if hasattr(user, 'profile'):
                user.profile.is_approved = True
                user.profile.save()
                return Response({'status': 'success', 'message': f'Nutritionist {user.username} approved.'})
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class SpecialistListView(generics.ListAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = SpecialistSerializer

    def get_queryset(self):
        # Only return Approved Nutritionists
        queryset = User.objects.filter(profile__role='NUTRITIONIST', profile__is_approved=True)
        tier = self.request.query_params.get('tier')
        if tier:
            tier = tier.lower()
            if tier == 'premium':
                pass # Can see all tiers
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
        print("INCOMING APPOINTMENT DATA:", self.request.data)
        
        specialist = serializer.validated_data.get('specialist')
        plan_name = serializer.validated_data.get('plan_name')
        date = serializer.validated_data.get('date')
        time = serializer.validated_data.get('time')
        
        if Appointment.objects.filter(specialist=specialist, date=date, time=time).exists():
            from rest_framework import serializers
            raise serializers.ValidationError({"error": "This time slot is already booked."})
        
        if not plan_name:
            raise serializers.ValidationError({"error": "plan_name is required to book an appointment."})

        plan_tier_map = {
            'quick start': 'basic',
            '1 month plan': 'standard',
            'golden plan': 'premium'
        }
        mapped_tier = plan_tier_map.get(plan_name.lower())
        
        if not mapped_tier:
            raise serializers.ValidationError({"error": f"Invalid plan_name: '{plan_name}'. Must be 'Quick Start', '1 Month Plan', or 'Golden Plan'."})

        specialist_tier = specialist.profile.tier

        tier_weights = {'basic': 1, 'standard': 2, 'premium': 3}
        if tier_weights.get(specialist_tier, 1) > tier_weights.get(mapped_tier, 1):
            raise serializers.ValidationError({"error": f"You cannot book a {specialist_tier.title()} tier specialist with the {plan_name} plan."})

        appointment = serializer.save(patient=self.request.user)

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
        
        # Expecting a list of exactly 7 items
        data = request.data
        if not isinstance(data, list):
            return Response({'error': 'Expected an array of 7 day objects.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Overwrite all existing
        Availability.objects.filter(specialist=request.user).delete()
        
        new_availabilities = []
        for d in data:
            new_availabilities.append(Availability(
                specialist=request.user,
                day_of_week=d.get('day_of_week'),
                start_time=d.get('start_time') or None,
                end_time=d.get('end_time') or None,
                is_active=d.get('is_active', False)
            ))
        
        Availability.objects.bulk_create(new_availabilities)
        
        final_qs = Availability.objects.filter(specialist=request.user)
        return Response(AvailabilitySerializer(final_qs, many=True).data)

class CurrentUserInfoView(generics.RetrieveUpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserUpdateSerializer

    def get_object(self):
        return self.request.user

    def patch(self, request, *args, **kwargs):
        # Handle Nested Multipart Data (Django QueryDict doesn't nest logically)
        # We convert to a standard dict to handle the 'profile' nested structure
        data_dict = {k: v for k, v in request.data.items() if not k.startswith('profile.')}
        profile_data = {}
        
        # Extract keys starting with 'profile.'
        for key in request.data.keys():
            if key.startswith('profile.'):
                field_name = key.replace('profile.', '')
                # If it's a file, get it from request.FILES
                if field_name in request.FILES:
                    profile_data[field_name] = request.FILES[field_name]
                else:
                    profile_data[field_name] = request.data[key]
        
        # Also check profile.image explicitly if sent as a file
        if 'profile.image' in request.FILES:
             profile_data['image'] = request.FILES['profile.image']

        if profile_data:
            data_dict['profile'] = profile_data

        serializer = self.get_serializer(self.get_object(), data=data_dict, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        self.perform_update(serializer)
        return Response(serializer.data)

class UserAppointmentListView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserAppointmentHistorySerializer

    def get_queryset(self):
        user = self.request.user
        qs = Appointment.objects.filter(
            Q(patient=user) | Q(specialist=user)
        ).order_by('-created_at')
        
        # Lazy status update
        from datetime import datetime, timedelta
        now = datetime.now()
        threshold = now - timedelta(minutes=45)
        
        upcoming = qs.filter(status='UPCOMING')
        for appt in upcoming:
            try:
                # appt.date format: "Thu 16.04"
                date_parts = appt.date.split(' ')
                if len(date_parts) < 2: continue
                d_m = date_parts[1].split('.')
                t_parts = appt.time.split(':')
                
                # Assume current year
                appt_dt = datetime(now.year, int(d_m[1]), int(d_m[0]), int(t_parts[0]), int(t_parts[1]))
                
                if appt_dt < threshold:
                    appt.status = 'COMPLETED'
                    appt.save()
            except Exception:
                continue
                
        return qs

from .models import Message
from .serializers import MessageSerializer
from django.db.models import Q, Max, Count
import logging

logger = logging.getLogger(__name__)

from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

class MessageViewSet(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    serializer_class = MessageSerializer

    def get_queryset(self):
        user = self.request.user
        partner_id = self.request.query_params.get('partner')
        # STRICT: Require a chat_type. Default SUPPORT so no accidental full-dump.
        chat_type = self.request.query_params.get('chat_type', 'SUPPORT')
        
        # Base filter: Only messages involving this user
        qs = Message.objects.filter(Q(sender=user) | Q(receiver=user))

        # Always apply strict type filter — this is the anti-leak guardrail
        qs = qs.filter(chat_type=chat_type)

        # Partner Segmentation (for 1-on-1 clinical threads)
        if partner_id:
            qs = qs.filter(Q(sender_id=partner_id) | Q(receiver_id=partner_id))
            
        return qs.order_by('timestamp')

    def perform_create(self, serializer):
        try:
            receiver_id = self.request.data.get('receiver')
            chat_type = self.request.data.get('chat_type', 'SUPPORT')
            # Pull file from FILES — DRF's SerializerMethodField is READ-ONLY so it won't save it automatically
            attachment = self.request.FILES.get('attachment')
            logger.info(f"Message creation: user={self.request.user}, chat_type={chat_type}, receiver={receiver_id}, file={attachment}")
            
            if receiver_id:
                # Explicit receiver: clinical or admin reply
                instance = serializer.save(sender=self.request.user, receiver_id=receiver_id, chat_type=chat_type)
                logger.info(f"Message saved → receiver={receiver_id}, type={chat_type}")
            else:
                # No receiver: auto-route to Admin as SUPPORT
                admin = User.objects.filter(is_superuser=True).first()
                if not admin:
                    admin = User.objects.get(pk=1)
                instance = serializer.save(sender=self.request.user, receiver=admin, chat_type='SUPPORT')
                logger.info(f"SUPPORT message auto-routed to Admin: {admin}")

            # Explicitly save attachment since SerializerMethodField is read-only
            if attachment:
                instance.attachment = attachment
                instance.save(update_fields=['attachment'])
                logger.info(f"Attachment saved: {attachment.name} → {instance.attachment.url}")

        except Exception as e:
            logger.error(f"CRITICAL MESSAGE SAVE ERROR: {e}")
            raise e

class MessageAdminListView(APIView):
    """
    Returns a list of users who have traded messages with administrators.
    """
    permission_classes = (permissions.IsAdminUser,)

    def get(self, request):
        # Get all users who sent messages to admins or received from admins
        messages = Message.objects.filter(Q(sender__is_superuser=True) | Q(receiver__is_superuser=True))
        
        # We want to find the unique 'other' users (non-admins)
        user_ids = set()
        for msg in messages:
            if not msg.sender.is_superuser:
                user_ids.add(msg.sender_id)
            if not msg.receiver.is_superuser:
                user_ids.add(msg.receiver_id)
        
        users = User.objects.filter(id__in=user_ids)
        
        # Build a list with last message and unread count
        result = []
        for user in users:
            last_msg = Message.objects.filter(
                Q(sender=user, receiver__is_superuser=True) |
                Q(sender__is_superuser=True, receiver=user)
            ).order_by('-timestamp').first()
            
            unread_count = Message.objects.filter(sender=user, receiver=request.user, is_read=False).count()
            
            result.append({
                'id': user.id,
                'name': f"{user.first_name} {user.last_name}".strip() or user.username,
                'image': request.build_absolute_uri(user.profile.image.url) if hasattr(user, 'profile') and user.profile.image else None,
                'last_message': last_msg.content if last_msg else '',
                'last_timestamp': last_msg.timestamp if last_msg else None,
                'unread_count': unread_count
            })
            
        # Sort by latest message
        result.sort(key=lambda x: x['last_timestamp'] or '', reverse=True)
        return Response(result)

class MarkMessagesReadView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    def post(self, request, partner_id):
        Message.objects.filter(sender_id=partner_id, receiver=request.user, is_read=False).update(is_read=True)
        return Response({'status': 'read'})

class SupportInboxView(APIView):
    """
    Returns a unified queue of all incoming patient queries for direct reply.
    """
    permission_classes = (permissions.IsAdminUser,)

    def get(self, request):
        # We want the latest message from EVERY unique patient who contacted the admins
        from django.db.models import OuterRef, Subquery
        
        # Subquery to get the latest message ID for each sender
        latest_message_ids = Message.objects.filter(
            sender=OuterRef('sender'),
            receiver__is_superuser=True
        ).order_by('-timestamp').values('id')[:1]

        # Filter messages that are the latest for their sender and were sent TO an admin
        queries = Message.objects.filter(
            id__in=Subquery(latest_message_ids),
            receiver__is_superuser=True
        ).order_by('-timestamp')

        serializer = MessageSerializer(queries, many=True)
        return Response(serializer.data)


class NutritionistPatientsView(APIView):
    """
    Returns the list of all appointments booked with the currently 
    authenticated nutritionist, including questionnaire data.
    """
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        if not hasattr(request.user, 'profile') or request.user.profile.role != 'NUTRITIONIST':
            return Response({'error': 'Only nutritionists can access this.'}, status=status.HTTP_403_FORBIDDEN)

        # Get all appointments for this specialist, sorted by date/time
        appointments = Appointment.objects.filter(specialist=request.user)\
                                          .select_related('patient', 'patient__profile', 'questionnaire')\
                                          .order_by('-created_at')

        serializer = UserAppointmentHistorySerializer(appointments, many=True, context={'request': request})
        return Response(serializer.data)


class SendPlanToPatientView(APIView):
    """
    Nutritionist sends a plan notification to a specific patient via the messages system.
    Body: { patient_id: int, plan_title: str }
    """
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        if not hasattr(request.user, 'profile') or request.user.profile.role != 'NUTRITIONIST':
            return Response({'error': 'Only nutritionists can send plans.'}, status=status.HTTP_403_FORBIDDEN)

        patient_id = request.data.get('patient_id')
        plan_title = request.data.get('plan_title', 'a nutrition plan')

        try:
            patient = User.objects.get(pk=patient_id)
        except User.DoesNotExist:
            return Response({'error': 'Patient not found.'}, status=status.HTTP_404_NOT_FOUND)

        nutritionist_name = f"{request.user.first_name} {request.user.last_name}".strip() or request.user.username
        content = f"✨ Your nutritionist {nutritionist_name} has sent you a new plan: '{plan_title}'. Check your profile to view it!"

        Message.objects.create(
            sender=request.user,
            receiver=patient,
            content=content
        )

        return Response({'status': 'Plan sent successfully', 'message': content})

from rest_framework import viewsets
from .models import DailyProgress
from .serializers import DailyProgressSerializer

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
