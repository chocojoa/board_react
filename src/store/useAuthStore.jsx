import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      signIn: ({ user, token }) => set({ isAuthenticated: true, user, token }),
      signOut: () =>
        set({ isAuthenticated: false, user: null, token: null }),
    }),
    { name: "auth-storage" }
  )
);

export default useAuthStore;
