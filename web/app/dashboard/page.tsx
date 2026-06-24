"use client";

import { AuthGuard } from "@/components/auth-guard";
import { ProjectSidebar } from "@/components/dashboard/project-sidebar";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { TaskCard } from "@/components/dashboard/task-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { LogOut, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const statusOptions = ["ALL", "TODO", "IN_PROGRESS", "DONE"];
const priorityOptions = ["ALL", "LOW", "MEDIUM", "HIGH"];

function statusLabel(status: string) {
  return status.replace("_", " ");
}

export default function DashboardPage() {
  const router = useRouter();

  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [status, setStatus] = useState("ALL");
  const [priority, setPriority] = useState("ALL");
  const [assigneeId, setAssigneeId] = useState("ALL");

  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await api.get("/projects");
      return response.data;
    },
  });

  const projects = projectsQuery.data ?? [];

  const selectedProject =
    projects.find((project: any) => project.id === selectedProjectId) ??
    projects[0];

  const tasksQuery = useQuery({
    queryKey: ["tasks", selectedProject?.id, status, priority, assigneeId],
    enabled: Boolean(selectedProject?.id),
    queryFn: async () => {
      const params = new URLSearchParams();

      if (status !== "ALL") params.set("status", status);
      if (priority !== "ALL") params.set("priority", priority);
      if (assigneeId !== "ALL") params.set("assigneeId", assigneeId);

      params.set("page", "1");
      params.set("limit", "20");

      const response = await api.get(
        `/projects/${selectedProject.id}/tasks?${params.toString()}`,
      );

      return response.data;
    },
  });

  const tasks = tasksQuery.data?.items ?? [];

  const doneCount = tasks.filter((task: any) => task.status === "DONE").length;

  const activeCount = tasks.filter(
    (task: any) => task.status !== "DONE",
  ).length;

  const highPriorityCount = tasks.filter(
    (task: any) => task.priority === "HIGH",
  ).length;

  function logout() {
    localStorage.clear();
    router.push("/login");
  }

  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#F9FAFB]">
        <div className="mx-auto grid max-w-[1280px] gap-6 px-4 py-6 md:grid-cols-[260px_1fr] md:px-6">
          <ProjectSidebar
            projects={projects}
            selectedProject={selectedProject}
            onSelect={(projectId) => {
              setSelectedProjectId(projectId);
              setStatus("ALL");
              setPriority("ALL");
              setAssigneeId("ALL");
            }}
          />

          <section>
            <header className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h1 className="text-[28px] font-bold text-gray-900">
                  Dashboard
                </h1>

                <p className="text-[15px] text-gray-500">
                  Track project progress, workload, and task status.
                </p>
              </div>

              <Button variant="secondary" onClick={logout}>
                <LogOut size={16} />
                Logout
              </Button>
            </header>

            <StatsCards
              activeCount={activeCount}
              doneCount={doneCount}
              highPriorityCount={highPriorityCount}
            />

            <Card className="mb-6 p-5">
              <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
                <div>
                  <h2 className="text-[22px] font-semibold text-gray-900">
                    {selectedProject?.name ?? "No project selected"}
                  </h2>

                  <p className="mt-1 text-[15px] text-gray-500">
                    {selectedProject?.description ??
                      "Select a project to view tasks."}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex h-[40px] items-center gap-2 rounded-[6px] border border-gray-300 bg-white px-3">
                    <Search size={15} className="text-gray-400" />
                    <span className="text-[13px] text-gray-400">Filters</span>
                  </div>

                  <select
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    className="h-[40px] cursor-pointer rounded-[6px] border border-gray-300 bg-white px-3 text-[13px] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                  >
                    {statusOptions.map((item) => (
                      <option key={item} value={item}>
                        {item === "ALL" ? "All statuses" : statusLabel(item)}
                      </option>
                    ))}
                  </select>

                  <select
                    value={priority}
                    onChange={(event) => setPriority(event.target.value)}
                    className="h-[40px] cursor-pointer rounded-[6px] border border-gray-300 bg-white px-3 text-[13px] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                  >
                    {priorityOptions.map((item) => (
                      <option key={item} value={item}>
                        {item === "ALL" ? "All priorities" : item}
                      </option>
                    ))}
                  </select>

                  <select
                    value={assigneeId}
                    onChange={(event) => setAssigneeId(event.target.value)}
                    className="h-[40px] cursor-pointer rounded-[6px] border border-gray-300 bg-white px-3 text-[13px] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="ALL">All assignees</option>

                    {selectedProject?.members?.map((member: any) => (
                      <option key={member.user.id} value={member.user.id}>
                        {member.user.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>

            {tasksQuery.isLoading && (
              <div className="grid gap-4">
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
              </div>
            )}

            {tasksQuery.error && <ErrorState message="Could not load tasks." />}

            {!tasksQuery.isLoading && tasks.length === 0 && (
              <EmptyState
                title="No tasks found"
                description="Try changing the filters or select another project."
              />
            )}

            <div className="grid gap-4">
              {tasks.map((task: any) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => router.push(`/tasks/${task.id}`)}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </AuthGuard>
  );
}
