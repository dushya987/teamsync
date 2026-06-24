import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { api } from "../lib/api";
import { ArrowLeft } from "lucide-react-native";

export default function TaskDetailScreen({
  taskId,
  onBack,
}: {
  taskId: string;
  onBack: () => void;
}) {
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");

  const taskQuery = useQuery({
    queryKey: ["mobile-task", taskId],
    queryFn: async () => {
      const response = await api.get(`/tasks/${taskId}`);
      return response.data;
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: async (commentBody: string) => {
      const response = await api.post(`/tasks/${taskId}/comments`, {
        body: commentBody,
      });

      return response.data;
    },

    onMutate: async (commentBody: string) => {
      await queryClient.cancelQueries({ queryKey: ["mobile-task", taskId] });

      const previousTask = queryClient.getQueryData(["mobile-task", taskId]);

      queryClient.setQueryData(["mobile-task", taskId], (oldTask: any) => {
        if (!oldTask) return oldTask;

        return {
          ...oldTask,
          comments: [
            ...(oldTask.comments ?? []),
            {
              id: `temp-${Date.now()}`,
              body: commentBody,
              createdAt: new Date().toISOString(),
              author: {
                name: "You",
              },
            },
          ],
        };
      });

      setComment("");

      return { previousTask };
    },

    onError: (_error, _commentBody, context) => {
      queryClient.setQueryData(["mobile-task", taskId], context?.previousTask);
      Alert.alert("Comment failed", "Your comment could not be saved.");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["mobile-task", taskId] });
    },
  });

  const task = taskQuery.data;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={18} color="#2563EB" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        {taskQuery.isLoading && <ActivityIndicator color="#2563EB" />}

        {taskQuery.error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>Could not load task.</Text>
          </View>
        )}

        {task && (
          <>
            <View style={styles.card}>
              <Text style={styles.title}>{task.title}</Text>
              <Text style={styles.description}>
                {task.description || "No description provided."}
              </Text>

              <View style={styles.badgeRow}>
                <Text style={styles.statusBadge}>
                  {task.status.replace("_", " ")}
                </Text>
                <Text style={styles.priorityBadge}>{task.priority}</Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Task Info</Text>
              <Text style={styles.infoText}>
                Assignee: {task.assignee?.name ?? "Unassigned"}
              </Text>
              <Text style={styles.infoText}>
                Due:{" "}
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "No due date"}
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Comments</Text>

              {task.comments?.length === 0 && (
                <Text style={styles.emptyText}>No comments yet.</Text>
              )}

              {task.comments?.map((item: any) => (
                <View key={item.id} style={styles.commentCard}>
                  <Text style={styles.commentAuthor}>{item.author?.name}</Text>
                  <Text style={styles.commentBody}>{item.body}</Text>
                </View>
              ))}

              <TextInput
                value={comment}
                onChangeText={setComment}
                placeholder="Add a comment..."
                style={styles.input}
              />

              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  if (!comment.trim()) {
                    Alert.alert("Comment required", "Please enter a comment.");
                    return;
                  }

                  addCommentMutation.mutate(comment);
                }}
              >
                <Text style={styles.buttonText}>
                  {addCommentMutation.isPending ? "Sending..." : "Send Comment"}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  container: {
    padding: 16,
    gap: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 6,
    marginBottom: 12,
  },

  backText: {
    color: "#2563EB",
    fontSize: 15,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },
  description: {
    marginTop: 8,
    fontSize: 15,
    color: "#6B7280",
    lineHeight: 22,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  statusBadge: {
    minWidth: 110,
    textAlign: "center",
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#EFF6FF",
    color: "#2563EB",
    fontSize: 13,
    fontWeight: "700",
  },
  priorityBadge: {
    minWidth: 110,
    textAlign: "center",
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#FEF2F2",
    color: "#DC2626",
    fontSize: 13,
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 15,
    color: "#374151",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: "#6B7280",
  },
  commentCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
    marginBottom: 10,
  },
  commentAuthor: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  commentBody: {
    fontSize: 15,
    color: "#4B5563",
  },
  input: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
  },
  button: {
    marginTop: 12,
    backgroundColor: "#2563EB",
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
  errorBox: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  errorText: {
    color: "#DC2626",
  },
});
