import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { 
  Pressable, 
  ScrollView, 
  StyleSheet, 
  Text, 
  View, 
  RefreshControl,
  Dimensions 
} from "react-native";
import { getSensorReadings, getAlerts, getDevices } from "../services/api";

export default function Analytics() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalReadings: 0,
    totalAlerts: 0,
    totalDevices: 0,
    activeAlerts: 0,
    avgSmoke: 0,
    avgSound: 0,
    avgTemp: 0,
    maxSmoke: 0,
    maxSound: 0,
    alertTypes: {},
    deviceStats: [],
    recentActivity: []
  });

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      const [readings, alerts, devices] = await Promise.all([
        getSensorReadings(100),
        getAlerts(),
        getDevices()
      ]);

      const readingsData = readings || [];
      const alertsData = alerts || [];
      const devicesData = devices || [];

      // Calculate averages
      const avgSmoke = readingsData.reduce((sum, r) => sum + (r.smoke || 0), 0) / (readingsData.length || 1);
      const avgSound = readingsData.reduce((sum, r) => sum + (r.sound || 0), 0) / (readingsData.length || 1);
      const avgTemp = readingsData.reduce((sum, r) => sum + (r.temperature || 0), 0) / (readingsData.length || 1);
      const maxSmoke = Math.max(...readingsData.map(r => r.smoke || 0), 0);
      const maxSound = Math.max(...readingsData.map(r => r.sound || 0), 0);

      // Alert types breakdown
      const alertTypes = {};
      alertsData.forEach(alert => {
        const type = alert.type || 'unknown';
        alertTypes[type] = (alertTypes[type] || 0) + 1;
      });

      // Device statistics
      const deviceStats = {};
      readingsData.forEach(r => {
        if (!deviceStats[r.device_code]) {
          deviceStats[r.device_code] = { count: 0, avgSmoke: 0, avgSound: 0 };
        }
        deviceStats[r.device_code].count++;
      });

      setAnalytics({
        totalReadings: readingsData.length,
        totalAlerts: alertsData.length,
        totalDevices: devicesData.length,
        activeAlerts: alertsData.filter(a => a.status === 'active').length,
        avgSmoke: Math.round(avgSmoke * 10) / 10,
        avgSound: Math.round(avgSound * 10) / 10,
        avgTemp: Math.round(avgTemp * 10) / 10,
        maxSmoke,
        maxSound,
        alertTypes,
        deviceStats: Object.keys(deviceStats).slice(0, 10),
        recentActivity: readingsData.slice(0, 5)
      });

    } catch (error) {
      console.log("Analytics load error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
    const interval = setInterval(loadAnalytics, 15000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadAnalytics();
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.toggleDrawer()}>
          <Text style={styles.arrow}>←</Text>
        </Pressable>
        <Text style={styles.title}>Report / Analytics</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Summary Cards */}
        <View style={styles.summaryGrid}>
          <View style={[styles.summaryCard, styles.blue]}>
            <Text style={styles.summaryNumber}>{analytics.totalReadings}</Text>
            <Text style={styles.summaryLabel}>Total Readings</Text>
          </View>
          <View style={[styles.summaryCard, styles.red]}>
            <Text style={styles.summaryNumber}>{analytics.totalAlerts}</Text>
            <Text style={styles.summaryLabel}>Total Alerts</Text>
          </View>
          <View style={[styles.summaryCard, styles.green]}>
            <Text style={styles.summaryNumber}>{analytics.totalDevices}</Text>
            <Text style={styles.summaryLabel}>Devices</Text>
          </View>
          <View style={[styles.summaryCard, styles.yellow]}>
            <Text style={styles.summaryNumber}>{analytics.activeAlerts}</Text>
            <Text style={styles.summaryLabel}>Active Alerts</Text>
          </View>
        </View>

        {/* Sensor Averages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Sensor Averages</Text>
          <View style={styles.avgGrid}>
            <View style={styles.avgItem}>
              <Text style={styles.avgLabel}>🌫️ Smoke</Text>
              <Text style={styles.avgValue}>{analytics.avgSmoke}</Text>
            </View>
            <View style={styles.avgItem}>
              <Text style={styles.avgLabel}>🔊 Sound</Text>
              <Text style={styles.avgValue}>{analytics.avgSound}</Text>
            </View>
            <View style={styles.avgItem}>
              <Text style={styles.avgLabel}>🌡️ Temp</Text>
              <Text style={styles.avgValue}>{analytics.avgTemp}°C</Text>
            </View>
          </View>
        </View>

        {/* Max Values */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📈 Peak Values</Text>
          <View style={styles.peakGrid}>
            <View style={styles.peakItem}>
              <Text style={styles.peakLabel}>Max Smoke</Text>
              <Text style={[styles.peakValue, styles.danger]}>{analytics.maxSmoke}</Text>
            </View>
            <View style={styles.peakItem}>
              <Text style={styles.peakLabel}>Max Sound</Text>
              <Text style={[styles.peakValue, styles.warning]}>{analytics.maxSound}</Text>
            </View>
          </View>
        </View>

        {/* Alert Types Breakdown */}
        {Object.keys(analytics.alertTypes).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🚨 Alert Types</Text>
            {Object.entries(analytics.alertTypes).map(([type, count]) => (
              <View key={type} style={styles.alertTypeItem}>
                <Text style={styles.alertTypeLabel}>{type}</Text>
                <View style={styles.alertTypeBar}>
                  <View 
                    style={[
                      styles.alertTypeFill, 
                      { width: `${Math.min((count / analytics.totalAlerts) * 100, 100)}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.alertTypeCount}>{count}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🕐 Recent Activity</Text>
          {analytics.recentActivity.map((item, index) => (
            <View key={index} style={styles.activityItem}>
              <Text style={styles.activityDevice}>{item.device_code}</Text>
              <Text style={styles.activityData}>
                Smoke: {item.smoke} | Sound: {item.sound} | {item.temperature}°C
              </Text>
              <Text style={styles.activityTime}>
                {new Date(item.createdAt).toLocaleString()}
              </Text>
            </View>
          ))}
          {analytics.recentActivity.length === 0 && (
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
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  summaryCard: {
    width: "48%",
    padding: 15,
    borderRadius: 10,
    marginBottom: 8,
  },
  blue: { backgroundColor: "#3b82f6" },
  red: { backgroundColor: "#ef4444" },
  green: { backgroundColor: "#22c55e" },
  yellow: { backgroundColor: "#f59e0b" },
  summaryNumber: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  summaryLabel: {
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
  avgGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  avgItem: {
    alignItems: "center",
  },
  avgLabel: {
    color: "#94a3b8",
    fontSize: 12,
  },
  avgValue: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 4,
  },
  peakGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  peakItem: {
    alignItems: "center",
  },
  peakLabel: {
    color: "#94a3b8",
    fontSize: 12,
  },
  peakValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 4,
  },
  danger: { color: "#ef4444" },
  warning: { color: "#f59e0b" },
  alertTypeItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  alertTypeLabel: {
    color: "white",
    fontSize: 14,
    width: 100,
  },
  alertTypeBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#334155",
    borderRadius: 4,
    marginHorizontal: 10,
  },
  alertTypeFill: {
    height: 8,
    backgroundColor: "#ef4444",
    borderRadius: 4,
  },
  alertTypeCount: {
    color: "#94a3b8",
    fontSize: 14,
    width: 30,
    textAlign: "right",
  },
  activityItem: {
    backgroundColor: "#0f172a",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  activityDevice: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  activityData: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 4,
  },
  activityTime: {
    color: "#64748b",
    fontSize: 10,
    marginTop: 4,
  },
  noData: {
    color: "#64748b",
    textAlign: "center",
    padding: 15,
  },
});
