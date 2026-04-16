import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      signIn: ({ user }) => set({ isAuthenticated: true, user }),
      signOut: () =>
        set({ isAuthenticated: false, user: null }),
    }),
    { name: "auth-storage" }
  )
);

export default useAuthStore;
