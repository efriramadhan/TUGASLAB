import * as Location from 'expo-location';
import { LocationData } from '../types';

export const getCurrentLocation = async (): Promise<LocationData | null> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      return null;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy || undefined,
      altitude: location.coords.altitude || undefined,
      heading: location.coords.heading || undefined,
      speed: location.coords.speed || undefined,
      altitudeAccuracy: location.coords.altitudeAccuracy || undefined,
      timestamp: location.timestamp,
    };
  } catch (error) {
    return null;
  }
};

export const getAddressFromCoordinates = async (
  latitude: number,
  longitude: number
): Promise<string | null> => {
  try {
    const addressResponse = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (addressResponse && addressResponse.length > 0) {
      const address = addressResponse[0];
      const addressParts = [
        address.name,
        address.street,
        address.district,
        address.city,
        address.region,
        address.country,
        address.postalCode,
      ].filter(Boolean);

      return addressParts.join(', ');
    }

    return null;
  } catch (error) {
    return null;
  }
};