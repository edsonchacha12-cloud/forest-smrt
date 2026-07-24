import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";

import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

// AUTH SERVICE
import { updatePassword, updateUsername } from "../services/authService";

export default function Settings() {
  const navigation = useNavigation();

  // settings states
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const [username, setUsername] = useState("");

  // password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  // LOAD SETTINGS
  const loadSettings = async () => {
    try {
      const notif = await AsyncStorage.getItem("notificationsEnabled");
      const sound = await AsyncStorage.getItem("soundEnabled");
      const theme = await AsyncStorage.getItem("darkMode");

      if (notif !== null) setNotificationsEnabled(JSON.parse(notif));
      if (sound !== null) setSoundEnabled(JSON.parse(sound));
      if (theme !== null) setDarkMode(JSON.parse(theme));
    } catch (error) {
      console.log(error);
    }
  };

  // SAVE SETTING
  const saveSetting = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  };

  // PASSWORD CHANGE FUNCTION
  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    const success = await updatePassword(currentPassword, newPassword);

    if (success) {
      Alert.alert("Success", "Password updated successfully");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      Alert.alert("Error", "Failed to update password");
    }
  };

  const handleUsernameChange = async () => {
    if (!username.trim()) {
      Alert.alert("Error", "Username cannot be empty");
      return;
    }

    // USERNAME CHANGE FUNCTION
    const success = await updateUsername(username);

    if (success) {
      Alert.alert("Success", "Username updated successfully");

      setUsername("");
    } else {
      Alert.alert("Error", "Failed to update username");
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.toggleDrawer()}>
          <Text style={styles.arrow}>←</Text>
        </Pressable>

        <Text style={styles.title}>Settings</Text>
      </View>

      {/* NOTIFICATIONS */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Notification Settings</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Enable Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={(value) => {
              setNotificationsEnabled(value);
              saveSetting("notificationsEnabled", value);
            }}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Sound Alert</Text>
          <Switch
            value={soundEnabled}
            onValueChange={(value) => {
              setSoundEnabled(value);
              saveSetting("soundEnabled", value);
            }}
          />
        </View>
      </View>

      {/* THEME */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Theme Appearance</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={(value) => {
              setDarkMode(value);
              saveSetting("darkMode", value);
            }}
          />
        </View>
      </View>

      {/* USERNAME */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Username Settings</Text>

        <TextInput
          placeholder="Enter new username"
          placeholderTextColor="#888"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <Pressable style={styles.button} onPress={handleUsernameChange}>
          <Text style={styles.buttonText}>Update Username</Text>
        </Pressable>
      </View>

      {/* PASSWORD */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Password Settings</Text>

        <TextInput
          placeholder="Current Password"
          placeholderTextColor="#888"
          secureTextEntry
          style={styles.input}
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />

        <TextInput
          placeholder="New Password"
          placeholderTextColor="#888"
          secureTextEntry
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor="#888"
          secureTextEntry
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <Pressable style={styles.button} onPress={handlePasswordChange}>
          <Text style={styles.buttonText}>Update Password</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1b1b1b",
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 20,
  },

  arrow: {
    color: "white",
    fontSize: 30,
    marginRight: 15,
  },

  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
  },

  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  label: {
    color: "white",
    fontSize: 15,
  },

  input: {
    backgroundColor: "#111827",
    color: "white",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },

  button: {
    backgroundColor: "#ff7a00",
    padding: 14,
    borderRadius: 10,
    marginTop: 5,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
