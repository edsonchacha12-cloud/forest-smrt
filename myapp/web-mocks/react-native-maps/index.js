// Complete mock for react-native-maps on web
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MapView = ({ children, style, ...props }) => {
  return (
    <View style={[styles.mapContainer, style]}>
      <Text style={styles.mapText}>📍 Map View</Text>
      <Text style={styles.mapSubText}>
        Lat: {props?.initialRegion?.latitude || props?.region?.latitude || 'N/A'}
      </Text>
      <Text style={styles.mapSubText}>
        Lng: {props?.initialRegion?.longitude || props?.region?.longitude || 'N/A'}
      </Text>
      {children}
    </View>
  );
};

const Marker = ({ children, title, coordinate }) => {
  return (
    <View style={styles.markerContainer}>
      <View style={styles.markerPin}>
        <Text style={styles.markerIcon}>📍</Text>
      </View>
      {title && <Text style={styles.markerTitle}>{title}</Text>}
      {children}
    </View>
  );
};

const Polygon = ({ children, ...props }) => <View>{children}</View>;
const Polyline = ({ children, ...props }) => <View>{children}</View>;
const Circle = ({ children, ...props }) => <View>{children}</View>;
const UrlTile = ({ children, ...props }) => <View>{children}</View>;
const LocalTile = ({ children, ...props }) => <View>{children}</View>;
const Overlay = ({ children, ...props }) => <View>{children}</View>;

const PROVIDER_GOOGLE = 'google';
const PROVIDER_DEFAULT = 'default';

const styles = StyleSheet.create({
  mapContainer: {
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    padding: 20,
    minHeight: 200,
  },
  mapText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
  mapSubText: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 4,
  },
  markerContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  markerPin: {
    width: 30,
    height: 30,
    backgroundColor: '#ef4444',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerIcon: {
    fontSize: 16,
  },
  markerTitle: {
    fontSize: 10,
    color: 'black',
    marginTop: 2,
    textAlign: 'center',
  },
});

export { 
  Marker, 
  Polygon, 
  Polyline, 
  Circle, 
  UrlTile,
  LocalTile,
  Overlay,
  PROVIDER_GOOGLE, 
  PROVIDER_DEFAULT 
};
export default MapView;
