from django.urls import path

from .views import (
    ProfileAPIView,
    ServiceListAPIView,
    ServiceDetailAPIView,
    SkillListAPIView,
    ProjectListAPIView,
    ProjectDetailAPIView,
    ExperienceListAPIView,
    EducationListAPIView,
    SocialLinkListAPIView,
)


urlpatterns = [
    path(
        "profile/",
        ProfileAPIView.as_view(),
        name="api-profile",
    ),

    path(
        "services/",
        ServiceListAPIView.as_view(),
        name="api-services",
    ),

    path(
        "services/<slug:slug>/",
        ServiceDetailAPIView.as_view(),
        name="api-service-detail",
    ),

    path(
        "skills/",
        SkillListAPIView.as_view(),
        name="api-skills",
    ),

    path(
        "projects/",
        ProjectListAPIView.as_view(),
        name="api-projects",
    ),

    path(
        "projects/<slug:slug>/",
        ProjectDetailAPIView.as_view(),
        name="api-project-detail",
    ),

    path(
        "experience/",
        ExperienceListAPIView.as_view(),
        name="api-experience",
    ),

    path(
        "education/",
        EducationListAPIView.as_view(),
        name="api-education",
    ),

    path(
        "social-links/",
        SocialLinkListAPIView.as_view(),
        name="api-social-links",
    ),
]