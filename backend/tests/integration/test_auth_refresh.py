from types import SimpleNamespace

from fastapi.testclient import TestClient

from app.db.session import get_db
from app.main import app
from app.models.user import User
from app.core.security import create_access_token, create_refresh_token


def _client_without_startup() -> TestClient:
    original_startup = list(app.router.on_startup)
    app.router.on_startup.clear()
    client = TestClient(app)
    app.router.on_startup[:] = original_startup
    return client


class _FakeSession:
    def __init__(self, user: SimpleNamespace):
        self.user = user

    def get(self, model: type[User], user_id: str):
        if model is User and str(self.user.id) == str(user_id):
            return self.user
        return None


def test_refresh_returns_new_token_pair() -> None:
    user = SimpleNamespace(id="test-user", role="DOCENTE", is_active=True)
    app.dependency_overrides[get_db] = lambda: _FakeSession(user)

    try:
        client = _client_without_startup()
        refresh_token = create_refresh_token("test-user", ["DOCENTE"])

        response = client.post("/api/v1/auth/refresh", json={"refresh_token": refresh_token})

        assert response.status_code == 200
        payload = response.json()
        assert payload["token_type"] == "bearer"
        assert isinstance(payload["access_token"], str)
        assert isinstance(payload["refresh_token"], str)
    finally:
        app.dependency_overrides.clear()


def test_refresh_rejects_access_token() -> None:
    user = SimpleNamespace(id="test-user", role="DOCENTE", is_active=True)
    app.dependency_overrides[get_db] = lambda: _FakeSession(user)

    try:
        client = _client_without_startup()
        access_token = create_access_token("test-user", ["DOCENTE"])

        response = client.post("/api/v1/auth/refresh", json={"refresh_token": access_token})

        assert response.status_code == 401
    finally:
        app.dependency_overrides.clear()
