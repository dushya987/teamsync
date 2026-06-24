import AsyncStorage from "@react-native-async-storage/async-storage";

const TASK_CACHE_KEY = "teamsync_cached_tasks";

export async function saveCachedTasks(tasks: any[]) {
  await AsyncStorage.setItem(TASK_CACHE_KEY, JSON.stringify(tasks));
}

export async function getCachedTasks() {
  const value = await AsyncStorage.getItem(TASK_CACHE_KEY);

  if (!value) {
    return [];
  }

  return JSON.parse(value);
}
