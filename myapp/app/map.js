import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { 
  Pressable, 
  StyleSheet, 
  Text, 
  View, 
  RefreshControl,
  TouchableOpacity,
  ScrollView
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { getDevices, getLatestSensorData } from "../services/api";

export default function MapPage() {
  const navigation = useNavigation();
  const [devices, setDevices] = useState([]);
  const [sensorData, setSensorData] = useState({});
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [region, setRegion] = useState({
    latitude: -6.7924,
    longitude: 39.2083,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [refreshing, setRefreshing] = useState(false);

  const loadMapData = async () => {
    try {
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

      // Center map on first device with location
      const deviceWithLocation = deviceList?.find(d => d.latitude && d.longitude);
      if (deviceWithLocation) {
        setRegion({
          latitude: parseFloat(deviceWithLocation.latitude),
          longitude: parseFloat(deviceWithLocation.longitude),
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }
    } catch (error) {
      console.log("Map load error:", error);
    }
  };

  useEffect(() => {
    loadMapData();
    const interval = setInterval(loadMapData, 10000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadMapData().finally(() => setRefreshing(false));
  };

  const getMarkerColor = (deviceCode) => {
    const data = sensorData[deviceCode];
    if (!data) return '#64748b';
    if (data.smoke > 70 || data.sound > 80) return '#ef4444';
    if (data.smoke > 30 || data.sound > 40) return '#f59e0b';
    return '#22c55e';
  };

  const devicesWithLocation = devices.filter(d => d.latitude && d.longitude);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.toggleDrawer()}>
          <Text style={styles.arrow}>←</Text>
        </Pressable>
        <Text style={styles.title}>Forest Map</Text>
        <Text style={styles.deviceCount}>{devicesWithLocation.length} devices</Text>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={region}
          onRegionChange={setRegion}
        >
          {devicesWithLocation.map((device) => {
            const color = getMarkerColor(device.device_code);
            const data = sensorData[device.device_code];
            
            return (
              <Marker
                key={device.id}
                coordinate={{
                  latitude: parseFloat(device.latitude),
                  longitude: parseFloat(device.longitude),
                }}
                pinColor={color}
                onPress={() => setSelectedDevice(device)}
              >
                <Callout>
                  <View style={styles.callout}>
                    <Text style={styles.calloutTitle}>{device.name || device.device_code}</Text>
                    {data && (
                      <>
                        <Text style={styles.calloutData}>🌫️ Smoke: {data.smoke}</Text>
                        <Text style={styles.calloutData}>🔊 Sound: {data.sound}</Text>
                        <Text style={styles.calloutData}>🌡️ Temp: {data.temperature}°C</Text>
                      </>
                    )}
                    <Text style={styles.calloutStatus}>
                      {data?.smoke > 70 || data?.sound > 80 ? '🚨 ALERT' : '✅ Normal'}
                    </Text>
                  </View>
                </Callout>
              </Marker>
            );
          })}
        </MapView>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#22c55e' }]} />
            <Text style={styles.legendText}>Safe</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
            <Text style={styles.legendText}>Warning</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} />
            <Text style={styles.legendText}>Alert</Text>
          </View>
        </View>

        {/* Device Info Panel */}
        {selectedDevice && (
          <View style={styles.infoPanel}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setSelectedDevice(null)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.infoTitle}>
              {selectedDevice.name || selectedDevice.device_code}
            </Text>
            {sensorData[selectedDevice.device_code] && (
              <View style={styles.infoRow}>
                <Text style={styles.infoText}>
                  🌫️ {sensorData[selectedDevice.device_code].smoke}
                </Text>
                <Text style={styles.infoText}>
                  🔊 {sensorData[selectedDevice.device_code].sound}
                </Text>
                <Text style={styles.infoText}>
                  🌡️ {sensorData[selectedDevice.device_code].temperature}°C
                </Text>
              </View>
            )}
            <Text style={styles.infoLocation}>
              📍 {selectedDevice.latitude}, {selectedDevice.longitude}
            </Text>
          </View>
        )}
      </View>

      <ScrollView 
        horizontal 
        style={styles.deviceList}
        showsHorizontalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {devicesWithLocation.map((device) => (
          <TouchableOpacity
            key={device.id}
            style={[
              styles.deviceChip,
              { borderColor: getMarkerColor(device.device_code) }
            ]}
            onPress={() => {
              setSelectedDevice(device);
              setRegion({
                latitude: parseFloat(device.latitude),
                longitude: parseFloat(device.longitude),
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              });
            }}
          >
            <Text style={styles.deviceChipName}>
              {device.name || device.device_code}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 15,
    paddingBottom: 10,
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
    fontSize: 14,
    backgroundColor: "#1e293b",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  callout: {
    padding: 10,
    minWidth: 150,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  calloutData: {
    fontSize: 12,
    color: "#333",
  },
  calloutStatus: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 4,
    color: "#ef4444",
  },
  legend: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 8,
    padding: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    color: 'white',
    fontSize: 10,
  },
  infoPanel: {
    position: 'absolute',
    bottom: 80,
    left: 10,
    right: 10,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 15,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
  },
  closeButtonText: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 4,
  },
  infoText: {
    color: 'white',
    fontSize: 14,
  },
  infoLocation: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  deviceList: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    maxHeight: 50,
    paddingHorizontal: 10,
  },
  deviceChip: {
    backgroundColor: '#1e293b',
    borderWidth: 2,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  deviceChipName: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
});
