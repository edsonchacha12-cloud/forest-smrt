import { View, Text, StyleSheet } from "react-native";

export default function DeviceCard({ reading }) {
  if (!reading) return null;

  const isAlert = reading.smoke > 70 || reading.sound > 80;

  return (
    <View style={[styles.card, isAlert && styles.alertCard]}>
      <View style={styles.cardHeader}>
        <Text style={styles.deviceCode}>{reading.device_code}</Text>
        {isAlert && <Text style={styles.alertBadge}>⚠️ ALERT</Text>}
      </View>
      
      <View style={styles.cardRow}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>🌫️ Smoke</Text>
          <Text style={[styles.metricValue, reading.smoke > 70 && styles.danger]}>
            {reading.smoke || 0}
          </Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>🔊 Sound</Text>
          <Text style={[styles.metricValue, reading.sound > 80 && styles.danger]}>
            {reading.sound || 0}
          </Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>🌡️ Temp</Text>
          <Text style={styles.metricValue}>{reading.temperature || 0}°C</Text>
        </View>
      </View>

      {reading.latitude && reading.longitude && (
        <Text style={styles.location}>
          📍 {reading.latitude}, {reading.longitude}
        </Text>
      )}

      <Text style={styles.timestamp}>
        {new Date(reading.createdAt || reading.received_at).toLocaleString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#334155",
  },
  alertCard: {
    borderColor: "#ef4444",
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  deviceCode: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  alertBadge: {
    backgroundColor: "#ef4444",
    color: "white",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: "bold",
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
  },
  metric: {
    alignItems: "center",
  },
  metricLabel: {
    color: "#94a3b8",
    fontSize: 12,
    marginBottom: 4,
  },
  metricValue: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  danger: {
    color: "#ef4444",
  },
  location: {
    color: "#64748b",
    fontSize: 11,
    textAlign: "center",
    marginTop: 4,
  },
  timestamp: {
    color: "#64748b",
    fontSize: 10,
    textAlign: "center",
    marginTop: 6,
  },
});
