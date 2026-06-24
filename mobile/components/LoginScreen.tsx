import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { setItem } from "../lib/storage";
import { api } from "../lib/api";
import { registerForPushNotifications } from "../lib/notifications";

export default function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("admin@teamsync.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);

  async function login() {
    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const payload = response.data.data ?? response.data;

      await setItem("teamsync_access_token", payload.accessToken);
      await setItem("teamsync_refresh_token", payload.refreshToken);
      await setItem("teamsync_user", JSON.stringify(payload.user));

      await registerForPushNotifications();

      onLogin();
    } catch (error: any) {
      console.log("========== LOGIN ERROR ==========");
      console.log(error);
      console.log(error?.response);
      console.log(error?.response?.data);
      console.log(error?.message);

      Alert.alert(
        "Login failed",
        JSON.stringify(error?.response?.data ?? error?.message),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.card}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>TS</Text>
        </View>

        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>
          Sign in to view your assigned tasks.
        </Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
          placeholder="Email"
        />

        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          placeholder="Password"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={login}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign in</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  logoText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    fontSize: 15,
    color: "#6B7280",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 15,
  },
  button: {
    marginTop: 8,
    backgroundColor: "#2563EB",
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
});
