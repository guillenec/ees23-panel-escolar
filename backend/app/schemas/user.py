from uuid import UUID

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: str = "DOCENTE"


class UserRead(BaseModel):
    id: UUID
    full_name: str
    email: EmailStr
    role: str

    model_config = {"from_attributes": True}
