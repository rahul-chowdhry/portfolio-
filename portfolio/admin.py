from django.contrib import admin

from .models import (
    Education,
    Experience,
    Profile,
    Project,
    ProjectImage,
    Service,
    ServicePackage,
    Skill,
    SocialLink,
)


class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1
    fields = (
        "image",
        "caption",
        "display_order",
    )


class ServicePackageInline(admin.TabularInline):
    model = ServicePackage
    extra = 1
    fields = (
        "name",
        "short_description",
        "price",
        "price_label",
        "display_order",
        "is_featured",
        "is_active",
    )


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "title",
        "email",
        "availability",
        "updated_at",
    )

    search_fields = (
        "name",
        "title",
        "email",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "display_order",
        "is_active",
        "created_at",
    )

    list_filter = (
        "is_active",
    )

    search_fields = (
        "name",
        "description",
    )

    prepopulated_fields = {
        "slug": ("name",),
    }

    ordering = (
        "display_order",
        "name",
    )

    inlines = [
        ServicePackageInline,
    ]

    readonly_fields = (
        "created_at",
        "updated_at",
    )


@admin.register(ServicePackage)
class ServicePackageAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "service",
        "price",
        "price_label",
        "is_featured",
        "is_active",
        "display_order",
    )

    list_filter = (
        "service",
        "is_featured",
        "is_active",
    )

    search_fields = (
        "name",
        "short_description",
    )

    ordering = (
        "service",
        "display_order",
        "name",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "category",
        "proficiency",
        "is_active",
        "display_order",
    )

    list_filter = (
        "category",
        "is_active",
    )

    search_fields = (
        "name",
    )

    ordering = (
        "display_order",
        "name",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "featured",
        "display_order",
        "created_at",
        "updated_at",
    )

    list_filter = (
        "featured",
    )

    search_fields = (
        "title",
        "short_description",
        "full_description",
    )

    prepopulated_fields = {
        "slug": ("title",),
    }

    ordering = (
        "display_order",
        "-created_at",
    )

    inlines = [
        ProjectImageInline,
    ]

    readonly_fields = (
        "created_at",
        "updated_at",
    )


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = (
        "company",
        "role",
        "start_date",
        "end_date",
        "currently_working",
        "display_order",
    )

    list_filter = (
        "currently_working",
    )

    search_fields = (
        "company",
        "role",
        "description",
    )

    ordering = (
        "-start_date",
        "display_order",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = (
        "institution",
        "degree",
        "start_date",
        "end_date",
        "display_order",
    )

    search_fields = (
        "institution",
        "degree",
        "description",
    )

    ordering = (
        "-end_date",
        "display_order",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )


@admin.register(SocialLink)
class SocialLinkAdmin(admin.ModelAdmin):
    list_display = (
        "platform",
        "url",
        "is_active",
        "display_order",
    )

    list_filter = (
        "is_active",
    )

    search_fields = (
        "platform",
        "url",
    )

    ordering = (
        "display_order",
        "platform",
    )