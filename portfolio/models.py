from django.db import models


class Profile(models.Model):
    name = models.CharField(max_length=150)
    title = models.CharField(max_length=200)

    bio = models.TextField(blank=True)

    profile_image = models.ImageField(
        upload_to="profile/",
        blank=True,
        null=True,
    )

    resume = models.FileField(
        upload_to="resume/",
        blank=True,
        null=True,
    )

    location = models.CharField(
        max_length=200,
        blank=True,
    )

    email = models.EmailField(
        blank=True,
    )

    # PRIVATE CONTACT DATA
    # These fields will NOT be exposed in the public API.
    phone = models.CharField(
        max_length=30,
        blank=True,
    )

    whatsapp = models.CharField(
        max_length=30,
        blank=True,
    )

    availability = models.BooleanField(
        default=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["-updated_at"]

    def __str__(self):
        return self.name


class Service(models.Model):
    name = models.CharField(
        max_length=150,
    )

    slug = models.SlugField(
        max_length=180,
        unique=True,
    )

    description = models.TextField()

    icon = models.CharField(
        max_length=100,
        blank=True,
    )

    display_order = models.PositiveIntegerField(
        default=0,
    )

    is_active = models.BooleanField(
        default=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["display_order", "name"]

    def __str__(self):
        return self.name


class ServicePackage(models.Model):
    service = models.ForeignKey(
        Service,
        on_delete=models.CASCADE,
        related_name="packages",
    )

    name = models.CharField(
        max_length=150,
    )

    short_description = models.CharField(
        max_length=300,
        blank=True,
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
    )

    price_label = models.CharField(
        max_length=100,
        blank=True,
        help_text="Example: Starting from, Custom, Contact for price",
    )

    features = models.JSONField(
        default=list,
        blank=True,
    )

    display_order = models.PositiveIntegerField(
        default=0,
    )

    is_featured = models.BooleanField(
        default=False,
    )

    is_active = models.BooleanField(
        default=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["display_order", "name"]

    def __str__(self):
        return f"{self.service.name} - {self.name}"


class Skill(models.Model):
    CATEGORY_CHOICES = [
        ("development", "Development"),
        ("design", "Design"),
        ("video", "Video"),
        ("hardware", "Hardware"),
        ("tools", "Tools"),
        ("other", "Other"),
    ]

    name = models.CharField(
        max_length=100,
        unique=True,
    )

    category = models.CharField(
        max_length=30,
        choices=CATEGORY_CHOICES,
        default="other",
    )

    proficiency = models.PositiveSmallIntegerField(
        default=0,
        help_text="Enter a value from 0 to 100.",
    )

    icon = models.CharField(
        max_length=100,
        blank=True,
    )

    display_order = models.PositiveIntegerField(
        default=0,
    )

    is_active = models.BooleanField(
        default=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["display_order", "name"]

    def __str__(self):
        return self.name


class Project(models.Model):
    title = models.CharField(
        max_length=200,
    )

    slug = models.SlugField(
        max_length=220,
        unique=True,
    )

    short_description = models.CharField(
        max_length=350,
    )

    full_description = models.TextField()

    thumbnail = models.ImageField(
        upload_to="projects/thumbnails/",
        blank=True,
        null=True,
    )

    technologies = models.JSONField(
        default=list,
        blank=True,
    )

    features = models.JSONField(
        default=list,
        blank=True,
    )

    github_url = models.URLField(
        blank=True,
    )

    live_url = models.URLField(
        blank=True,
    )

    featured = models.BooleanField(
        default=False,
    )

    display_order = models.PositiveIntegerField(
        default=0,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["display_order", "-created_at"]

    def __str__(self):
        return self.title


class ProjectImage(models.Model):
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="gallery",
    )

    image = models.ImageField(
        upload_to="projects/gallery/",
    )

    caption = models.CharField(
        max_length=200,
        blank=True,
    )

    display_order = models.PositiveIntegerField(
        default=0,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        ordering = ["display_order", "id"]

    def __str__(self):
        return f"{self.project.title} - Image {self.id}"


class Experience(models.Model):
    company = models.CharField(
        max_length=200,
    )

    role = models.CharField(
        max_length=200,
    )

    description = models.TextField()

    start_date = models.DateField()

    end_date = models.DateField(
        blank=True,
        null=True,
    )

    currently_working = models.BooleanField(
        default=False,
    )

    display_order = models.PositiveIntegerField(
        default=0,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["-start_date", "display_order"]

    def __str__(self):
        return f"{self.role} - {self.company}"


class Education(models.Model):
    institution = models.CharField(
        max_length=250,
    )

    degree = models.CharField(
        max_length=200,
    )

    description = models.TextField(
        blank=True,
    )

    start_date = models.DateField(
        blank=True,
        null=True,
    )

    end_date = models.DateField(
        blank=True,
        null=True,
    )

    display_order = models.PositiveIntegerField(
        default=0,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["-end_date", "display_order"]

    def __str__(self):
        return f"{self.degree} - {self.institution}"


class SocialLink(models.Model):
    platform = models.CharField(
        max_length=100,
    )

    url = models.URLField()

    icon = models.CharField(
        max_length=100,
        blank=True,
    )

    display_order = models.PositiveIntegerField(
        default=0,
    )

    is_active = models.BooleanField(
        default=True,
    )

    class Meta:
        ordering = ["display_order", "platform"]

    def __str__(self):
        return self.platform