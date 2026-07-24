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

import {
  createDeviceApi,
  deleteDeviceApi,
  getDevices,
} from "../../services/api";

export default function ManageDevices() {
  const [devices, setDevices] = useState([]);
  const [deviceName, setDeviceName] = useState("");

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      const res = await getDevices();
      setDevices(res || []);
    } catch (error) {
      console.log("Load devices error:", error.response?.data || error.message);
    }
  };

  const handleAdd = async () => {
    if (!deviceName.trim()) {
      Alert.alert("Error", "Device name is required");
      return;
    }

    try {
      await createDeviceApi({
        name: deviceName,
         device_code: Date.now().toString(),
      });

      setDeviceName("");
      loadDevices();
      Alert.alert("Success", "Device added successfully");
    } catch (error) {
      console.log("Add device error:", error.response?.data || error.message);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to add device"
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDeviceApi(id);
      loadDevices();
      Alert.alert("Success", "Device deleted successfully");
    } catch (error) {
      console.log("Delete device error:", error.response?.data || error.message);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to delete device"
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => router.replace("/admin")}>
          <Text style={styles.arrow}>←</Text>
        </Pressable>

        <Text style={styles.title}>Manage Devices</Text>
      </View>

      {/* INPUT */}
      <TextInput
        placeholder="Device name"
        placeholderTextColor="#999"
        value={deviceName}
        onChangeText={setDeviceName}
        style={styles.input}
      />

      <Pressable style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Add Device</Text>
      </Pressable>

      {/* LIST */}
      <FlatList
        data={devices}
        keyExtractor={(item) => String(item._id)}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>
              {item.name} ({item.status})
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