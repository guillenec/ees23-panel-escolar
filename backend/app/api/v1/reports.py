from io import BytesIO

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.pedagogical_record import PedagogicalRecord
from app.models.report import Report
from app.models.student import Student
from app.models.user import User
from app.schemas.report import ReportGenerateRequest, ReportRead

router = APIRouter(prefix="/reports", tags=["reports"])


def _build_default_summary(records: list[PedagogicalRecord]) -> str:
    if not records:
        return "Sin seguimientos cargados para el periodo seleccionado."

    lines = ["Resumen de seguimiento pedagogico:"]
    for rec in records[:8]:
        lines.append(f"- {rec.record_date}: {rec.observation}")
    return "\n".join(lines)


@router.get("", response_model=list[ReportRead])
def list_reports(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return list(db.scalars(select(Report).order_by(Report.created_at.desc())))


@router.post("/generate", response_model=ReportRead)
def generate_report(
    payload: ReportGenerateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    student = db.get(Student, payload.student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Alumno no encontrado")

    records = list(
        db.scalars(
            select(PedagogicalRecord)
            .where(PedagogicalRecord.student_id == student.id)
            .order_by(PedagogicalRecord.record_date.desc())
        )
    )

    summary = payload.summary_text or _build_default_summary(records)
    report = Report(
        student_id=student.id,
        created_by=current_user.id,
        period_label=payload.period_label,
        summary_text=summary,
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


@router.get("/{report_id}/pdf")
def download_report_pdf(
    report_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    report = db.get(Report, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Informe no encontrado")

    student = db.get(Student, report.student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Alumno no encontrado")

    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    y = height - 50
    pdf.setFont("Helvetica-Bold", 14)
    pdf.drawString(40, y, "Informe pedagogico - EES23")

    y -= 30
    pdf.setFont("Helvetica", 11)
    pdf.drawString(40, y, f"Alumno: {student.last_name}, {student.first_name}")
    y -= 18
    pdf.drawString(40, y, f"Periodo: {report.period_label}")

    y -= 28
    pdf.setFont("Helvetica", 10)
    for line in report.summary_text.splitlines():
        if y < 60:
            pdf.showPage()
            y = height - 60
            pdf.setFont("Helvetica", 10)
        pdf.drawString(40, y, line[:140])
        y -= 14

    pdf.showPage()
    pdf.save()
    buffer.seek(0)

    filename = f"informe-{student.last_name.lower()}-{report.id}.pdf"
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
