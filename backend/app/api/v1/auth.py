from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from jose import JWTError, jwt
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.config import settings
from app.core.security import create_access_token, create_refresh_token, verify_password
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, RefreshRequest, TokenResponse
from app.schemas.user import UserRead

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == payload.email))
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Credenciales invalidas")

    return _build_token_response(user)


@router.post("/token", response_model=TokenResponse)
def token_login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == form_data.username))
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Credenciales invalidas")

    return _build_token_response(user)


@router.post("/refresh", response_model=TokenResponse)
def refresh(payload: RefreshRequest, db: Session = Depends(get_db)):
    credentials_exception = HTTPException(status_code=401, detail="Refresh token invalido")

    try:
        token_payload = jwt.decode(
            payload.refresh_token,
            settings.jwt_secret_key,
            algorithms=[settings.jwt_algorithm],
        )
        if token_payload.get("token_type") != "refresh":
            raise credentials_exception
        user_id = token_payload.get("sub")
        if not user_id:
            raise credentials_exception
    except JWTError as exc:
        raise credentials_exception from exc

    user = db.get(User, user_id)
    if not user or not user.is_active:
        raise credentials_exception

    return _build_token_response(user)


@router.get("/me", response_model=UserRead)
def me(current_user: User = Depends(get_current_user)):
    return current_user


def _build_token_response(user: User) -> TokenResponse:
    roles = [user.role]
    return TokenResponse(
        access_token=create_access_token(str(user.id), roles),
        refresh_token=create_refresh_token(str(user.id), roles),
    )
