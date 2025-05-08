import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { styles } from './style';
import { LocationData, openInMaps } from './utils';


export const ActionButton = ({
  title,
  onPress,
  type = 'primary',
  disabled = false,
  isLoading = false
}: {
  title: string,
  onPress: () => void,
  type?: 'primary' | 'secondary' | 'danger',
  disabled?: boolean,
  isLoading?: boolean
}) => {
  const buttonStyle = () => {
    if (disabled) return [styles.button, styles.disabledButton];
    switch (type) {
      case 'primary': return [styles.button, styles.primaryButton];
      case 'secondary': return [styles.button, styles.secondaryButton];
      case 'danger': return [styles.button, styles.dangerButton];
      default: return [styles.button, styles.primaryButton];
    }
  };

  return (
    <TouchableOpacity
      style={buttonStyle()}
      onPress={onPress}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};


export const CurrentLocationCard = ({
  currentLocation,
  isLoading
}: {
  currentLocation: LocationData | null,
  isLoading: boolean
}) => {
  if (!currentLocation) return null;

  return (
    <View style={styles.locationCard}>
      <Text style={styles.cardTitle}>Lokasi Saat Ini</Text>
      <Text style={styles.timestamp}>Waktu: {currentLocation.timestamp}</Text>

      <View style={styles.coordsContainer}>
        <View style={styles.coordItem}>
          <Text style={styles.coordLabel}>Longitude:</Text>
          <Text style={styles.coordValue}>{currentLocation.longitude.toFixed(6)}</Text>
        </View>
        <View style={styles.coordItem}>
          <Text style={styles.coordLabel}>Latitude:</Text>
          <Text style={styles.coordValue}>{currentLocation.latitude.toFixed(6)}</Text>
        </View>
        {currentLocation.altitude !== null && (
          <View style={styles.coordItem}>
            <Text style={styles.coordLabel}>Altitude:</Text>
            <Text style={styles.coordValue}>{currentLocation.altitude.toFixed(2)} m</Text>
          </View>
        )}
        {currentLocation.speed !== null && (
          <View style={styles.coordItem}>
            <Text style={styles.coordLabel}>Kecepatan:</Text>
            <Text style={styles.coordValue}>{currentLocation.speed.toFixed(2)} m/s</Text>
          </View>
        )}
        {currentLocation.accuracy !== null && (
          <View style={styles.coordItem}>
            <Text style={styles.coordLabel}>Akurasi:</Text>
            <Text style={styles.coordValue}>{currentLocation.accuracy.toFixed(2)} m</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.mapLink}
        onPress={() => openInMaps(currentLocation.latitude, currentLocation.longitude)}
        disabled={isLoading}
      >
        <Text style={styles.mapLinkText}>Buka di Peta</Text>
      </TouchableOpacity>
    </View>
  );
};


export const LocationHistoryCard = ({
  locationHistory,
  onClearHistory,
  saveCount = 0
}: {
  locationHistory: LocationData[],
  onClearHistory: () => void,
  saveCount?: number
}) => {
  if (locationHistory.length === 0) return null;

  return (
    <View style={styles.historyCard}>
      <Text style={styles.cardTitle}>Riwayat Lokasi</Text>
      <Text style={styles.historySubtitle}>
        {locationHistory.length} lokasi tersimpan {saveCount > 0 ? `• ${saveCount} file disimpan` : ''}
      </Text>

      {locationHistory.slice(0, 5).map((location, index) => (
        <View key={index} style={styles.historyItem}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyIndex}>Lokasi #{locationHistory.length - index}</Text>
            <Text style={styles.historyTimestamp}>{location.timestamp}</Text>
          </View>
          <View style={styles.historyCoords}>
            <Text style={styles.historyCoordText}>
              Longitude: {location.longitude.toFixed(6)}
            </Text>
            <Text style={styles.historyCoordText}>
              Latitude: {location.latitude.toFixed(6)}
            </Text>
          </View>
        </View>
      ))}

      {locationHistory.length > 5 && (
        <Text style={styles.historySubtitle}>
          ...dan {locationHistory.length - 5} lokasi lainnya
        </Text>
      )}

      <TouchableOpacity
        style={[styles.button, styles.dangerButton, { marginTop: 10 }]}
        onPress={onClearHistory}
      >
        <Text style={styles.buttonText}>Hapus Riwayat</Text>
      </TouchableOpacity>
    </View>
  );
};