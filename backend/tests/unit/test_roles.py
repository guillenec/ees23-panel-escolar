import pytest
from fastapi import HTTPException

from app.api.deps import require_roles


class DummyUser:
    def __init__(self, role: str) -> None:
        self.role = role


def test_require_roles_allows_admin() -> None:
    dependency = require_roles("ADMIN")
    user = dependency(current_user=DummyUser("ADMIN"))
    assert user.role == "ADMIN"


def test_require_roles_rejects_docente_for_admin_only() -> None:
    dependency = require_roles("ADMIN")
    with pytest.raises(HTTPException) as exc_info:
        dependency(current_user=DummyUser("DOCENTE"))

    assert exc_info.value.status_code == 403
