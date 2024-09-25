import { create } from "zustand";
import { TasksStore } from "../lib/types";

export const useTasksStore = create<TasksStore>((set) => ({
  tasks: [],

  setTasks: (newTasks) => set({ tasks: newTasks }),

  clearTasks: () => set({ tasks: [] }),
}));
