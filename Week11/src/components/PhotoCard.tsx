import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { PhotoData } from '../types';
import { formatDate } from '../utils/formatters';
import { getAddressFromCoordinates } from '../utils/location';

interface PhotoCardProps {
  photo: PhotoData;
  onPress?: () => void;
  showDetails?: boolean;
}

const { width } = Dimensions.get('window');
const cardWidth = width / 2 - 24;

export const PhotoCard: React.FC<PhotoCardProps> = ({
  photo,
  onPress,
  showDetails = false,
}) => {
  const [address, setAddress] = useState<string | null>(null);
  const [loadingAddress, setLoadingAddress] = useState(false);

  useEffect(() => {
    if (showDetails) {
      fetchAddress();
    }
  }, [showDetails, photo]);

  const fetchAddress = async () => {
    try {
      setLoadingAddress(true);
      const addressResult = await getAddressFromCoordinates(photo.latitude, photo.longitude);
      setAddress(addressResult);
    } catch (error) {
    } finally {
      setLoadingAddress(false);
    }
  };
  return (
    <TouchableOpacity
      style={[styles.card, showDetails && styles.detailCard]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={!onPress}
    >
      <Image
        source={{ uri: photo.photo_url }}
        style={[styles.image, showDetails && styles.detailImage]}
        resizeMode="cover"
      />

      {showDetails ? (
        <View style={styles.detailsContainer}>
          <View style={styles.locationContainer}>
            <Text style={styles.locationTitle}>Lokasi:</Text>
            <Text style={styles.locationText}>
              Latitude: {photo.latitude.toFixed(7)}
            </Text>
            <Text style={styles.locationText}>
              Longitude: {photo.longitude.toFixed(7)}
            </Text>

            {loadingAddress ? (
              <View style={styles.addressLoading}>
                <ActivityIndicator size="small" color="#007AFF" />
                <Text style={styles.addressLoadingText}>Memuat alamat...</Text>
              </View>
            ) : address ? (
              <View style={styles.addressContainer}>
                <Text style={styles.addressTitle}>Alamat:</Text>
                <Text style={styles.addressText}>{address}</Text>
              </View>
            ) : null}
          </View>

          {photo.created_at && (
            <Text style={styles.dateText}>
              Diambil pada: {formatDate(photo.created_at)}
            </Text>
          )}
        </View>
      ) : (
        <View style={styles.infoContainer}>
          <Text style={styles.locationInfo} numberOfLines={1}>
            {photo.latitude.toFixed(4)}, {photo.longitude.toFixed(4)}
          </Text>
          {photo.created_at && (
            <Text style={styles.dateInfo}>
              {formatDate(photo.created_at, true)}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    width: cardWidth,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  detailCard: {
    width: '100%',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: cardWidth,
  },
  detailImage: {
    height: width * 0.75,
  },
  infoContainer: {
    padding: 12,
  },
  locationInfo: {
    fontSize: 13,
    fontWeight: '500',
    color: '#444',
    marginBottom: 5,
  },
  dateInfo: {
    fontSize: 12,
    color: '#888',
  },
  detailsContainer: {
    padding: 20,
  },
  locationContainer: {
    marginBottom: 16,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    color: '#222',
  },
  locationText: {
    fontSize: 15,
    color: '#555',
    marginBottom: 4,
    lineHeight: 22,
  },
  dateText: {
    fontSize: 14,
    color: '#777',
    fontStyle: 'italic',
    marginTop: 8,
  },
  addressLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  addressLoadingText: {
    fontSize: 14,
    color: '#777',
    marginLeft: 10,
  },
  addressContainer: {
    marginTop: 12,
  },
  addressTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
});