import { useTaskStore } from "../store/useTaskStore";
import type { Status } from "../types/task";

export default function FilterBar() {
  const filters = useTaskStore((s) => s.filters);
  const setFilters = useTaskStore((s) => s.setFilters);
  const clearFilters = useTaskStore((s) => s.clearFilters);

  const toggle = (
    type: "status" | "priority" | "assignee",
    value: string
  ) => {
    const current = filters[type] as string[];

    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    setFilters({ [type]: updated });
  };

  return (
    <div className="flex gap-4 flex-wrap items-center">
      {/* Status */}
      <div className="flex gap-2">
        {(["todo", "inprogress", "inreview", "done"] as Status[]).map(
          (s) => (
            <button
              key={s}
              onClick={() => toggle("status", s)}
              className={`px-2 py-1 text-xs rounded ${
                filters.status.includes(s)
                  ? "bg-black text-white"
                  : "bg-gray-200"
              }`}
            >
              {s}
            </button>
          )
        )}
      </div>

      {/* Priority */}
      <div className="flex gap-2">
        {["critical", "high", "medium", "low"].map((p) => (
          <button
            key={p}
            onClick={() => toggle("priority", p)}
            className={`px-2 py-1 text-xs rounded ${
              filters.priority.includes(p)
                ? "bg-black text-white"
                : "bg-gray-200"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Clear Filters */}
      {(filters.status.length ||
        filters.priority.length ||
        filters.assignee.length) > 0 && (
        <button
          onClick={clearFilters}
          className="text-xs underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}