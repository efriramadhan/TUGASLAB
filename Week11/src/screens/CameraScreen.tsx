import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  StatusBar,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, PhotoData } from '../types';
import { useCamera } from '../hooks/useCamera';
import { useLocation } from '../hooks/useLocation';
import { CameraControls } from '../components/CameraControls';
import { CameraView } from '../components/CameraView';
import { uploadPhoto, savePhotoData } from '../services/supabase';
import { getFileNameFromUri } from '../utils/formatters';
import {
  sendUploadSuccessNotification,
  sendUploadFailureNotification,
  sendSaveSuccessNotification,
  sendSaveFailureNotification,
  sendLocationCaptureNotification
} from '../services/notifications';

type CameraScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Camera'>;

export const CameraScreen: React.FC = () => {
  const navigation = useNavigation<CameraScreenNavigationProp>();
  const {
    hasPermission,
    type,
    flash,
    cameraRef,
    toggleCameraType,
    toggleFlash,
    takePicture
  } = useCamera();

  const { getCurrentLocation } = useLocation();

  const [isCapturing, setIsCapturing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleCapture = async () => {
    if (isCapturing || isSaving) {
      return;
    }

    try {
      setIsCapturing(true);


      const [photoUri, location] = await Promise.all([
        takePicture(),
        getCurrentLocation()
      ]);

      if (!photoUri) {
        Alert.alert(
          'Error Kamera',
          'Gagal mengambil foto. Pastikan kamera berfungsi dengan baik dan coba lagi.',
          [{ text: 'OK' }]
        );
        return;
      }

      if (!location) {
        Alert.alert(
          'Error Lokasi',
          'Gagal mendapatkan lokasi. Pastikan GPS aktif dan izin lokasi diberikan, lalu coba lagi.',
          [{ text: 'OK' }]
        );
        return;
      }

      await sendLocationCaptureNotification(location);

      await savePhotoWithLocation(photoUri, location.latitude, location.longitude);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat mengambil foto.';

      Alert.alert(
        'Error',
        `Terjadi kesalahan saat mengambil foto: ${errorMessage}`,
        [{ text: 'OK' }]
      );
    } finally {
      setIsCapturing(false);
    }
  };

  const savePhotoWithLocation = async (uri: string, latitude: number, longitude: number) => {
    try {
      setIsSaving(true);

      const fileName = getFileNameFromUri(uri);

      let uploadResult = null;
      let retryCount = 0;
      const maxRetries = 3;

      while (!uploadResult && retryCount < maxRetries) {
        retryCount++;

        try {
          uploadResult = await uploadPhoto(uri, fileName);
        } catch (uploadError) {
          if (retryCount < maxRetries) {
            const delay = 1000 * Math.pow(2, retryCount - 1);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }

      if (!uploadResult) {
        const dummyFileName = `${Date.now()}_${fileName}`;
        const dummyPath = `public/${dummyFileName}`;
        const dummyUrl = `${uri}?dummy=true`;

        uploadResult = {
          path: dummyPath,
          url: dummyUrl
        };

        await sendUploadFailureNotification(latitude, longitude);

        Alert.alert(
          'Peringatan',
          `Foto berhasil diambil tetapi gagal diunggah ke server. Data lokasi tetap akan disimpan.\n\nLokasi:\nLatitude: ${latitude}\nLongitude: ${longitude}`,
          [{ text: 'OK' }]
        );
      } else {
        await sendUploadSuccessNotification(latitude, longitude, uploadResult.url);
      }

      const photoData: PhotoData = {
        latitude,
        longitude,
        photo_url: uploadResult.url,
      };

      const savedPhoto = await savePhotoData(photoData);

      if (!savedPhoto) {
        await sendSaveFailureNotification(latitude, longitude);

        Alert.alert(
          'Peringatan',
          `Foto berhasil diambil tetapi gagal menyimpan data ke server.\n\nLokasi:\nLatitude: ${latitude}\nLongitude: ${longitude}`,
          [{
            text: 'OK',
            onPress: () => navigation.navigate('Home')
          }]
        );
      } else {
        await sendSaveSuccessNotification(latitude, longitude, savedPhoto.id || '');

        Alert.alert(
          'Sukses',
          `Foto berhasil diambil dan disimpan ke database.\n\nLokasi:\nLatitude: ${latitude}\nLongitude: ${longitude}`,
          [{
            text: 'OK',
            onPress: () => navigation.navigate('Home')
          }]
        );
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan foto.';

      Alert.alert(
        'Error Penyimpanan',
        `Terjadi kesalahan saat menyimpan foto: ${errorMessage}`,
        [
          {
            text: 'Coba Lagi',
            onPress: () => {
              if (uri && latitude && longitude) {
                savePhotoWithLocation(uri, latitude, longitude);
              }
            }
          },
          { text: 'Batal' }
        ]
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.permissionContainer}>
        <ActivityIndicator size="large" color="#0077E0" />
        <Text style={styles.permissionInfoText}>Meminta izin kamera...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="lock-closed-outline" size={70} color="#FF6B6B" />
        <Text style={styles.permissionTitle}>Izin Kamera Ditolak</Text>
        <Text style={styles.permissionInfoText}>
          Aplikasi ini memerlukan izin untuk mengakses kamera Anda. Mohon aktifkan izin kamera di pengaturan perangkat.
        </Text>
        <TouchableOpacity
          style={[styles.permissionButtonBase, styles.primaryButtonCompat]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.permissionButtonText}>Kembali ke Beranda</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />


      <CameraView
        cameraRef={cameraRef}
        type={type}
        flashMode={flash}
      >
        <View style={styles.topControls}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {(isCapturing || isSaving) && (
          <View style={styles.savingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.savingText}>
              {isCapturing ? 'Mengambil foto...' : 'Menyimpan foto...'}
            </Text>
          </View>
        )}

        <View style={styles.bottomControls}>
          <CameraControls
            onCapture={handleCapture}
            onFlipCamera={toggleCameraType}
            onToggleFlash={toggleFlash}
            flashMode={flash}
            isCapturing={isCapturing || isSaving}
          />
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
    alignItems: 'center',
  },
  savingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  savingText: {
    color: '#fff',
    fontSize: 17,
    marginTop: 12,
    fontWeight: '500',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#222',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionInfoText: {
    fontSize: 17,
    color: '#555',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    marginTop: 8,
  },
  permissionButtonBase: {
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 180,
    marginTop: 10,
  },
  primaryButtonCompat: {
    backgroundColor: '#0077E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});
