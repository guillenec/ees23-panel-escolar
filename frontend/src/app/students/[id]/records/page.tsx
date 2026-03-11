"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { apiFetchWithRefresh } from "@/lib/api-client";
import { RequireAuth } from "@/components/auth/require-auth";
import { useAuthStore } from "@/store/auth-store";

type RecordItem = {
  id: string;
  teacher_id: string;
  record_date: string;
  observation: string;
  actions_taken: string | null;
  next_steps: string | null;
};

type CurrentUser = {
  id: string;
  role: "ADMIN" | "DOCENTE";
};

export default function StudentRecordsPage() {
  const { id } = useParams<{ id: string }>();
  const token = useAuthStore((s) => s.token);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const setSession = useAuthStore((s) => s.setSession);
  const clearSession = useAuthStore((s) => s.clearSession);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [recordDate, setRecordDate] = useState(new Date().toISOString().slice(0, 10));
  const [observation, setObservation] = useState("");
  const [actionsTaken, setActionsTaken] = useState("");
  const [nextSteps, setNextSteps] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editObservation, setEditObservation] = useState("");
  const [editActions, setEditActions] = useState("");
  const [editNextSteps, setEditNextSteps] = useState("");

  const loadRecords = async () => {
    if (!hasHydrated || !token) return;
    try {
      const data = await apiFetchWithRefresh<RecordItem[]>(
        `/students/${id}/records`,
        { accessToken: token, refreshToken, setSession, clearSession }
      );
      setRecords(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar seguimientos");
    }
  };

  const loadCurrentUser = async () => {
    if (!hasHydrated || !token) return;
    try {
      const me = await apiFetchWithRefresh<CurrentUser>(
        "/auth/me",
        { accessToken: token, refreshToken, setSession, clearSession }
      );
      setCurrentUser(me);
    } catch {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    loadCurrentUser();
    loadRecords();
  }, [hasHydrated, token, refreshToken, setSession, clearSession, id]);

  const canManageRecord = (record: RecordItem) => {
    if (!currentUser) return false;
    return currentUser.role === "ADMIN" || currentUser.id === record.teacher_id;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;
    setLoading(true);
    setError(null);

    try {
      await apiFetchWithRefresh(
        `/students/${id}/records`,
        { accessToken: token, refreshToken, setSession, clearSession },
        {
        method: "POST",
        body: JSON.stringify({
          record_date: recordDate,
          observation,
          actions_taken: actionsTaken || null,
          next_steps: nextSteps || null
        })
        }
      );
      setObservation("");
      setActionsTaken("");
      setNextSteps("");
      await loadRecords();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (record: RecordItem) => {
    setEditingId(record.id);
    setEditDate(record.record_date);
    setEditObservation(record.observation);
    setEditActions(record.actions_taken ?? "");
    setEditNextSteps(record.next_steps ?? "");
  };

  const saveEdit = async (recordId: string) => {
    if (!token) return;
    try {
      await apiFetchWithRefresh(
        `/students/${id}/records/${recordId}`,
        { accessToken: token, refreshToken, setSession, clearSession },
        {
        method: "PATCH",
        body: JSON.stringify({
          record_date: editDate,
          observation: editObservation,
          actions_taken: editActions || null,
          next_steps: editNextSteps || null
        })
        }
      );
      setEditingId(null);
      await loadRecords();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar");
    }
  };

  const deleteRecord = async (recordId: string) => {
    if (!token) return;
    try {
      await apiFetchWithRefresh(
        `/students/${id}/records/${recordId}`,
        { accessToken: token, refreshToken, setSession, clearSession },
        {
        method: "DELETE",
        }
      );
      if (editingId === recordId) setEditingId(null);
      await loadRecords();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar");
    }
  };

  return (
    <RequireAuth>
      <main className="mx-auto min-h-screen max-w-5xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-brand-700">Seguimiento pedagogico</h1>
          <Link href="/students" className="text-sm text-brand-700 underline">
            Volver a alumnos
          </Link>
        </div>

        <form onSubmit={onSubmit} className="rounded-xl bg-white p-5 shadow-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <label className="text-sm">
              Fecha
              <input
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                type="date"
                value={recordDate}
                onChange={(e) => setRecordDate(e.target.value)}
              />
            </label>
            <div />
            <label className="text-sm md:col-span-2">
              Observacion
              <textarea
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                rows={3}
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                required
              />
            </label>
            <label className="text-sm">
              Acciones realizadas
              <textarea
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                rows={3}
                value={actionsTaken}
                onChange={(e) => setActionsTaken(e.target.value)}
              />
            </label>
            <label className="text-sm">
              Proximos pasos
              <textarea
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                rows={3}
                value={nextSteps}
                onChange={(e) => setNextSteps(e.target.value)}
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 rounded-lg bg-brand-500 px-4 py-2 text-white disabled:opacity-60"
          >
            {loading ? "Guardando..." : "Guardar seguimiento"}
          </button>
          {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
        </form>

        <section className="mt-6 space-y-3">
          {records.map((record) => (
            <article key={record.id} className="rounded-xl bg-white p-4 shadow-sm">
            {editingId === record.id ? (
              <div className="space-y-2">
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <textarea
                  rows={3}
                  value={editObservation}
                  onChange={(e) => setEditObservation(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <textarea
                  rows={2}
                  value={editActions}
                  onChange={(e) => setEditActions(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Acciones"
                />
                <textarea
                  rows={2}
                  value={editNextSteps}
                  onChange={(e) => setEditNextSteps(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Proximos pasos"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => saveEdit(record.id)}
                    className="rounded-lg bg-brand-500 px-3 py-2 text-sm text-white"
                  >
                    Guardar cambios
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-xs uppercase tracking-wide text-gray-500">{record.record_date}</p>
                <p className="mt-2 text-sm">{record.observation}</p>
                {record.actions_taken ? (
                  <p className="mt-2 text-sm text-gray-600">Acciones: {record.actions_taken}</p>
                ) : null}
                {record.next_steps ? (
                  <p className="mt-1 text-sm text-gray-600">Proximos pasos: {record.next_steps}</p>
                ) : null}
                {canManageRecord(record) ? (
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(record)}
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteRecord(record.id)}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-700"
                    >
                      Eliminar
                    </button>
                  </div>
                ) : null}
              </>
            )}
            </article>
          ))}
        </section>
      </main>
    </RequireAuth>
  );
}
