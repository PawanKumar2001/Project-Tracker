import type { Task, Status, Priority } from "../types/task.ts";
import { users } from "./users";

const statuses: Status[] = ["todo", "inprogress", "inreview", "done"];
const priorities: Priority[] = ["critical", "high", "medium", "low"];

const randomItem = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

const randomDate = (start: Date, end: Date) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

export const generateTasks = (count: number = 500): Task[] => {
  const tasks: Task[] = [];

  for (let i = 0; i < count; i++) {
    const start = randomDate(new Date(2026, 2, 1), new Date(2026, 2, 20));
    const due = randomDate(start, new Date(2026, 2, 31));

    const hasStartDate = Math.random() > 0.2;

    tasks.push({
      id: crypto.randomUUID(),
      title: `Task ${i + 1}`,
      status: randomItem(statuses),
      priority: randomItem(priorities),
      assignee: randomItem(users),
      startDate: hasStartDate ? start.toISOString() : undefined,
      dueDate: due.toISOString(),
    });
  }

  return tasks;
};