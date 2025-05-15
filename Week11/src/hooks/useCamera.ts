import { useState, useEffect, useRef } from 'react';
import { useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';

type CameraTypeValue = 'front' | 'back';
type FlashModeValue = 'on' | 'off' | 'auto' | 'torch';

export const useCamera = () => {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = useState<boolean | null>(null);
  const [type, setType] = useState<CameraTypeValue>('back');
  const [flash, setFlash] = useState<FlashModeValue>('off');
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
        requestMediaLibraryPermission(mediaStatus === 'granted');

        if (!cameraPermission) {
          await requestCameraPermission();
        }

        if (
          (cameraPermission && !cameraPermission.granted) ||
          mediaStatus !== 'granted'
        ) {
          Alert.alert(
            'Izin Diperlukan',
            'Aplikasi memerlukan izin untuk mengakses kamera dan media library.',
            [{ text: 'OK' }]
          );
        }
      } catch (error) {
      }
    })();
  }, [cameraPermission, requestCameraPermission]);

  const toggleCameraType = () => {
    setType(current => (
      current === 'back' ? 'front' : 'back'
    ));
  };

  const toggleFlash = () => {
    setFlash(current => (
      current === 'off'
        ? 'on'
        : 'off'
    ));
  };

  const takePicture = async () => {
    if (!cameraRef.current) {
      return null;
    }

    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Camera timeout')), 10000)
      );

      const photo = await Promise.race([
        cameraRef.current.takePictureAsync({
          quality: 0.6,
          skipProcessing: false,
          base64: false,
        }),
        timeoutPromise
      ]);

      try {
        await MediaLibrary.saveToLibraryAsync(photo.uri);
      } catch (mediaError) {
      }

      return photo.uri;
    } catch (error) {
      try {
        const { launchCameraAsync } = await import('expo-image-picker');
        const result = await launchCameraAsync({
          quality: 0.6,
          allowsEditing: false,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
          const uri = result.assets[0].uri;
          return uri;
        }
      } catch (fallbackError) {
      }

      return null;
    }
  };

  const hasPermission = cameraPermission?.granted && mediaLibraryPermission;

  return {
    hasPermission,
    type,
    flash,
    cameraRef,
    toggleCameraType,
    toggleFlash,
    takePicture,
  };
};