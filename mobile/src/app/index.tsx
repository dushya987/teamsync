import { useState } from "react";
import { Providers } from "../../components/Providers";
import LoginScreen from "../../components/LoginScreen";
import TaskDetailScreen from "../../components/TaskDetailScreen";
import TaskListScreen from "../../components/TaskListScreen";

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  return (
    <Providers>
      {!isLoggedIn ? (
        <LoginScreen onLogin={() => setIsLoggedIn(true)} />
      ) : selectedTaskId ? (
        <TaskDetailScreen
          taskId={selectedTaskId}
          onBack={() => setSelectedTaskId(null)}
        />
      ) : (
        <TaskListScreen onSelectTask={setSelectedTaskId} />
      )}
    </Providers>
  );
}
