"use client";

import { AuthGuard } from "@/components/auth-guard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Calendar, MessageCircle, Send, User } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

function badgeVariant(value: string) {
  if (value === "DONE") return "success";
  if (value === "IN_PROGRESS" || value === "MEDIUM") return "warning";
  if (value === "HIGH") return "danger";
  return "default";
}

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const taskId = params.id as string;

  const [comment, setComment] = useState("");

  const taskQuery = useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const response = await api.get(`/tasks/${taskId}`);
      return response.data;
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(`/tasks/${taskId}/comments`, {
        body: comment,
      });
      return response.data;
    },
    onSuccess: () => {
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      const response = await api.patch(`/tasks/${taskId}`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const task = taskQuery.data;

  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#F9FAFB] px-4 py-6 md:px-6">
        <section className="mx-auto max-w-5xl">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="mb-5 px-0"
          >
            <ArrowLeft size={16} />
            Back to dashboard
          </Button>

          {taskQuery.isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-32" />
              <Skeleton className="h-64" />
              <Skeleton className="h-48" />
            </div>
          )}

          {taskQuery.error && (
            <ErrorState message="Unable to load this task." />
          )}

          {task && (
            <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
              <section className="space-y-6">
                <Card className="p-6">
                  <h1 className="text-[28px] font-bold text-gray-900">
                    {task.title}
                  </h1>

                  <p className="mt-2 text-[15px] leading-6 text-gray-500">
                    {task.description || "No description provided."}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Badge variant={badgeVariant(task.status) as any}>
                      {task.status.replace("_", " ")}
                    </Badge>

                    <Badge variant={badgeVariant(task.priority) as any}>
                      {task.priority}
                    </Badge>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="mb-5 flex items-center gap-2">
                    <MessageCircle size={18} className="text-[#2563EB]" />
                    <h2 className="text-[22px] font-semibold text-gray-900">
                      Comments
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {task.comments?.length === 0 && (
                      <div className="rounded-[8px] border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
                        <p className="text-[15px] font-medium text-gray-700">
                          No comments yet
                        </p>
                        <p className="mt-1 text-[13px] text-gray-500">
                          Be the first team member to start the discussion.
                        </p>
                      </div>
                    )}

                    {task.comments?.map((item: any) => (
                      <div
                        key={item.id}
                        className="rounded-[8px] border border-gray-100 bg-gray-50 p-4"
                      >
                        <div className="mb-1 flex items-center justify-between gap-3">
                          <p className="font-medium text-gray-900">
                            {item.author?.name}
                          </p>

                          <p className="text-[13px] text-gray-400">
                            {new Date(item.createdAt).toLocaleString()}
                          </p>
                        </div>

                        <p className="text-[15px] text-gray-600">{item.body}</p>
                      </div>
                    ))}
                  </div>

                  <form
                    onSubmit={(event) => {
                      event.preventDefault();

                      if (!comment.trim()) {
                        return;
                      }

                      addCommentMutation.mutate();
                    }}
                    className="mt-5 flex flex-col gap-3 sm:flex-row"
                  >
                    <input
                      value={comment}
                      onChange={(event) => setComment(event.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 rounded-[6px] border border-gray-300 px-3 py-2.5 text-[15px] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                    />

                    <Button disabled={addCommentMutation.isPending}>
                      <Send size={16} />
                      Send
                    </Button>
                  </form>
                </Card>
              </section>

              <aside className="space-y-6">
                <Card className="p-5">
                  <h2 className="text-[22px] font-semibold text-gray-900">
                    Task info
                  </h2>

                  <div className="mt-5 space-y-4">
                    <div className="flex items-start gap-3">
                      <User size={18} className="mt-0.5 text-gray-400" />

                      <div>
                        <p className="text-[13px] text-gray-500">Assignee</p>
                        <p className="font-medium text-gray-900">
                          {task.assignee?.name || "Unassigned"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar size={18} className="mt-0.5 text-gray-400" />

                      <div>
                        <p className="text-[13px] text-gray-500">Due date</p>
                        <p className="font-medium text-gray-900">
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString()
                            : "No due date"}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-5">
                  <h2 className="text-[22px] font-semibold text-gray-900">
                    Update status
                  </h2>

                  <select
                    value={task.status}
                    onChange={(event) =>
                      updateStatusMutation.mutate(event.target.value)
                    }
                    className="mt-4 h-[40px] w-full cursor-pointer rounded-[6px] border border-gray-300 bg-white px-3 text-[15px] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="TODO">TODO</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="DONE">DONE</option>
                  </select>

                  <p className="mt-3 text-[13px] text-gray-500">
                    Updates are saved immediately and synced to the backend.
                  </p>
                </Card>
              </aside>
            </div>
          )}
        </section>
      </main>
    </AuthGuard>
  );
}
