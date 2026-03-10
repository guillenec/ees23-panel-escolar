from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class ReportGenerateRequest(BaseModel):
    student_id: UUID
    period_label: str
    summary_text: str | None = None


class ReportRead(BaseModel):
    id: UUID
    student_id: UUID
    created_by: UUID
    period_label: str
    summary_text: str
    created_at: datetime

    model_config = {"from_attributes": True}
