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
import { getAlerts, resolveAlert } from "../services/api";
import { listenNewAlerts } from "../services/socket";

export default function Alerts() {
  const navigation = useNavigation();
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('all'); // all, active, resolved
  const [refreshing, setRefreshing] = useState(false);

  const loadAlerts = async () => {
    try {
      const data = await getAlerts();
      setAlerts(data || []);
    } catch (error) {
      console.log("Error loading alerts:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAlerts();
    listenNewAlerts((data) => {
      setAlerts(prev => [data, ...prev]);
    });
    const interval = setInterval(loadAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadAlerts();
  };

  const handleResolve = async (id) => {
    try {
      await resolveAlert(id);
      loadAlerts();
    } catch (error) {
      console.log("Error resolving alert:", error);
    }
  };

  const getFilteredAlerts = () => {
    if (filter === 'active') return alerts.filter(a => a.status === 'active');
    if (filter === 'resolved') return alerts.filter(a => a.status !== 'active');
    return alerts;
  };

  const getAlertIcon = (type) => {
    const icons = {
      fire: '🔥', noise: '🔊', smoke: '🌫️', 
      chainsaw: '⚙️', axe: '🪓', critical: '🚨'
    };
    return icons[type] || '⚠️';
  };

  const getSeverityColor = (severity) => {
    if (severity === 'critical') return '#ef4444';
    if (severity === 'high') return '#f59e0b';
    return '#3b82f6';
  };

  const filteredAlerts = getFilteredAlerts();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.toggleDrawer()}>
          <Text style={styles.arrow}>←</Text>
        </Pressable>
        <Text style={styles.title}>Alerts</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {alerts.filter(a => a.status === 'active').length}
          </Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabs}>
        {['all', 'active', 'resolved'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, filter === tab && styles.activeTab]}
            onPress={() => setFilter(tab)}
          >
            <Text style={[styles.tabText, filter === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredAlerts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>✅ No {filter} alerts</Text>
          </View>
        ) : (
          filteredAlerts.map((alert) => (
            <View key={alert.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.alertTitle}>
                  {getAlertIcon(alert.type)} {alert.message || alert.type}
                </Text>
                {alert.severity && (
                  <Text style={[styles.severity, { backgroundColor: getSeverityColor(alert.severity) }]}>
                    {alert.severity.toUpperCase()}
                  </Text>
                )}
              </View>

              <Text style={styles.deviceCode}>Device: {alert.device_code}</Text>

              <View style={styles.details}>
                <Text style={styles.detailText}>
                  📍 Lat: {alert.latitude || 'N/A'} | Long: {alert.longitude || 'N/A'}
                </Text>
                <Text style={styles.detailText}>
                  🕐 {new Date(alert.createdAt).toLocaleString()}
                </Text>
              </View>

              <View style={styles.statusRow}>
                <View style={[styles.statusDot, { backgroundColor: alert.status === 'active' ? '#ef4444' : '#22c55e' }]} />
                <Text style={[styles.statusText, { color: alert.status === 'active' ? '#ef4444' : '#22c55e' }]}>
                  {alert.status === 'active' ? '⚠️ Active' : '✅ Resolved'}
                </Text>
              </View>

              {alert.status === 'active' && (
                <TouchableOpacity
                  style={styles.resolveButton}
                  onPress={() => handleResolve(alert.id)}
                >
                  <Text style={styles.resolveButtonText}>Mark as Resolved</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 15,
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
  badge: {
    backgroundColor: "#ef4444",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  tabs: {
    flexDirection: "row",
    marginBottom: 15,
    backgroundColor: "#1e293b",
    borderRadius: 10,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#ff7a00",
  },
  tabText: {
    color: "#94a3b8",
    fontSize: 14,
  },
  activeTabText: {
    color: "white",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  alertTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  severity: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  deviceCode: {
    color: "#94a3b8",
    fontSize: 14,
    marginBottom: 8,
  },
  details: {
    backgroundColor: "#0f172a",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  detailText: {
    color: "#94a3b8",
    fontSize: 12,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  resolveButton: {
    backgroundColor: "#ff7a00",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  resolveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
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
