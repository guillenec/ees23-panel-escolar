"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { RequireAuth } from "@/components/auth/require-auth";
import { apiFetch } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";

type CurrentUser = {
  role: "ADMIN" | "DOCENTE";
};

export default function DashboardRoleRedirectPage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  useEffect(() => {
    const resolveRole = async () => {
      if (!hasHydrated || !token) return;
      try {
        const me = await apiFetch<CurrentUser>("/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        router.replace(me.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/docente");
      } catch {
        router.replace("/login");
      }
    };

    resolveRole();
  }, [hasHydrated, token, router]);

  return (
    <RequireAuth>
      <main className="p-6 text-sm text-gray-600">Cargando dashboard...</main>
    </RequireAuth>
  );
}
