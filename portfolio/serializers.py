from rest_framework import serializers

from .models import (
    Profile,
    Service,
    ServicePackage,
    Skill,
    Project,
    ProjectImage,
    Experience,
    Education,
    SocialLink,
)


class ProfileSerializer(serializers.ModelSerializer):
    """
    Public profile serializer.

    IMPORTANT:
    phone and whatsapp are intentionally NOT included.
    """

    class Meta:
        model = Profile
        fields = [
            "id",
            "name",
            "title",
            "bio",
            "profile_image",
            "resume",
            "location",
            "email",
            "availability",
            "created_at",
            "updated_at",
        ]


class ServicePackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServicePackage
        fields = [
            "id",
            "name",
            "short_description",
            "price",
            "price_label",
            "features",
            "display_order",
            "is_featured",
            "is_active",
            "created_at",
            "updated_at",
        ]


class ServiceSerializer(serializers.ModelSerializer):
    packages = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "icon",
            "display_order",
            "is_active",
            "packages",
            "created_at",
            "updated_at",
        ]

    def get_packages(self, obj):
        packages = obj.packages.filter(
            is_active=True
        ).order_by(
            "display_order",
            "id",
        )

        return ServicePackageSerializer(
            packages,
            many=True
        ).data


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = [
            "id",
            "name",
            "category",
            "proficiency",
            "icon",
            "display_order",
            "is_active",
            "created_at",
            "updated_at",
        ]


class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = [
            "id",
            "image",
            "caption",
            "display_order",
            "created_at",
        ]


class ProjectSerializer(serializers.ModelSerializer):
    gallery = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            "id",
            "title",
            "slug",
            "short_description",
            "full_description",
            "thumbnail",
            "technologies",
            "features",
            "github_url",
            "live_url",
            "featured",
            "display_order",
            "gallery",
            "created_at",
            "updated_at",
        ]

    def get_gallery(self, obj):
        images = obj.gallery.all().order_by(
            "display_order",
            "id",
        )

        return ProjectImageSerializer(
            images,
            many=True
        ).data


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = [
            "id",
            "company",
            "role",
            "description",
            "start_date",
            "end_date",
            "currently_working",
            "display_order",
            "created_at",
            "updated_at",
        ]


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = [
            "id",
            "institution",
            "degree",
            "description",
            "start_date",
            "end_date",
            "display_order",
            "created_at",
            "updated_at",
        ]


class SocialLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLink
        fields = [
            "id",
            "platform",
            "url",
            "icon",
            "display_order",
            "is_active",
        ]