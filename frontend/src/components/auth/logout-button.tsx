"use client";

import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth-store";

export function LogoutButton() {
  const router = useRouter();
  const setToken = useAuthStore((s) => s.setToken);

  const onLogout = () => {
    setToken(null);
    router.replace("/login");
  };

  return (
    <button
      type="button"
      onClick={onLogout}
      className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
    >
      Cerrar sesion
    </button>
  );
}
