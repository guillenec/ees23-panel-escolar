"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth-store";

type Props = {
  children: ReactNode;
};

export function RequireAuth({ children }: Props) {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  useEffect(() => {
    if (hasHydrated && !token) {
      router.replace("/login");
    }
  }, [hasHydrated, token, router]);

  if (!hasHydrated) {
    return <main className="p-6 text-sm text-gray-600">Cargando sesion...</main>;
  }

  if (!token) {
    return <main className="p-6 text-sm text-gray-600">Redirigiendo a login...</main>;
  }

  return <>{children}</>;
}
