import {
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";
import { useEffect, useState } from "react";

// AUTH SERVICE
import { getCurrentUser, loginUser } from "../services/authService";
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // =========================
  // INIT APP
  // =========================
 

  // =========================
  // AUTO LOGIN CHECK
  // =========================
  const checkLoggedIn = async () => {
    const user = await getCurrentUser();

    if (user?.username) {
      router.replace("/dashboard");
    }
  };

  // =========================
  // LOGIN HANDLER
  // =========================
  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const success = await loginUser(username, password);

    if (success) {
      Alert.alert("Success", "Login successful");

      router.replace("/dashboard");
    } else {
      Alert.alert("Error", "Wrong username or password");
    }
  };

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

          {/* USERNAME */}
          <TextInput
            placeholder="Enter username"
            placeholderTextColor="#ccc"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />

          {/* PASSWORD */}
          <TextInput
            placeholder="Enter password"
            placeholderTextColor="#ccc"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          {/* LOGIN BUTTON */}
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

/* ================= STYLES (UNCHANGED) ================= */

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  container: {
    width: "100%",
    maxWidth: 350,
    backgroundColor: "rgba(255,255,255,0.12)",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
  },

  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },

  subtitle: {
    color: "#ddd",
    textAlign: "center",
    marginBottom: 20,
  },

  input: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 14,
    borderRadius: 12,
    marginBottom: 15,
    color: "white",
  },

  button: {
    width: "100%",
    backgroundColor: "#e82777",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
