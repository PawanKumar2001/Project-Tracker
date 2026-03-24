import { useRef, useState } from "react";
import { useTaskStore } from "../../store/useTaskStore";
import type { Status } from "../../types/task";

const ROW_HEIGHT = 60;
const BUFFER = 5;

type SortKey = "title" | "priority" | "dueDate";

export default function ListView() {
  const tasks = useTaskStore((s) => s.tasks);
  const filters = useTaskStore((s) => s.filters);
  const updateTaskStatus = useTaskStore((s) => s.updateTaskStatus);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const [sortBy, setSortBy] = useState<SortKey>("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // FILTER 
  const filteredTasks = tasks.filter((task) => {
    const statusOk =
      filters.status.length === 0 ||
      filters.status.includes(task.status);

    const priorityOk =
      filters.priority.length === 0 ||
      filters.priority.includes(task.priority);

    const assigneeOk =
      filters.assignee.length === 0 ||
      filters.assignee.includes(task.assignee);

    return statusOk && priorityOk && assigneeOk;
  });

  // SORT FILTERED DATA
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let result = 0;

    if (sortBy === "title") {
      result = a.title.localeCompare(b.title);
    }

    if (sortBy === "priority") {
      const order = ["critical", "high", "medium", "low"];
      result = order.indexOf(a.priority) - order.indexOf(b.priority);
    }

    if (sortBy === "dueDate") {
      result =
        new Date(a.dueDate).getTime() -
        new Date(b.dueDate).getTime();
    }

    return sortOrder === "asc" ? result : -result;
  });

  // VIRTUAL SCROLL ON SORTED DATA
  const totalHeight = sortedTasks.length * ROW_HEIGHT;

  const visibleCount = Math.ceil(window.innerHeight / ROW_HEIGHT);

  const startIndex = Math.max(
    0,
    Math.floor(scrollTop / ROW_HEIGHT) - BUFFER
  );

  const endIndex = Math.min(
    sortedTasks.length,
    startIndex + visibleCount + BUFFER * 2
  );

  const visibleTasks = sortedTasks.slice(startIndex, endIndex);

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="grid grid-cols-4 bg-gray-100 border rounded-md font-medium text-sm">
        <Header
          label="Title"
          sortKey="title"
          sortBy={sortBy}
          sortOrder={sortOrder}
          setSortBy={setSortBy}
          setSortOrder={setSortOrder}
        />
        <Header
          label="Priority"
          sortKey="priority"
          sortBy={sortBy}
          sortOrder={sortOrder}
          setSortBy={setSortBy}
          setSortOrder={setSortOrder}
        />
        <Header
          label="Due Date"
          sortKey="dueDate"
          sortBy={sortBy}
          sortOrder={sortOrder}
          setSortBy={setSortBy}
          setSortOrder={setSortOrder}
        />
        <div className="p-2">Status</div>
      </div>

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <div className="text-center text-gray-400 py-10 border rounded-md">
          No tasks match filters
        </div>
      )}

      {/* Scroll Container */}
      <div
        ref={containerRef}
        onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
        className="h-[71vh] overflow-y-auto border rounded-md bg-white"
      >
        <div style={{ height: totalHeight, position: "relative" }}>
          {visibleTasks.map((task, i) => {
            const index = startIndex + i;

            return (
              <div
                key={task.id}
                style={{
                  position: "absolute",
                  top: index * ROW_HEIGHT,
                  height: ROW_HEIGHT,
                  left: 0,
                  right: 0,
                }}
                className="border-b px-4 flex items-center"
              >
                <div className="grid grid-cols-4 text-sm w-full">
                  <div>{task.title}</div>

                  <div className="capitalize">{task.priority}</div>

                  <div>
                    {new Date(task.dueDate).toLocaleDateString()}
                  </div>

                  <div>
                    <select
                      value={task.status}
                      onChange={(e) =>
                        updateTaskStatus(
                          task.id,
                          e.target.value as Status
                        )
                      }
                      className="border rounded px-2 py-1 text-xs bg-white cursor-pointer"
                    >
                      <option value="todo">To Do</option>
                      <option value="inprogress">In Progress</option>
                      <option value="inreview">In Review</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Header({
  label,
  sortKey,
  sortBy,
  sortOrder,
  setSortBy,
  setSortOrder,
}: any) {
  const isActive = sortBy === sortKey;

  const handleClick = () => {
    if (isActive) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(sortKey);
      setSortOrder("asc");
    }
  };

  return (
    <div
      onClick={handleClick}
      className="p-2 cursor-pointer select-none flex items-center gap-1"
    >
      {label}
      {isActive && (sortOrder === "asc" ? "↑" : "↓")}
    </div>
  );
}