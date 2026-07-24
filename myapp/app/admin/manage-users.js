import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { createUserApi, deleteUserApi, getUsers } from "../../services/api";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res || []);
    } catch (error) {
      console.log("Load users error:", error.response?.data || error.message);
    }
  };

  const handleAdd = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Error", "Username and password are required");
      return;
    }

    try {
      await createUserApi({
        username,
        password,
        role: "officer",
      });

      setUsername("");
      setPassword("");
      loadUsers();
      Alert.alert("Success", "User added successfully");
    } catch (error) {
      console.log("Add user error:", error.response?.data || error.message);
      Alert.alert("Error", error.response?.data?.message || "Failed to add user");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUserApi(id);
      loadUsers();
      Alert.alert("Success", "User deleted successfully");
    } catch (error) {
      console.log("Delete user error:", error.response?.data || error.message);
      Alert.alert("Error", error.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => router.replace("/admin")}>
          <Text style={styles.arrow}>←</Text>
        </Pressable>

        <Text style={styles.title}>Manage Users</Text>
      </View>

      {/* INPUTS */}
      <TextInput
        placeholder="Username"
        placeholderTextColor="#999"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Pressable style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Add User</Text>
      </Pressable>

      {/* LIST */}
      <FlatList
        data={users}
        keyExtractor={(item) => String(item._id)}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>
              {item.username} ({item.role})
            </Text>

            <Pressable onPress={() => handleDelete(item._id)}>
             
              <Text style={styles.delete}>Delete</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#0f172a" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
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

  input: {
    backgroundColor: "#1e293b",
    padding: 12,
    color: "white",
    marginBottom: 10,
  },

  button: {
    backgroundColor: "#ff7a00",
    padding: 12,
    marginBottom: 20,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
  },

  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#1e293b",
    marginBottom: 10,
  },

  itemText: { color: "white" },

  delete: { color: "red" },
});