import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  StatusBar
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

      // Jalankan pengambilan foto dan lokasi secara paralel
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

        Alert.alert(
          'Peringatan',
          'Foto berhasil diambil tetapi gagal diunggah ke server. Data lokasi tetap akan disimpan.',
          [{ text: 'OK' }]
        );
      }

      const photoData: PhotoData = {
        latitude,
        longitude,
        photo_url: uploadResult.url,
      };

      const savedPhoto = await savePhotoData(photoData);

      // Navigasi ke Home terlebih dahulu untuk mengurangi waktu tunggu
      navigation.navigate('Home');

      // Tampilkan alert setelah navigasi
      if (!savedPhoto) {
        Alert.alert(
          'Peringatan',
          'Foto berhasil diambil tetapi gagal menyimpan data ke server.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Sukses',
          'Foto berhasil diambil dan disimpan.',
          [{ text: 'OK' }]
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
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.permissionText}>Meminta izin kamera...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-outline" size={48} color="#FF3B30" />
        <Text style={styles.permissionTitle}>Izin Kamera Ditolak</Text>
        <Text style={styles.permissionText}>
          Aplikasi memerlukan izin untuk mengakses kamera.
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.permissionButtonText}>Kembali</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 40,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomControls: {
    paddingBottom: 30,
  },
  savingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  savingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  permissionButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});