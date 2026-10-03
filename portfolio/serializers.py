from rest_framework import serializers
from .models import (
    Profile,
    Skill,
    Experience,
    Education,
    SocialLink,
    Service,
    ServicePackage,
    Project,
    ProjectImage
)

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        # '__all__' use karne se saari fields automatically map ho jayengi
        fields = '__all__'

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = '__all__'

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = '__all__'

class SocialLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLink
        fields = '__all__'

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'

class ServicePackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServicePackage
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        # Yahan humne 'project' field add kar di hai jisse wo null wala error nahi aayega
        fields = ['id', 'project', 'image', 'caption', 'display_order']