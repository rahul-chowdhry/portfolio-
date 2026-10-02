from django.shortcuts import get_object_or_404

from rest_framework import generics
from rest_framework.permissions import AllowAny

from .models import (
    Profile,
    Service,
    Skill,
    Project,
    Experience,
    Education,
    SocialLink,
)

from .serializers import (
    ProfileSerializer,
    ServiceSerializer,
    SkillSerializer,
    ProjectSerializer,
    ExperienceSerializer,
    EducationSerializer,
    SocialLinkSerializer,
)


class ProfileAPIView(generics.RetrieveAPIView):
    """
    Public API for the portfolio profile.

    The ProfileSerializer deliberately excludes
    private fields such as phone and whatsapp.
    """

    serializer_class = ProfileSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        profile = Profile.objects.order_by("id").first()

        if profile is None:
            from rest_framework.exceptions import NotFound
            raise NotFound("Profile information is not available.")

        return profile


class ServiceListAPIView(generics.ListAPIView):
    """
    Public API for active services.

    Active packages are loaded together with services
    to reduce unnecessary database queries.
    """

    serializer_class = ServiceSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return (
            Service.objects
            .filter(is_active=True)
            .prefetch_related("packages")
            .order_by("display_order", "id")
        )


class ServiceDetailAPIView(generics.RetrieveAPIView):
    """
    Public API for one active service.
    """

    serializer_class = ServiceSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"

    def get_queryset(self):
        return (
            Service.objects
            .filter(is_active=True)
            .prefetch_related("packages")
        )


class SkillListAPIView(generics.ListAPIView):
    """
    Public API for active skills.
    """

    serializer_class = SkillSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return (
            Skill.objects
            .filter(is_active=True)
            .order_by("display_order", "id")
        )


class ProjectListAPIView(generics.ListAPIView):
    """
    Public API for projects.

    Project gallery images are prefetched to avoid
    unnecessary database queries.
    """

    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return (
            Project.objects
            .prefetch_related("projectimage_set")
            .order_by(
                "-featured",
                "display_order",
                "id",
            )
        )


class ProjectDetailAPIView(generics.RetrieveAPIView):
    """
    Public API for a single project.
    """

    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"

    def get_queryset(self):
        return Project.objects.prefetch_related(
            "projectimage_set"
        )


class ExperienceListAPIView(generics.ListAPIView):
    """
    Public API for work experience.
    """

    serializer_class = ExperienceSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Experience.objects.all().order_by(
            "display_order",
            "id",
        )


class EducationListAPIView(generics.ListAPIView):
    """
    Public API for education.
    """

    serializer_class = EducationSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Education.objects.all().order_by(
            "display_order",
            "id",
        )


class SocialLinkListAPIView(generics.ListAPIView):
    """
    Public API for active social links.
    """

    serializer_class = SocialLinkSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return (
            SocialLink.objects
            .filter(is_active=True)
            .order_by("display_order", "id")
        )