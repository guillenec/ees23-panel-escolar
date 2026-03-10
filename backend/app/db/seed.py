from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.models.user import User


def seed_admin(db: Session) -> None:
    admin = db.scalar(select(User).where(User.email == "admin@ees23.local"))
    if admin:
        return

    user = User(
        full_name="Administrador EES23",
        email="admin@ees23.local",
        password_hash=get_password_hash("admin123"),
        role="ADMIN",
        is_active=True,
    )
    db.add(user)
    db.commit()
