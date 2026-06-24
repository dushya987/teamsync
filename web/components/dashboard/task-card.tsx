"use client";

import { Badge } from "@/components/ui/badge";
import { CalendarDays, User } from "lucide-react";

function badgeVariant(value: string) {
  if (value === "DONE") return "success";
  if (value === "IN_PROGRESS" || value === "MEDIUM") return "warning";
  if (value === "HIGH") return "danger";
  if (value === "TODO") return "default";
  return "default";
}

function statusLabel(status: string) {
  return status.replace("_", " ");
}

interface Props {
  task: any;
  onClick: () => void;
}

export function TaskCard({ task, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="w-full cursor-pointer rounded-[8px] border border-gray-200 bg-white p-5 text-left shadow-sm transition-colors duration-150 hover:border-[#2563EB] hover:bg-blue-50/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
    >
      <div className="flex flex-col justify-between gap-3 md:flex-row">
        <div>
          <h3 className="text-[17px] font-semibold text-gray-900">
            {task.title}
          </h3>

          <p className="mt-1 line-clamp-2 text-[15px] text-gray-500">
            {task.description || "No description provided."}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant={badgeVariant(task.status) as any}>
            {statusLabel(task.status)}
          </Badge>

          <Badge variant={badgeVariant(task.priority) as any}>
            {task.priority}
          </Badge>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-[13px] text-gray-500">
        <span className="inline-flex items-center gap-1.5">
          <User size={14} />
          {task.assignee?.name ?? "Unassigned"}
        </span>

        <span className="inline-flex items-center gap-1.5">
          <CalendarDays size={14} />
          {task.dueDate
            ? new Date(task.dueDate).toLocaleDateString()
            : "No due date"}
        </span>
      </div>
    </button>
  );
}
