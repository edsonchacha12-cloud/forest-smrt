import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import { getDevices, getLatestSensorData } from "../services/api";

export default function Devices() {
  const navigation = useNavigation();
  const [devices, setDevices] = useState([]);
  const [sensorData, setSensorData] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDevices = async () => {
    try {
      setLoading(true);
      const deviceList = await getDevices();
      setDevices(deviceList || []);

      const sensorMap = {};
      if (deviceList && deviceList.length > 0) {
        for (const device of deviceList) {
          const latest = await getLatestSensorData(device.device_code);
          if (latest) {
            sensorMap[device.device_code] = latest;
          }
        }
      }
      setSensorData(sensorMap);
    } catch (error) {
      console.log("Error loading devices:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDevices();
    const interval = setInterval(loadDevices, 5000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadDevices();
  };

  const getStatus = (deviceCode) => {
    const data = sensorData[deviceCode];
    if (!data) return { label: 'No Data', color: '#64748b' };
    if (data.smoke > 70 || data.sound > 80) return { label: '🔴 Alert', color: '#ef4444' };
    if (data.smoke > 30 || data.sound > 40) return { label: '🟡 Warning', color: '#f59e0b' };
    return { label: '🟢 Safe', color: '#22c55e' };
  };

  if (loading && devices.length === 0) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#ff7a00" />
        <Text style={styles.loadingText}>Loading devices...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.toggleDrawer()}>
          <Text style={styles.arrow}>←</Text>
        </Pressable>
        <Text style={styles.title}>Devices</Text>
        <Text style={styles.deviceCount}>{devices.length}</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {devices.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No devices registered</Text>
          </View>
        ) : (
          devices.map((device) => {
            const status = getStatus(device.device_code);
            const data = sensorData[device.device_code];
            
            return (
              <TouchableOpacity 
                key={device.id} 
                style={[styles.card, { borderLeftColor: status.color, borderLeftWidth: 4 }]}
                onPress={() => navigation.navigate('Map')}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.deviceName}>{device.name || device.device_code}</Text>
                  <Text style={styles.statusBadge}>{status.label}</Text>
                </View>

                <Text style={styles.deviceCode}>Code: {device.device_code}</Text>

                {data ? (
                  <View style={styles.sensorGrid}>
                    <View style={styles.sensorItem}>
                      <Text style={styles.sensorLabel}>🌫️ Smoke</Text>
                      <Text style={[styles.sensorValue, data.smoke > 70 && styles.danger]}>
                        {data.smoke}
                      </Text>
                    </View>
                    <View style={styles.sensorItem}>
                      <Text style={styles.sensorLabel}>🔊 Sound</Text>
                      <Text style={[styles.sensorValue, data.sound > 80 && styles.danger]}>
                        {data.sound}
                      </Text>
                    </View>
                    <View style={styles.sensorItem}>
                      <Text style={styles.sensorLabel}>🌡️ Temp</Text>
                      <Text style={styles.sensorValue}>{data.temperature}°C</Text>
                    </View>
                  </View>
                ) : (
                  <Text style={styles.noData}>No sensor data yet</Text>
                )}

                <Text style={styles.lastSeen}>
                  Last seen: {device.last_seen ? new Date(device.last_seen).toLocaleString() : 'Never'}
                </Text>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    paddingHorizontal: 15,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "white",
    marginTop: 12,
    fontSize: 16,
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
    flex: 1,
  },
  deviceCount: {
    color: "#94a3b8",
    fontSize: 16,
    backgroundColor: "#1e293b",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  deviceName: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  statusBadge: {
    fontSize: 14,
    fontWeight: "bold",
  },
  deviceCode: {
    color: "#94a3b8",
    fontSize: 14,
    marginBottom: 10,
  },
  sensorGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#0f172a",
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
  },
  sensorItem: {
    alignItems: "center",
  },
  sensorLabel: {
    color: "#94a3b8",
    fontSize: 11,
  },
  sensorValue: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 4,
  },
  danger: {
    color: "#ef4444",
  },
  noData: {
    color: "#64748b",
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    padding: 8,
  },
  lastSeen: {
    color: "#64748b",
    fontSize: 11,
    marginTop: 8,
    textAlign: "center",
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
  },
  emptyStateText: {
    color: "#64748b",
    fontSize: 16,
  },
});
