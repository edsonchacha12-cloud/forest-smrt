import {
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import { loginUser, initAuthService } from "../services/authService";
import { initConfig } from "../services/config";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // =========================
  // INIT APP - Get correct IP
  // =========================
  useEffect(() => {
    const initApp = async () => {
      console.log("🚀 Initializing app...");
      await initConfig();
      await initAuthService();
      setInitializing(false);
      console.log("✅ App initialized");
    };
    initApp();
  }, []);

  // =========================
  // LOGIN HANDLER
  // =========================
  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const success = await loginUser(username, password);
      if (success) {
        Alert.alert("Success", "Login successful");
        router.replace("/dashboard");
      } else {
        Alert.alert("Error", "Wrong username or password");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' }}>
        <ActivityIndicator size="large" color="#ff7a00" />
        <Text style={{ color: 'white', marginTop: 10 }}>Connecting...</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../assets/images/bg.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>
            Monitoring and Detecting Illegal Logging App
          </Text>

          <Text style={styles.subtitle}>
            Enter your credentials to continue
          </Text>

          <TextInput
            placeholder="Enter username"
            placeholderTextColor="#ccc"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            editable={!loading}
          />

          <TextInput
            placeholder="Enter password"
            placeholderTextColor="#ccc"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            editable={!loading}
          />

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Sign In</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)", justifyContent: "center", alignItems: "center", padding: 20 },
  container: { width: "100%", maxWidth: 350, backgroundColor: "rgba(255,255,255,0.12)", padding: 25, borderRadius: 20, alignItems: "center" },
  title: { color: "white", fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  subtitle: { color: "#ddd", textAlign: "center", marginBottom: 20 },
  input: { width: "100%", backgroundColor: "rgba(255,255,255,0.2)", padding: 14, borderRadius: 12, marginBottom: 15, color: "white" },
  button: { width: "100%", backgroundColor: "#e82777", padding: 15, borderRadius: 12, alignItems: "center" },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
