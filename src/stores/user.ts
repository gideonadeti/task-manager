import { create } from "zustand";

import { UserStore } from "../lib/types";

export const useUserStore = create<UserStore>((set) => ({
  user: null,

  setUser: (newUser) => set({ user: newUser }),

  clearUser: () => set({ user: null }),
}));
