import { useTaskStore } from "../../store/useTaskStore";

const DAY_WIDTH = 40;

export default function TimelineView() {
  const tasks = useTaskStore((s) => s.tasks);
  const filters = useTaskStore((s) => s.filters);

  // Apply filters
  const filteredTasks = tasks.filter((task) => {
    const statusOk =
      filters.status.length === 0 || filters.status.includes(task.status);

    const priorityOk =
      filters.priority.length === 0 || filters.priority.includes(task.priority);

    const assigneeOk =
      filters.assignee.length === 0 || filters.assignee.includes(task.assignee);

    return statusOk && priorityOk && assigneeOk;
  });

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="overflow-x-auto border rounded-md bg-white">
      <div
        className="min-w-full relative"
        style={{ width: daysInMonth * DAY_WIDTH }}
      >
        {/* Header */}
        <div className="flex border-b text-xs sticky top-0 bg-white z-20">
          {days.map((day) => (
            <div
              key={day}
              style={{ width: DAY_WIDTH }}
              className="text-center py-1 border-r"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Today line */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-blue-500 z-10"
          style={{ left: (today.getDate() - 1) * DAY_WIDTH }}
        />

        {/* Task container */}
        {filteredTasks.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            No tasks match filters
          </div>
        ) : (
          <div className="h-[73vh] overflow-y-auto w-full relative">
            <div style={{ height: filteredTasks.length * 45, position: "relative" }}>
              {filteredTasks.map((task, index) => (
                <TaskBar key={task.id} task={task} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TaskBar({ task, index }: any) {
  const hasStart = !!task.startDate;

  const start = hasStart ? new Date(task.startDate) : new Date(task.dueDate);
  const end = new Date(task.dueDate);

  const startDay = start.getDate();
  const endDay = end.getDate();

  const left = (startDay - 1) * DAY_WIDTH;
  const width = hasStart ? Math.max(1, (endDay - startDay + 1) * DAY_WIDTH) : DAY_WIDTH;

  const colors: Record<string, string> = {
    critical: "bg-red-500",
    high: "bg-orange-400",
    medium: "bg-yellow-400",
    low: "bg-green-400",
  };

  return (
    <div
      className="absolute h-8 flex items-center"
      style={{
        top: index * 45,
        left,
        width,
      }}
    >
      <div
        className={`${colors[task.priority]} w-full h-full rounded text-xs text-white flex items-center px-2`}
      >
        {task.title}
      </div>
    </div>
  );
}