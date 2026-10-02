from rest_framework import serializers

from .models import ContactMessage


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = [
            "id",
            "name",
            "email",
            "subject",
            "message",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "status",
            "created_at",
            "updated_at",
        ]

    def validate_name(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Name cannot be empty."
            )

        if len(value) > 100:
            raise serializers.ValidationError(
                "Name is too long."
            )

        return value

    def validate_email(self, value):
        value = value.strip().lower()

        if len(value) > 254:
            raise serializers.ValidationError(
                "Email address is too long."
            )

        return value

    def validate_subject(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Subject cannot be empty."
            )

        if len(value) > 200:
            raise serializers.ValidationError(
                "Subject is too long."
            )

        return value

    def validate_message(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Message cannot be empty."
            )

        if len(value) > 5000:
            raise serializers.ValidationError(
                "Message is too long."
            )

        return value

    def create(self, validated_data):
        validated_data["status"] = "new"
        return ContactMessage.objects.create(**validated_data)