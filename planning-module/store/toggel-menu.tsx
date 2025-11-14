import { create } from "zustand";
import { persist } from "zustand/middleware";

type MenuState = {
  isOpen: boolean;
  ToggelMenu: () => void;
};

export const useMenuStore = create<MenuState>()(
  persist(
    (set) => ({
      isOpen: true,
      ToggelMenu: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: "menu-store",
    }
  )
);
