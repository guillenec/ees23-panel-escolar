"""teacher student assignments

Revision ID: 0002_teacher_student_assignments
Revises: 0001_initial_schema
Create Date: 2026-03-12
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "0002_teacher_student_assignments"
down_revision = "0001_initial_schema"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "teacher_student_assignments",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("teacher_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("student_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["student_id"], ["students.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["teacher_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("teacher_id", "student_id", name="uq_teacher_student_assignment"),
    )
    op.create_index(
        op.f("ix_teacher_student_assignments_teacher_id"),
        "teacher_student_assignments",
        ["teacher_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_teacher_student_assignments_student_id"),
        "teacher_student_assignments",
        ["student_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(
        op.f("ix_teacher_student_assignments_student_id"), table_name="teacher_student_assignments"
    )
    op.drop_index(
        op.f("ix_teacher_student_assignments_teacher_id"), table_name="teacher_student_assignments"
    )
    op.drop_table("teacher_student_assignments")
