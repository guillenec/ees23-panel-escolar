"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

import { RequireAuth } from "@/components/auth/require-auth";
import { apiFetchWithRefresh } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";

type DriveItem = {
  id: string;
  name: string;
  mime_type: string;
  kind: "folder" | "file";
  modified_at: string;
  web_view_url: string;
  icon_url: string;
  owner: string;
};

type DriveItemsResponse = {
  status: string;
  source: string;
  parent_id: string;
  student_id?: string | null;
  count: number;
  items: DriveItem[];
};

type Student = {
  id: string;
  first_name: string;
  last_name: string;
};

type CurrentUser = {
  id: string;
  role: "ADMIN" | "DOCENTE";
};

type Breadcrumb = {
  id: string | null;
  name: string;
};

export default function DocumentsPage() {
  const token = useAuthStore((s) => s.token);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const setSession = useAuthStore((s) => s.setSession);
  const clearSession = useAuthStore((s) => s.clearSession);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  const [items, setItems] = useState<DriveItem[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [foldersOnly, setFoldersOnly] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([{ id: null, name: "Raiz documental" }]);
  const [source, setSource] = useState<string>("-");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentParentId = breadcrumbs[breadcrumbs.length - 1]?.id ?? null;

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (currentParentId) params.set("parent_id", currentParentId);
    if (search) params.set("search", search);
    if (selectedStudentId) params.set("student_id", selectedStudentId);
    params.set("folders_only", String(foldersOnly));
    return params.toString();
  }, [currentParentId, search, selectedStudentId, foldersOnly]);

  useEffect(() => {
    if (!hasHydrated || !token) return;

    const loadContext = async () => {
      try {
        const [me, studentsData] = await Promise.all([
          apiFetchWithRefresh<CurrentUser>("/auth/me", {
            accessToken: token,
            refreshToken,
            setSession,
            clearSession
          }),
          apiFetchWithRefresh<Student[]>("/students", {
            accessToken: token,
            refreshToken,
            setSession,
            clearSession
          })
        ]);
        setCurrentUser(me);
        setStudents(studentsData);
        if (me.role === "DOCENTE" && studentsData.length > 0) {
          setSelectedStudentId(studentsData[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo cargar contexto");
      }
    };

    loadContext();
  }, [hasHydrated, token, refreshToken, setSession, clearSession]);

  useEffect(() => {
    if (!hasHydrated || !token) return;
    if (currentUser?.role === "DOCENTE" && !selectedStudentId) return;

    const loadItems = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await apiFetchWithRefresh<DriveItemsResponse>(
          `/integrations/drive/items?${query}`,
          { accessToken: token, refreshToken, setSession, clearSession }
        );
        setItems(data.items);
        setSource(data.source);
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo cargar el listado de Drive");
      } finally {
        setIsLoading(false);
      }
    };

    loadItems();
  }, [
    hasHydrated,
    token,
    refreshToken,
    setSession,
    clearSession,
    currentUser?.role,
    selectedStudentId,
    query
  ]);

  const onSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearch(searchInput.trim());
  };

  const openFolder = (item: DriveItem) => {
    if (item.kind !== "folder") return;
    setBreadcrumbs((prev) => [...prev, { id: item.id, name: item.name }]);
  };

  const goToCrumb = (index: number) => {
    setBreadcrumbs((prev) => prev.slice(0, index + 1));
  };

  return (
    <RequireAuth>
      <main className="mx-auto min-h-screen max-w-6xl px-6 py-8">
        <header className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-xl shadow-slate-200/70 backdrop-blur">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-brand-700">
                Integracion Drive
              </p>
              <h1 className="mt-3 text-2xl font-semibold text-slate-900 md:text-3xl">Explorador documental</h1>
              <p className="mt-1 text-sm text-slate-600">
                Navegacion de carpetas y archivos institucionales con acceso directo para abrir en Drive.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-300 hover:text-brand-700"
            >
              Volver al dashboard
            </Link>
          </div>
        </header>

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
            {breadcrumbs.map((crumb, index) => (
              <button
                key={`${crumb.name}-${index}`}
                onClick={() => goToCrumb(index)}
                className="rounded-md px-2 py-1 transition hover:bg-slate-100"
                type="button"
              >
                {crumb.name}
                {index < breadcrumbs.length - 1 ? " /" : ""}
              </button>
            ))}
          </div>

          <form onSubmit={onSearch} className="mt-4 grid gap-3 md:grid-cols-[1fr_auto_auto]">
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Buscar por nombre de carpeta o archivo"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
            <label className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={foldersOnly}
                onChange={(event) => setFoldersOnly(event.target.checked)}
              />
              Solo carpetas
            </label>
            <button
              type="submit"
              className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Aplicar
            </button>
          </form>

          {currentUser?.role === "DOCENTE" ? (
            <div className="mt-3">
              <label className="text-sm text-slate-700">
                Alumno asignado
                <select
                  value={selectedStudentId}
                  onChange={(event) => {
                    setSelectedStudentId(event.target.value);
                    setBreadcrumbs([{ id: null, name: "Raiz documental" }]);
                  }}
                  className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                >
                  {students.length === 0 ? <option value="">Sin alumnos asignados</option> : null}
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.last_name}, {student.first_name}
                    </option>
                  ))}
                </select>
              </label>
              {students.length === 0 ? (
                <p className="mt-1 text-xs text-slate-500">
                  Solicita al administrador la asignacion de alumnos para habilitar este modulo.
                </p>
              ) : null}
            </div>
          ) : null}

          <p className="mt-3 text-xs uppercase tracking-wide text-slate-500">Origen activo: {source}</p>
          {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
        </section>

        <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Propietario</th>
                <th className="px-4 py-3">Modificado</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td className="px-4 py-4 text-slate-500" colSpan={5}>
                    Cargando documentos...
                  </td>
                </tr>
              ) : null}

              {!isLoading && items.length === 0 ? (
                <tr>
                  <td className="px-4 py-4 text-slate-500" colSpan={5}>
                    No hay elementos para mostrar con los filtros actuales.
                  </td>
                </tr>
              ) : null}

              {!isLoading
                ? items.map((item) => (
                    <tr key={item.id} className="border-t border-slate-100">
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => openFolder(item)}
                          disabled={item.kind !== "folder"}
                          className="text-left font-medium text-slate-900 disabled:cursor-default disabled:text-slate-700"
                        >
                          {item.name}
                        </button>
                      </td>
                      <td className="px-4 py-3 uppercase text-slate-600">{item.kind}</td>
                      <td className="px-4 py-3 text-slate-600">{item.owner || "-"}</td>
                      <td className="px-4 py-3 text-slate-600">{item.modified_at ? item.modified_at.slice(0, 10) : "-"}</td>
                      <td className="px-4 py-3">
                        <a
                          href={item.web_view_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-brand-700 underline"
                        >
                          Abrir en Drive
                        </a>
                      </td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </section>
      </main>
    </RequireAuth>
  );
}
