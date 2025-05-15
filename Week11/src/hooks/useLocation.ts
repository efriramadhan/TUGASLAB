import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';
import { LocationData } from '../types';
import { getCurrentLocation as getLocation, getAddressFromCoordinates } from '../utils/location';

export const useLocation = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setErrorMsg('Izin untuk mengakses lokasi ditolak');
        Alert.alert(
          'Izin Diperlukan',
          'Aplikasi memerlukan izin untuk mengakses lokasi.',
          [{ text: 'OK' }]
        );
        return;
      }
    })();
  }, []);

  const getCurrentLocation = async (): Promise<LocationData | null> => {
    try {
      setIsLoading(true);
      setErrorMsg(null);

      const locationData = await getLocation();

      if (locationData) {
        setLocation(locationData);
      } else {
        setErrorMsg('Gagal mendapatkan lokasi');
      }

      return locationData;
    } catch (error) {
      setErrorMsg('Gagal mendapatkan lokasi');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getAddress = async (latitude: number, longitude: number): Promise<string | null> => {
    try {
      return await getAddressFromCoordinates(latitude, longitude);
    } catch (error) {
      return null;
    }
  };

  return {
    location,
    errorMsg,
    isLoading,
    getCurrentLocation,
    getAddress,
  };
};