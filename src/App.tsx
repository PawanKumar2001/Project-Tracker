import { useTaskStore } from "./store/useTaskStore";
import KanbanView from "./views/Kanban/KanbanView";
import TimelineView from "./views/Timeline/TimelineView";
import FilterBar from "./components/FilterBar";
import ListView from "./views/List/ListView";
import { useEffect } from "react";

export default function App() {
  const view = useTaskStore((s) => s.view);
  const setView = useTaskStore((s) => s.setView);

  const setCursor = useTaskStore((s) => s.setCursor);
  const draggingId = useTaskStore((s) => s.draggingTaskId);
  const hoveredColumn = useTaskStore((s) => s.hoveredColumn);
  const updateTaskStatus = useTaskStore((s) => s.updateTaskStatus);
  const setDraggingTaskId = useTaskStore((s) => s.setDraggingTaskId);

  const filters = useTaskStore((s) => s.filters);
  const setFilters = useTaskStore((s) => s.setFilters);

  useEffect(() => {
    const baseUsers = [
      { id: "u1", name: "Aman", color: "bg-red-400" },
      { id: "u2", name: "Riya", color: "bg-blue-400" },
      { id: "u3", name: "John", color: "bg-green-400" },
    ];

    const interval = setInterval(() => {
      const state = useTaskStore.getState();
      const tasks = state.tasks;

      const updatedUsers = baseUsers.map((user) => ({
        ...user,
        taskId:
          tasks[Math.floor(Math.random() * tasks.length)]?.id || null,
      }));

      state.setActiveUsers(updatedUsers);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // URL SYNC (write)
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.status.length) {
      params.set("status", filters.status.join(","));
    }

    if (filters.priority.length) {
      params.set("priority", filters.priority.join(","));
    }

    if (filters.assignee.length) {
      params.set("assignee", filters.assignee.join(","));
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);
  }, [filters]);

  // URL SYNC (read)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const status = params.get("status")?.split(",") || [];
    const priority = params.get("priority")?.split(",") || [];
    const assignee = params.get("assignee")?.split(",") || [];

    setFilters({
      status: status as any,
      priority,
      assignee,
    });
  }, []);

  return (
    <div
      onPointerMove={(e) =>
        setCursor({ x: e.clientX, y: e.clientY })
      }
      onPointerUp={() => {
        if (draggingId && hoveredColumn) {
          updateTaskStatus(draggingId, hoveredColumn);
        }
        setDraggingTaskId(null);
      }}
      className="p-6 space-y-6 min-h-screen bg-gray-50"
    >
      {/* Top Bar */}
      <div className="flex gap-2">
        <button
          onClick={() => setView("kanban")}
          className={`px-4 py-2 rounded-md ${view === "kanban"
              ? "bg-black text-white"
              : "bg-gray-200"
            }`}
        >
          Kanban
        </button>

        <button
          onClick={() => setView("list")}
          className={`px-4 py-2 rounded-md ${view === "list"
              ? "bg-black text-white"
              : "bg-gray-200"
            }`}
        >
          List
        </button>

        <button
          onClick={() => setView("timeline")}
          className={`px-4 py-2 rounded-md ${view === "timeline"
              ? "bg-black text-white"
              : "bg-gray-200"
            }`}
        >
          Timeline
        </button>
      </div>

      {/* Filters */}
      <FilterBar />

      {/* View */}
      <ViewRenderer />

      <footer className="p-4 text-center text-gray-500">
        Made with ❤️ by Pawan< br/>
        <a href="">Github</a>
      </footer>
    </div>
  );
}

function ViewRenderer() {
  const view = useTaskStore((s) => s.view);

  if (view === "kanban") return <KanbanView />;
  if (view === "list") return <ListView />;
  if (view === "timeline") return <TimelineView />;

  return null;
}