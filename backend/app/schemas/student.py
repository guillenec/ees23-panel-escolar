from datetime import date
from uuid import UUID

from pydantic import BaseModel


class StudentCreate(BaseModel):
    first_name: str
    last_name: str
    dni: str
    birth_date: date | None = None
    school_year: str | None = None
    shift: str | None = None
    notes: str | None = None


class StudentUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    birth_date: date | None = None
    school_year: str | None = None
    shift: str | None = None
    notes: str | None = None


class StudentRead(BaseModel):
    id: UUID
    first_name: str
    last_name: str
    dni: str
    birth_date: date | None
    school_year: str | None
    shift: str | None
    notes: str | None

    model_config = {"from_attributes": True}
