import { create } from "zustand";
import { persist } from "zustand/middleware";

const useMenuStore = create(
  persist(
    (set) => ({
      menuList: [],
      setMenuList: (menuList) => set({ menuList }),
    }),
    { name: "menu-storage" }
  )
);

export default useMenuStore;
