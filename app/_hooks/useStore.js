import { create } from "zustand";

export const useStore = create((set) => ({
  userData: null,
  streakModal: false,
  setUserData: (data) => set({userData: data }),
  setStreakModal: (data) => set({ streakModal: data }),
}));
