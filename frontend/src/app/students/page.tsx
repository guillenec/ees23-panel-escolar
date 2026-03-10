"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { apiFetch } from "@/lib/api-client";
import { RequireAuth } from "@/components/auth/require-auth";
import { useAuthStore } from "@/store/auth-store";

type Student = {
  id: string;
  first_name: string;
  last_name: string;
  dni: string;
  school_year: string | null;
  shift: string | null;
};

export default function StudentsPage() {
  const token = useAuthStore((s) => s.token);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasHydrated || !token) return;

    apiFetch<Student[]>("/students", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(setStudents)
      .catch((err) => setError(err instanceof Error ? err.message : "Error al cargar"));
  }, [hasHydrated, token]);

  return (
    <RequireAuth>
      <main className="mx-auto min-h-screen max-w-5xl p-6">
        <h1 className="text-2xl font-semibold text-brand-700">Alumnos</h1>
        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}

        <div className="mt-4 overflow-hidden rounded-xl bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="px-4 py-3">Apellido y nombre</th>
                <th className="px-4 py-3">DNI</th>
                <th className="px-4 py-3">Anio</th>
                <th className="px-4 py-3">Turno</th>
                <th className="px-4 py-3">Accion</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">{student.last_name + ", " + student.first_name}</td>
                  <td className="px-4 py-3">{student.dni}</td>
                  <td className="px-4 py-3">{student.school_year ?? "-"}</td>
                  <td className="px-4 py-3">{student.shift ?? "-"}</td>
                  <td className="px-4 py-3">
                    <Link href={`/students/${student.id}/records`} className="text-brand-700 underline">
                      Seguimientos
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </RequireAuth>
  );
}
