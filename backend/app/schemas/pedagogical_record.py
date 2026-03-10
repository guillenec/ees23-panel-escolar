from datetime import date
from uuid import UUID

from pydantic import BaseModel


class PedagogicalRecordCreate(BaseModel):
    record_date: date
    observation: str
    actions_taken: str | None = None
    next_steps: str | None = None


class PedagogicalRecordRead(BaseModel):
    id: UUID
    student_id: UUID
    teacher_id: UUID
    record_date: date
    observation: str
    actions_taken: str | None
    next_steps: str | None

    model_config = {"from_attributes": True}


class PedagogicalRecordUpdate(BaseModel):
    record_date: date | None = None
    observation: str | None = None
    actions_taken: str | None = None
    next_steps: str | None = None
