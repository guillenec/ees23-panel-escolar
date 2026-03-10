from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import require_roles
from app.db.session import get_db
from app.models.pedagogical_record import PedagogicalRecord
from app.models.student import Student
from app.models.user import User
from app.schemas.pedagogical_record import (
    PedagogicalRecordCreate,
    PedagogicalRecordRead,
    PedagogicalRecordUpdate,
)

router = APIRouter(prefix="/students/{student_id}/records", tags=["records"])


@router.get("", response_model=list[PedagogicalRecordRead])
def list_records(
    student_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles("ADMIN", "DOCENTE")),
):
    student = db.get(Student, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Alumno no encontrado")

    query = (
        select(PedagogicalRecord)
        .where(PedagogicalRecord.student_id == student.id)
        .order_by(PedagogicalRecord.record_date.desc())
    )
    return list(db.scalars(query))


@router.post("", response_model=PedagogicalRecordRead)
def create_record(
    student_id: str,
    payload: PedagogicalRecordCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("ADMIN", "DOCENTE")),
):
    student = db.get(Student, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Alumno no encontrado")

    record = PedagogicalRecord(
        student_id=student.id,
        teacher_id=current_user.id,
        record_date=payload.record_date,
        observation=payload.observation,
        actions_taken=payload.actions_taken,
        next_steps=payload.next_steps,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.patch("/{record_id}", response_model=PedagogicalRecordRead)
def update_record(
    student_id: str,
    record_id: str,
    payload: PedagogicalRecordUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles("ADMIN", "DOCENTE")),
):
    student = db.get(Student, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Alumno no encontrado")

    record = db.get(PedagogicalRecord, record_id)
    if not record or str(record.student_id) != student_id:
        raise HTTPException(status_code=404, detail="Seguimiento no encontrado")

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(record, key, value)

    db.commit()
    db.refresh(record)
    return record


@router.delete("/{record_id}", status_code=204)
def delete_record(
    student_id: str,
    record_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles("ADMIN", "DOCENTE")),
):
    student = db.get(Student, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Alumno no encontrado")

    record = db.get(PedagogicalRecord, record_id)
    if not record or str(record.student_id) != student_id:
        raise HTTPException(status_code=404, detail="Seguimiento no encontrado")

    db.delete(record)
    db.commit()
