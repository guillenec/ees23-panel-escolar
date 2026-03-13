from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import require_roles
from app.db.session import get_db
from app.models.student import Student
from app.models.teacher_student_assignment import TeacherStudentAssignment
from app.models.user import User
from app.schemas.assignment import AssignmentCreate, AssignmentExpandedRead, AssignmentRead

router = APIRouter(prefix="/assignments", tags=["assignments"])


@router.get("", response_model=list[AssignmentExpandedRead])
def list_assignments(db: Session = Depends(get_db), _: User = Depends(require_roles("ADMIN"))):
    rows = db.execute(
        select(TeacherStudentAssignment, User.full_name, Student.last_name, Student.first_name)
        .join(User, User.id == TeacherStudentAssignment.teacher_id)
        .join(Student, Student.id == TeacherStudentAssignment.student_id)
        .order_by(TeacherStudentAssignment.created_at.desc())
    ).all()

    return [
        AssignmentExpandedRead(
            id=assignment.id,
            teacher_id=assignment.teacher_id,
            student_id=assignment.student_id,
            created_at=assignment.created_at,
            teacher_name=teacher_name,
            student_name=f"{last_name}, {first_name}",
        )
        for assignment, teacher_name, last_name, first_name in rows
    ]


@router.post("", response_model=AssignmentRead)
def create_assignment(
    payload: AssignmentCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles("ADMIN")),
):
    teacher = db.get(User, payload.teacher_id)
    if not teacher or teacher.role != "DOCENTE":
        raise HTTPException(status_code=400, detail="Docente invalido")

    student = db.get(Student, payload.student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Alumno no encontrado")

    exists = db.scalar(
        select(TeacherStudentAssignment).where(
            TeacherStudentAssignment.teacher_id == payload.teacher_id,
            TeacherStudentAssignment.student_id == payload.student_id,
        )
    )
    if exists:
        raise HTTPException(status_code=400, detail="Asignacion ya existente")

    assignment = TeacherStudentAssignment(
        teacher_id=payload.teacher_id,
        student_id=payload.student_id,
    )
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return assignment


@router.delete("/{assignment_id}", status_code=204)
def delete_assignment(
    assignment_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles("ADMIN")),
):
    assignment = db.get(TeacherStudentAssignment, assignment_id)
    if not assignment:
        raise HTTPException(status_code=404, detail="Asignacion no encontrada")

    db.delete(assignment)
    db.commit()
