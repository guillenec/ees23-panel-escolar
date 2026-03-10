"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthState = {
  token: string | null;
  hasHydrated: boolean;
  setToken: (token: string | null) => void;
  setHasHydrated: (value: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      hasHydrated: false,
      setToken: (token) => set({ token }),
      setHasHydrated: (value) => set({ hasHydrated: value })
    }),
    {
      name: "ees23-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);
