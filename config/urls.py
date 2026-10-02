from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Django built-in admin
    path("admin/", admin.site.urls),

    # Public portfolio APIs
    path(
        "api/",
        include("portfolio.urls"),
    ),

    # Contact API
    path(
        "api/contact/",
        include("contact.urls"),
    ),

    # Custom admin APIs
    path(
        "api/admin/",
        include("adminpanel.urls"),
    ),
]

# Ye line Django ko batati hai ki development mode me uploaded photos aur resume kahan se dikhane hain
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)