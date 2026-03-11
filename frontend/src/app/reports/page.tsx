"use client";

import { FormEvent, useEffect, useState } from "react";

import { apiFetchWithRefresh } from "@/lib/api-client";
import { RequireAuth } from "@/components/auth/require-auth";
import { useAuthStore } from "@/store/auth-store";

type Student = {
  id: string;
  first_name: string;
  last_name: string;
};

type ReportItem = {
  id: string;
  student_id: string;
  period_label: string;
  summary_text: string;
  created_at: string;
};

type CurrentUser = {
  id: string;
  role: "ADMIN" | "DOCENTE";
};

export default function ReportsPage() {
  const token = useAuthStore((s) => s.token);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const setSession = useAuthStore((s) => s.setSession);
  const clearSession = useAuthStore((s) => s.clearSession);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const [students, setStudents] = useState<Student[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [studentId, setStudentId] = useState("");
  const [periodLabel, setPeriodLabel] = useState("1er trimestre 2026");
  const [summaryText, setSummaryText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    if (!hasHydrated || !token) return;
    try {
      const [studentsData, reportsData] = await Promise.all([
        apiFetchWithRefresh<Student[]>("/students", {
          accessToken: token,
          refreshToken,
          setSession,
          clearSession
        }),
        apiFetchWithRefresh<ReportItem[]>("/reports", {
          accessToken: token,
          refreshToken,
          setSession,
          clearSession
        })
      ]);
      setStudents(studentsData);
      setReports(reportsData);
      if (!studentId && studentsData.length) {
        setStudentId(studentsData[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando informes");
    }
  };

  const loadCurrentUser = async () => {
    if (!hasHydrated || !token) return;
    try {
      const me = await apiFetchWithRefresh<CurrentUser>("/auth/me", {
        accessToken: token,
        refreshToken,
        setSession,
        clearSession
      });
      setCurrentUser(me);
    } catch {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    loadCurrentUser();
    loadData();
  }, [hasHydrated, token, refreshToken, setSession, clearSession]);

  const onGenerate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token || !studentId) return;
    setError(null);

    try {
      await apiFetchWithRefresh<ReportItem>(
        "/reports/generate",
        { accessToken: token, refreshToken, setSession, clearSession },
        {
        method: "POST",
        body: JSON.stringify({
          student_id: studentId,
          period_label: periodLabel,
          summary_text: summaryText || null
        })
        }
      );
      setSummaryText("");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo generar informe");
    }
  };

  return (
    <RequireAuth>
      <main className="mx-auto min-h-screen max-w-5xl p-6">
        <h1 className="text-2xl font-semibold text-brand-700">Informes</h1>
        {currentUser?.role === "DOCENTE" ? (
          <p className="mt-2 text-sm text-gray-600">Estas viendo solo informes generados por tu usuario.</p>
        ) : null}
        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}

        <form onSubmit={onGenerate} className="mt-4 rounded-xl bg-white p-5 shadow-sm">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">
            Alumno
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.last_name}, {student.first_name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Periodo
            <input
              value={periodLabel}
              onChange={(e) => setPeriodLabel(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </label>
          <label className="text-sm md:col-span-2">
            Texto base (opcional)
            <textarea
              value={summaryText}
              onChange={(e) => setSummaryText(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="Si lo dejas vacio, se genera resumen desde seguimientos"
            />
          </label>
        </div>
        <button className="mt-4 rounded-lg bg-brand-500 px-4 py-2 text-white" type="submit">
          Generar informe
        </button>
        </form>

        <section className="mt-6 space-y-3">
          {reports.map((report) => (
            <article key={report.id} className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-gray-500">{report.period_label}</p>
            <p className="mt-2 line-clamp-3 text-sm text-gray-700">{report.summary_text}</p>
            <a
              href={`http://localhost:8000/api/v1/reports/${report.id}/pdf`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-sm text-brand-700 underline"
            >
              Descargar PDF
            </a>
            </article>
          ))}
        </section>
      </main>
    </RequireAuth>
  );
}
