from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class AssignmentCreate(BaseModel):
    teacher_id: UUID
    student_id: UUID


class AssignmentRead(BaseModel):
    id: UUID
    teacher_id: UUID
    student_id: UUID
    created_at: datetime

    model_config = {"from_attributes": True}


class AssignmentExpandedRead(AssignmentRead):
    teacher_name: str
    student_name: str
