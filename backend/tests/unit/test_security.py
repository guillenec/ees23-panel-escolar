from jose import jwt

from app.core.config import settings
from app.core.security import create_access_token, get_password_hash, verify_password


def test_password_hash_and_verify() -> None:
    password = "clave-segura"
    hashed = get_password_hash(password)

    assert hashed != password
    assert verify_password(password, hashed) is True


def test_create_access_token_contains_subject_and_roles() -> None:
    token = create_access_token("user-123", ["DOCENTE"])
    payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])

    assert payload["sub"] == "user-123"
    assert payload["roles"] == ["DOCENTE"]
