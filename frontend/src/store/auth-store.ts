"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthState = {
  token: string | null;
  refreshToken: string | null;
  hasHydrated: boolean;
  setSession: (accessToken: string | null, refreshToken: string | null) => void;
  clearSession: () => void;
  setHasHydrated: (value: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      hasHydrated: false,
      setSession: (accessToken, refreshToken) => set({ token: accessToken, refreshToken }),
      clearSession: () => set({ token: null, refreshToken: null }),
      setHasHydrated: (value) => set({ hasHydrated: value })
    }),
    {
      name: "ees23-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token, refreshToken: state.refreshToken }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);
