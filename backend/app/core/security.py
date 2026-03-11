from datetime import datetime, timedelta, timezone

from jose import jwt
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(subject: str, roles: list[str]) -> str:
    return _create_token(subject, roles, token_type="access", minutes=settings.access_token_minutes)


def create_refresh_token(subject: str, roles: list[str]) -> str:
    return _create_token(
        subject, roles, token_type="refresh", minutes=settings.refresh_token_minutes
    )


def _create_token(subject: str, roles: list[str], token_type: str, minutes: int) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=minutes)
    payload = {"sub": subject, "roles": roles, "token_type": token_type, "exp": expires_at}
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)
