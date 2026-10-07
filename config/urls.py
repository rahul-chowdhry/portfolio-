from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.urls import re_path
from django.views.static import serve

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

# Uploaded photos / resume serve karna (production me bhi, warna images 404 deti hain)
urlpatterns += [
    re_path(
        r"^media/(?P<path>.*)$",
        serve,
        {"document_root": settings.MEDIA_ROOT},
    ),
]