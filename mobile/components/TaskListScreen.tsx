import { useQuery } from "@tanstack/react-query";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { api } from "../lib/api";
import { getCachedTasks, saveCachedTasks } from "../storage/task-cache";
import { useState } from "react";

export default function TaskListScreen({
  onSelectTask,
}: {
  onSelectTask: (taskId: string) => void;
}) {
  const [showingCachedData, setShowingCachedData] = useState(false);

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["mobile-tasks"],
    queryFn: async () => {
      try {
        setShowingCachedData(false);

        const projectsResponse = await api.get("/projects");
        const projects = projectsResponse.data;

        const firstProject = projects[0];

        if (!firstProject) {
          return [];
        }

        const tasksResponse = await api.get(
          `/projects/${firstProject.id}/tasks?page=1&limit=20`,
        );

        const tasks = tasksResponse.data.items;

        await saveCachedTasks(tasks);

        return tasks;
      } catch {
        const cachedTasks = await getCachedTasks();
        setShowingCachedData(true);
        return cachedTasks;
      }
    },
  });

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>My Tasks</Text>
        <Text style={styles.subtitle}>Assigned work from TeamSync</Text>
      </View>

      {showingCachedData && (
        <View style={styles.cacheBanner}>
          <Text style={styles.cacheBannerText}>
            Showing cached data. Pull to refresh when back online.
          </Text>
        </View>
      )}

      {isLoading && <ActivityIndicator color="#2563EB" />}

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>Could not load tasks.</Text>
        </View>
      )}

      <FlatList
        data={data ?? []}
        keyExtractor={(item) => item.id}
        refreshing={isRefetching}
        onRefresh={refetch}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => onSelectTask(item.id)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text style={styles.priority}>{item.priority}</Text>
            </View>

            <Text style={styles.description}>{item.description}</Text>

            <View style={styles.metaRow}>
              <Text style={styles.status}>{item.status.replace("_", " ")}</Text>
              <Text style={styles.assignee}>
                {item.assignee?.name ?? "Unassigned"}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    padding: 24,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 15,
    color: "#6B7280",
  },
  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  taskTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  priority: {
    fontSize: 13,
    color: "#DC2626",
    fontWeight: "700",
  },
  description: {
    marginTop: 8,
    fontSize: 15,
    color: "#6B7280",
  },
  metaRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  status: {
    fontSize: 13,
    color: "#2563EB",
    fontWeight: "600",
  },
  assignee: {
    fontSize: 13,
    color: "#6B7280",
  },
  errorBox: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  errorText: {
    color: "#DC2626",
  },
  cacheBanner: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FDE68A",
  },

  cacheBannerText: {
    color: "#D97706",
    fontSize: 13,
    fontWeight: "600",
  },
});
