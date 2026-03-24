import { create } from "zustand";
import type { Task, Status } from "../types/task";
import { generateTasks } from "../data/generator";

type View = "kanban" | "list" | "timeline";

type Filters = {
  status: Status[];
  priority: string[];
  assignee: string[];
};

type TaskState = {
  tasks: Task[];
  view: View;

  // Drag state
  draggingTaskId: string | null;
  setDraggingTaskId: (id: string | null) => void;

  cursor: { x: number; y: number };
  setCursor: (pos: { x: number; y: number }) => void;

  hoveredColumn: Status | null;
  setHoveredColumn: (status: Status | null) => void;

  // Filters
  filters: Filters;
  setFilters: (filters: Partial<Filters>) => void;
  clearFilters: () => void;

  // Other actions
  setView: (view: View) => void;
  setTasks: (tasks: Task[]) => void;
  updateTaskStatus: (id: string, status: Status) => void;

  activeUsers: {
    id: string;
    name: string;
    color: string;
    taskId: string | null;
}[];
setActiveUsers: (users: TaskState["activeUsers"]) => void;

};

export const useTaskStore = create<TaskState>((set) => ({
  // Generator
  tasks: generateTasks(500),
  
  activeUsers: [],
  
  view: "kanban",

  // Drag
  draggingTaskId: null,
  setDraggingTaskId: (id) => set({ draggingTaskId: id }),

  cursor: { x: 0, y: 0 },
  setCursor: (pos) => set({ cursor: pos }),

  hoveredColumn: null,
  setHoveredColumn: (status) => set({ hoveredColumn: status }),

  // Filters
  filters: {
    status: [],
    priority: [],
    assignee: [],
  },

  setFilters: (filters) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...filters,
      },
    })),

  clearFilters: () =>
    set({
      filters: {
        status: [],
        priority: [],
        assignee: [],
      },
    }),

  // Other actions
  setView: (view) => set({ view }),

  setTasks: (tasks) => set({ tasks }),

  setActiveUsers: (users) => set({ activeUsers: users }),
  
  updateTaskStatus: (id, status) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, status } : task
      ),
    })),
}));