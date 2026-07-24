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
import { getAlerts, getDevices, getSensorSummary } from "../services/api";
import { listenNewAlerts } from "../services/socket";
import ImageSlider from "../components/ImageSlider";

export default function Dashboard() {
  const [alerts, setAlerts] = useState([]);
  const [devices, setDevices] = useState([]);
  const [stats, setStats] = useState({
    totalDevices: 0,
    onlineDevices: 0,
    activeAlerts: 0,
    criticalAlerts: 0,
    lastUpdate: 'No data yet'
  });
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const loadData = async () => {
    try {
      const [a, d, summary] = await Promise.all([
        getAlerts(),
        getDevices(),
        getSensorSummary()
      ]);

      const alertsData = a || [];
      const devicesData = d || [];
      
      setAlerts(alertsData);
      setDevices(devicesData);
      
      // Calculate stats
      const activeAlerts = alertsData.filter(alert => alert.status === 'active').length;
      const criticalAlerts = alertsData.filter(alert => alert.severity === 'critical' && alert.status === 'active').length;
      const onlineDevices = devicesData.filter(device => device.status === 'online').length;
      
      setStats({
        totalDevices: devicesData.length,
        onlineDevices: onlineDevices,
        activeAlerts: activeAlerts,
        criticalAlerts: criticalAlerts,
        lastUpdate: new Date().toLocaleTimeString()
      });
      
    } catch (error) {
      console.log("Dashboard load error:", error);
    }
  };

  useEffect(() => {
    loadData();

    listenNewAlerts((data) => {
      setAlerts(prev => [data, ...prev]);
      // Update stats when new alert arrives
      loadData();
    });

    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData().finally(() => setRefreshing(false));
  };

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.toggleDrawer()}>
          <Text style={styles.menu}>☰</Text>
        </Pressable>
        <Text style={styles.bigTitle}>Forest Guardian</Text>
      </View>

      {/* STATS CARDS */}
      <View style={styles.statsGrid}>
        <TouchableOpacity 
          style={[styles.statCard, styles.greenCard]}
          onPress={() => navigation.navigate('devices')}
        >
          <Text style={styles.statNumber}>{stats.onlineDevices}/{stats.totalDevices}</Text>
          <Text style={styles.statLabel}>Devices Online</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.statCard, styles.redCard]}
          onPress={() => navigation.navigate('alerts')}
        >
          <Text style={styles.statNumber}>{stats.activeAlerts}</Text>
          <Text style={styles.statLabel}>Active Alerts</Text>
          {stats.criticalAlerts > 0 && (
            <View style={styles.criticalBadge}>
              <Text style={styles.criticalText}>{stats.criticalAlerts} Critical</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.statCard, styles.blueCard]}
          onPress={() => navigation.navigate('analytics')}
        >
          <Text style={styles.statNumber}>{alerts.length}</Text>
          <Text style={styles.statLabel}>Total Reports</Text>
        </TouchableOpacity>
      </View>

      {/* RECENT ALERTS */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Alerts</Text>
          <TouchableOpacity onPress={() => navigation.navigate('alerts')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {alerts.slice(0, 3).map((alert) => (
          <View key={alert.id} style={styles.alertItem}>
            <View style={[styles.alertDot, { backgroundColor: alert.status === 'active' ? '#ef4444' : '#22c55e' }]} />
            <View style={styles.alertContent}>
              <Text style={styles.alertText}>{alert.message || alert.type}</Text>
              <Text style={styles.alertDevice}>{alert.device_code}</Text>
            </View>
            <Text style={styles.alertTime}>
              {new Date(alert.createdAt).toLocaleTimeString()}
            </Text>
          </View>
        ))}
        
        {alerts.length === 0 && (
          <Text style={styles.noData}>No alerts detected ✅</Text>
        )}
      </View>

      {/* IMAGE SLIDER */}
      <ImageSlider />

      {/* LAST UPDATE */}
      <Text style={styles.lastUpdate}>Last updated: {stats.lastUpdate}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  menu: {
    color: "white",
    fontSize: 30,
    marginRight: 15,
  },
  bigTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
  },
  greenCard: { backgroundColor: "#22c55e" },
  redCard: { backgroundColor: "#ef4444" },
  blueCard: { backgroundColor: "#3b82f6" },
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
  criticalBadge: {
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 4,
  },
  criticalText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  section: {
    marginTop: 10,
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  seeAll: {
    color: "#3b82f6",
    fontSize: 14,
  },
  alertItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  alertDot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertText: {
    color: "white",
    fontSize: 14,
  },
  alertDevice: {
    color: "#94a3b8",
    fontSize: 12,
  },
  alertTime: {
    color: "#64748b",
    fontSize: 10,
  },
  noData: {
    color: "#64748b",
    fontSize: 14,
    textAlign: "center",
    padding: 20,
  },
  lastUpdate: {
    color: "#64748b",
    fontSize: 10,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
  },
});
