from django.contrib.auth import authenticate
from rest_framework import status, generics
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

# Portfolio models and serializers
from portfolio.models import (
    Profile, Skill, Experience, Education, SocialLink, 
    Service, ServicePackage, Project, ProjectImage
)
from portfolio.serializers import (
    ProfileSerializer, 
    SkillSerializer, 
    ExperienceSerializer, 
    EducationSerializer,
    SocialLinkSerializer,
    ServiceSerializer,
    ServicePackageSerializer,
    ProjectSerializer,
    ProjectImageSerializer
)

# Contact models and serializers
from contact.models import ContactMessage
from contact.serializers import ContactMessageSerializer


# ==========================================
# AUTH & PROFILE ADMIN APIs
# ==========================================
class AdminLoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username", "").strip()
        password = request.data.get("password", "")

        if not username or not password:
            return Response(
                {"detail": "Username and password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(username=username, password=password)

        if user is None:
            return Response(
                {"detail": "Invalid username or password."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not user.is_active:
            return Response(
                {"detail": "This account is inactive."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if not user.is_staff:
            return Response(
                {"detail": "This account does not have admin access."},
                status=status.HTTP_403_FORBIDDEN,
            )

        token, created = Token.objects.get_or_create(user=user)

        return Response(
            {
                "message": "Admin login successful.",
                "token": token.key,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "is_staff": user.is_staff,
                    "is_superuser": user.is_superuser,
                },
            },
            status=status.HTTP_200_OK,
        )


class AdminMeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response(
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_staff": user.is_staff,
                "is_superuser": user.is_superuser,
            },
            status=status.HTTP_200_OK,
        )


class AdminLogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        return Response(
            {"message": "Admin logout successful."},
            status=status.HTTP_200_OK,
        )


class AdminProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_profile(self):
        profile = Profile.objects.order_by("id").first()
        if profile is None:
            return None
        return profile

    def get(self, request):
        profile = self.get_profile()
        if profile is None:
            return Response(
                {"detail": "Profile information is not available."},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = ProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        return self.update_profile(request)

    def patch(self, request):
        return self.update_profile(request)

    def update_profile(self, request):
        profile = self.get_profile()
        if profile is None:
            return Response(
                {"detail": "Profile information is not available."},
                status=status.HTTP_404_NOT_FOUND,
            )
        
        serializer = ProfileSerializer(
            profile,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ==========================================
# SKILLS ADMIN APIs
# ==========================================
class AdminSkillListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Skill.objects.all().order_by("display_order", "name")
    serializer_class = SkillSerializer

class AdminSkillDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer


# ==========================================
# EXPERIENCE ADMIN APIs
# ==========================================
class AdminExperienceListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Experience.objects.all().order_by("-start_date", "display_order")
    serializer_class = ExperienceSerializer

class AdminExperienceDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer


# ==========================================
# EDUCATION ADMIN APIs
# ==========================================
class AdminEducationListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Education.objects.all().order_by("-end_date", "display_order")
    serializer_class = EducationSerializer

class AdminEducationDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Education.objects.all()
    serializer_class = EducationSerializer


# ==========================================
# SOCIAL LINKS ADMIN APIs
# ==========================================
class AdminSocialLinkListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = SocialLink.objects.all().order_by("display_order", "platform")
    serializer_class = SocialLinkSerializer

class AdminSocialLinkDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = SocialLink.objects.all()
    serializer_class = SocialLinkSerializer


# ==========================================
# CONTACT MESSAGES ADMIN APIs
# ==========================================
class AdminContactMessageListAPIView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = ContactMessage.objects.all().order_by("-created_at")
    serializer_class = ContactMessageSerializer

class AdminContactMessageDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer


# ==========================================
# SERVICES ADMIN APIs
# ==========================================
class AdminServiceListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Service.objects.all().order_by("display_order", "id")
    serializer_class = ServiceSerializer

class AdminServiceDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer


# ==========================================
# SERVICE PACKAGES ADMIN APIs
# ==========================================
class AdminServicePackageListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = ServicePackage.objects.all().order_by("service", "display_order")
    serializer_class = ServicePackageSerializer

class AdminServicePackageDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = ServicePackage.objects.all()
    serializer_class = ServicePackageSerializer


# ==========================================
# PROJECTS ADMIN APIs
# ==========================================
class AdminProjectListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Project.objects.all().order_by("display_order", "-created_at")
    serializer_class = ProjectSerializer

class AdminProjectDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


# ==========================================
# PROJECT IMAGES (GALLERY) ADMIN APIs
# ==========================================
class AdminProjectImageListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = ProjectImage.objects.all().order_by("project", "display_order")
    serializer_class = ProjectImageSerializer

class AdminProjectImageDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = ProjectImage.objects.all()
    serializer_class = ProjectImageSerializer