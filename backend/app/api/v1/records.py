from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import is_admin, require_roles
from app.db.session import get_db
from app.models.pedagogical_record import PedagogicalRecord
from app.models.student import Student
from app.models.teacher_student_assignment import TeacherStudentAssignment
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
    current_user: User = Depends(require_roles("ADMIN", "DOCENTE")),
):
    student = _ensure_student_access(db, student_id, current_user)

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
    student = _ensure_student_access(db, student_id, current_user)

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
    current_user: User = Depends(require_roles("ADMIN", "DOCENTE")),
):
    student = _ensure_student_access(db, student_id, current_user)

    record = db.get(PedagogicalRecord, record_id)
    if not record or str(record.student_id) != student_id:
        raise HTTPException(status_code=404, detail="Seguimiento no encontrado")

    if not is_admin(current_user) and record.teacher_id != current_user.id:
        raise HTTPException(status_code=403, detail="Solo el docente autor o ADMIN puede editar")

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
    current_user: User = Depends(require_roles("ADMIN", "DOCENTE")),
):
    student = _ensure_student_access(db, student_id, current_user)

    record = db.get(PedagogicalRecord, record_id)
    if not record or str(record.student_id) != student_id:
        raise HTTPException(status_code=404, detail="Seguimiento no encontrado")

    if not is_admin(current_user) and record.teacher_id != current_user.id:
        raise HTTPException(status_code=403, detail="Solo el docente autor o ADMIN puede eliminar")

    db.delete(record)
    db.commit()


def _ensure_student_access(db: Session, student_id: str, current_user: User) -> Student:
    student = db.get(Student, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Alumno no encontrado")

    if current_user.role == "DOCENTE":
        assignment = db.scalar(
            select(TeacherStudentAssignment).where(
                TeacherStudentAssignment.teacher_id == current_user.id,
                TeacherStudentAssignment.student_id == student.id,
            )
        )
        if not assignment:
            raise HTTPException(status_code=403, detail="Alumno no asignado al docente")

    return student
