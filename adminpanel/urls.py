from django.urls import path

from .views import (
    AdminLoginAPIView,
    AdminMeAPIView,
    AdminLogoutAPIView,
    AdminProfileAPIView,
    AdminSkillListCreateAPIView,
    AdminSkillDetailAPIView,
    AdminExperienceListCreateAPIView,
    AdminExperienceDetailAPIView,
    AdminEducationListCreateAPIView,
    AdminEducationDetailAPIView,
    AdminSocialLinkListCreateAPIView,
    AdminSocialLinkDetailAPIView,
    AdminContactMessageListAPIView,
    AdminContactMessageDetailAPIView,
    AdminServiceListCreateAPIView,
    AdminServiceDetailAPIView,
    AdminServicePackageListCreateAPIView,
    AdminServicePackageDetailAPIView,
)

urlpatterns = [
    # Auth & Profile
    path("login/", AdminLoginAPIView.as_view(), name="admin-login"),
    path("me/", AdminMeAPIView.as_view(), name="admin-me"),
    path("logout/", AdminLogoutAPIView.as_view(), name="admin-logout"),
    path("profile/", AdminProfileAPIView.as_view(), name="admin-profile"),
    
    # Skills
    path("skills/", AdminSkillListCreateAPIView.as_view(), name="admin-skills-list"),
    path("skills/<int:pk>/", AdminSkillDetailAPIView.as_view(), name="admin-skills-detail"),

    # Experience
    path("experience/", AdminExperienceListCreateAPIView.as_view(), name="admin-experience-list"),
    path("experience/<int:pk>/", AdminExperienceDetailAPIView.as_view(), name="admin-experience-detail"),

    # Education
    path("education/", AdminEducationListCreateAPIView.as_view(), name="admin-education-list"),
    path("education/<int:pk>/", AdminEducationDetailAPIView.as_view(), name="admin-education-detail"),

    # Social Links
    path("social-links/", AdminSocialLinkListCreateAPIView.as_view(), name="admin-social-links-list"),
    path("social-links/<int:pk>/", AdminSocialLinkDetailAPIView.as_view(), name="admin-social-links-detail"),

    # Contact Messages (Tickets)
    path("messages/", AdminContactMessageListAPIView.as_view(), name="admin-messages-list"),
    path("messages/<int:pk>/", AdminContactMessageDetailAPIView.as_view(), name="admin-messages-detail"),

    # Services
    path("services/", AdminServiceListCreateAPIView.as_view(), name="admin-services-list"),
    path("services/<int:pk>/", AdminServiceDetailAPIView.as_view(), name="admin-services-detail"),

    # Service Packages
    path("packages/", AdminServicePackageListCreateAPIView.as_view(), name="admin-packages-list"),
    path("packages/<int:pk>/", AdminServicePackageDetailAPIView.as_view(), name="admin-packages-detail"),
]