import { Alert, Linking } from 'react-native';
import * as Location from 'expo-location';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

export const requestCameraPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Camera.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Izin Diperlukan',
        'Aplikasi memerlukan izin untuk mengakses kamera. Silakan berikan izin di pengaturan.',
        [
          { text: 'Batal', style: 'cancel' },
          {
            text: 'Buka Pengaturan',
            onPress: () => Linking.openSettings()
          }
        ]
      );
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

export const requestMediaLibraryPermission = async (): Promise<boolean> => {
  const { status } = await MediaLibrary.requestPermissionsAsync();

  if (status !== 'granted') {
    Alert.alert(
      'Izin Diperlukan',
      'Aplikasi memerlukan izin untuk mengakses media library. Silakan berikan izin di pengaturan.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Buka Pengaturan',
          onPress: () => Linking.openSettings()
        }
      ]
    );
    return false;
  }

  return true;
};

export const requestLocationPermission = async (): Promise<boolean> => {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    Alert.alert(
      'Izin Diperlukan',
      'Aplikasi memerlukan izin untuk mengakses lokasi. Silakan berikan izin di pengaturan.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Buka Pengaturan',
          onPress: () => Linking.openSettings()
        }
      ]
    );
    return false;
  }

  return true;
};

export const requestAllPermissions = async (): Promise<boolean> => {
  const cameraPermission = await requestCameraPermission();
  const mediaLibraryPermission = await requestMediaLibraryPermission();
  const locationPermission = await requestLocationPermission();

  return cameraPermission && mediaLibraryPermission && locationPermission;
};