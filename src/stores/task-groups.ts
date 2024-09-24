import { create } from "zustand";

import { TaskGroupsStore } from "../lib/types";

export const useTaskGroupsStore = create<TaskGroupsStore>((set) => ({
  taskGroups: null,

  setTaskGroups: (newTaskGroups) => set({ taskGroups: newTaskGroups }),

  clearTaskGroups: () => set({ taskGroups: null }),
}));
