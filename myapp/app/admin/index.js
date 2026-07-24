import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  TouchableOpacity
} from "react-native";
import { getDevices, getUsers, getAlerts, getSensorReadings } from "../../services/api";

export default function AdminPanel() {
  const navigation = useNavigation();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDevices: 0,
    totalAlerts: 0,
    totalReadings: 0,
    activeAlerts: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadAdminData = async () => {
    try {
      const [users, devices, alerts, readings] = await Promise.all([
        getUsers(),
        getDevices(),
        getAlerts(),
        getSensorReadings(20)
      ]);

      setStats({
        totalUsers: users?.length || 0,
        totalDevices: devices?.length || 0,
        totalAlerts: alerts?.length || 0,
        totalReadings: readings?.length || 0,
        activeAlerts: alerts?.filter(a => a.status === 'active').length || 0
      });

      setRecentActivity(readings?.slice(0, 5) || []);
    } catch (error) {
      console.log("Admin load error:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAdminData();
    const interval = setInterval(loadAdminData, 10000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadAdminData();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.toggleDrawer()}>
          <Text style={styles.arrow}>←</Text>
        </Pressable>
        <Text style={styles.title}>Admin Panel</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <TouchableOpacity 
            style={[styles.statCard, styles.blue]}
            onPress={() => navigation.navigate('admin/manage-users')}
          >
            <Text style={styles.statNumber}>{stats.totalUsers}</Text>
            <Text style={styles.statLabel}>Users</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.statCard, styles.green]}
            onPress={() => navigation.navigate('admin/manage-devices')}
          >
            <Text style={styles.statNumber}>{stats.totalDevices}</Text>
            <Text style={styles.statLabel}>Devices</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.statCard, styles.red]}
            onPress={() => navigation.navigate('alerts')}
          >
            <Text style={styles.statNumber}>{stats.activeAlerts}</Text>
            <Text style={styles.statLabel}>Active Alerts</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.statCard, styles.yellow]}
            onPress={() => navigation.navigate('analytics')}
          >
            <Text style={styles.statNumber}>{stats.totalReadings}</Text>
            <Text style={styles.statLabel}>Readings</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('admin/manage-users')}
            >
              <Text style={styles.actionIcon}>👤</Text>
              <Text style={styles.actionLabel}>Manage Users</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('admin/manage-devices')}
            >
              <Text style={styles.actionIcon}>📟</Text>
              <Text style={styles.actionLabel}>Manage Devices</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('alerts')}
            >
              <Text style={styles.actionIcon}>🚨</Text>
              <Text style={styles.actionLabel}>View Alerts</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('analytics')}
            >
              <Text style={styles.actionIcon}>📊</Text>
              <Text style={styles.actionLabel}>Analytics</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {recentActivity.map((item, index) => (
            <View key={index} style={styles.activityItem}>
              <Text style={styles.activityDevice}>{item.device_code}</Text>
              <View style={styles.activityData}>
                <Text style={styles.activityText}>
                  Smoke: {item.smoke} | Sound: {item.sound}
                </Text>
                <Text style={styles.activityTime}>
                  {new Date(item.createdAt).toLocaleString()}
                </Text>
              </View>
            </View>
          ))}
          {recentActivity.length === 0 && (
            <Text style={styles.noData}>No recent activity</Text>
          )}
        </View>
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
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  statCard: {
    width: "48%",
    padding: 15,
    borderRadius: 10,
    marginBottom: 8,
  },
  blue: { backgroundColor: "#3b82f6" },
  green: { backgroundColor: "#22c55e" },
  red: { backgroundColor: "#ef4444" },
  yellow: { backgroundColor: "#f59e0b" },
  statNumber: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
  statLabel: {
    color: "white",
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionButton: {
    width: "48%",
    backgroundColor: "#0f172a",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginBottom: 8,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  actionLabel: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f172a",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  activityDevice: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    width: 100,
  },
  activityData: {
    flex: 1,
  },
  activityText: {
    color: "#94a3b8",
    fontSize: 12,
  },
  activityTime: {
    color: "#64748b",
    fontSize: 10,
    marginTop: 2,
  },
  noData: {
    color: "#64748b",
    textAlign: "center",
    padding: 15,
  },
});
