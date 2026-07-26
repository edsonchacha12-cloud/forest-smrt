import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

// Web-compatible map component - no native dependencies
const MapView = ({ children, style, ...props }) => {
  return (
    <View style={[styles.mapContainer, style]}>
      <Text style={styles.mapTitle}>📍 Map View</Text>
      <Text style={styles.mapText}>
        Latitude: {props?.initialRegion?.latitude || props?.region?.latitude || '-6.7631'}
      </Text>
      <Text style={styles.mapText}>
        Longitude: {props?.initialRegion?.longitude || props?.region?.longitude || '39.1484'}
      </Text>
      <View style={styles.pinContainer}>
        <Text style={styles.pin}>📍</Text>
        <Text style={styles.pinLabel}>Mikumi Forest</Text>
      </View>
      {children}
    </View>
  );
};

const Marker = ({ children, title, coordinate }) => {
  return (
    <View style={styles.markerContainer}>
      <Text style={styles.markerPin}>📍</Text>
      {title && <Text style={styles.markerTitle}>{title}</Text>}
      {children}
    </View>
  );
};

const Polygon = ({ children }) => <View>{children}</View>;
const Polyline = ({ children }) => <View>{children}</View>;
const Circle = ({ children }) => <View>{children}</View>;

const PROVIDER_GOOGLE = 'google';
const PROVIDER_DEFAULT = 'default';

const styles = StyleSheet.create({
  mapContainer: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 20,
    minHeight: 300,
    borderWidth: 1,
    borderColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapTitle: {
    color: '#10b981',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  mapText: {
    color: '#9ca3af',
    fontSize: 14,
    marginVertical: 2,
  },
  pinContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  pin: {
    fontSize: 40,
  },
  pinLabel: {
    color: '#10b981',
    fontSize: 14,
    marginTop: 4,
  },
  markerContainer: {
    alignItems: 'center',
  },
  markerPin: {
    fontSize: 24,
  },
  markerTitle: {
    color: '#10b981',
    fontSize: 12,
  },
});

// Export the web-compatible components
export { 
  MapView as default,
  Marker, 
  Polygon, 
  Polyline, 
  Circle, 
  PROVIDER_GOOGLE, 
  PROVIDER_DEFAULT 
};
