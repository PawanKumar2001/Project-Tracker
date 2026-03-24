import { useTaskStore } from "../../store/useTaskStore";

export default function KanbanView() {
    const tasks = useTaskStore((s) => s.tasks);
    const filters = useTaskStore((s) => s.filters);

    // Apply filters
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

    const columns = {
        todo: filteredTasks.filter((t) => t.status === "todo"),
        inprogress: filteredTasks.filter((t) => t.status === "inprogress"),
        inreview: filteredTasks.filter((t) => t.status === "inreview"),
        done: filteredTasks.filter((t) => t.status === "done"),
    };

    return (
        <>
            {/* Responsive grid: 1 col mobile, 4 cols desktop */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Column title="To Do" tasks={columns.todo} status="todo" />
                <Column title="In Progress" tasks={columns.inprogress} status="inprogress" />
                <Column title="In Review" tasks={columns.inreview} status="inreview" />
                <Column title="Done" tasks={columns.done} status="done" />
            </div>

            <DragPreview />
        </>
    );
}

function Column({ title, tasks, status }: any) {
    const setHoveredColumn = useTaskStore((s) => s.setHoveredColumn);
    const hoveredColumn = useTaskStore((s) => s.hoveredColumn);

    return (
        <div
            onPointerEnter={() => setHoveredColumn(status)}
            onPointerLeave={() => setHoveredColumn(null)}
            className={`rounded-lg p-3 flex flex-col transition ${
                hoveredColumn === status ? "bg-blue-100" : "bg-gray-100"
            } h-60 md:h-[75vh]`}
        >
            {/* Header */}
            <div className="font-semibold mb-3 flex justify-between items-center">
                <span>{title}</span>
                <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                    {tasks.length}
                </span>
            </div>

            {/* Task list: scrollable if content overflows */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {tasks.length === 0 ? (
                    <EmptyState />
                ) : (
                    tasks.map((task: any) => (
                        <TaskCard key={task.id} task={task} />
                    ))
                )}
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
            <div className="text-sm italic">No tasks here</div>
            <div className="text-xs mt-1">Drag tasks to this column</div>
        </div>
    );
}

function TaskCard({ task }: any) {
    const setDraggingTaskId = useTaskStore((s) => s.setDraggingTaskId);
    const draggingId = useTaskStore((s) => s.draggingTaskId);

    const activeUsers = useTaskStore((s) => s.activeUsers);
    const usersOnTask = activeUsers.filter((u) => u.taskId === task.id);

    if (draggingId === task.id) {
        return (
            <div className="h-[90px] rounded-md border-2 border-dashed border-gray-400 bg-gray-100" />
        );
    }

    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const isToday = diffDays === 0;
    const isOverdue = diffDays < 0;

    return (
        <div
            onPointerDown={(e) => {
                e.preventDefault();
                setDraggingTaskId(task.id);
            }}
            className="bg-white p-3 rounded-md shadow-sm border hover:shadow-md transition cursor-grab active:cursor-grabbing select-none"
        >
            <div className="font-medium">{task.title}</div>

            <div className="flex items-center justify-between mt-2">
                <Avatar name={task.assignee} />
                <PriorityBadge priority={task.priority} />
            </div>

            <div className="text-xs mt-2">
                {isToday ? (
                    <span className="text-blue-600 font-medium">Due Today</span>
                ) : isOverdue ? (
                    <span className="text-red-600 font-medium">
                        {Math.abs(diffDays)} days overdue
                    </span>
                ) : (
                    <span className="text-gray-500">
                        {dueDate.toLocaleDateString()}
                    </span>
                )}
            </div>

            {usersOnTask.length > 0 && (
                <div className="flex -space-x-2 mt-2">
                    {usersOnTask.slice(0, 3).map((u) => (
                        <div
                            key={u.id}
                            className="w-5 h-5 rounded-full text-xs text-white flex items-center justify-center font-bold"
                            style={{ backgroundColor: u.color }}
                        >
                            {u.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")
                                .toUpperCase()}
                        </div>
                    ))}
                    {usersOnTask.length > 3 && (
                        <div className="w-5 h-5 rounded-full text-xs bg-gray-400 flex items-center justify-center font-bold">
                            +{usersOnTask.length - 3}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function PriorityBadge({ priority }: any) {
    const colors: Record<string, string> = {
        critical: "bg-red-500 text-white",
        high: "bg-orange-400 text-white",
        medium: "bg-yellow-400 text-black",
        low: "bg-green-400 text-black",
    };

    return (
        <span
            className={`text-xs px-2 py-1 rounded-full capitalize ${colors[priority]}`}
        >
            {priority}
        </span>
    );
}

function Avatar({ name }: any) {
    const initials = name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase();

    return (
        <div className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-300 text-xs font-medium">
            {initials}
        </div>
    );
}

function DragPreview() {
    const tasks = useTaskStore((s) => s.tasks);
    const draggingId = useTaskStore((s) => s.draggingTaskId);
    const cursor = useTaskStore((s) => s.cursor);

    if (!draggingId) return null;

    const task = tasks.find((t) => t.id === draggingId);
    if (!task) return null;

    return (
        <div
            className="fixed pointer-events-none z-50"
            style={{
                top: cursor.y + 5,
                left: cursor.x + 5,
            }}
        >
            <div className="w-56 opacity-80 shadow-xl bg-white p-3 rounded-md border">
                <div className="font-medium">{task.title}</div>
                <div className="flex items-center justify-between mt-2">
                    <Avatar name={task.assignee} />
                    <PriorityBadge priority={task.priority} />
                </div>
            </div>
        </div>
    );
}