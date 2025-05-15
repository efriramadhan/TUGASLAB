import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Linking,
  Share,
  Text,
  TouchableOpacity,
  Platform
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, PhotoData } from '../types';
import { Header } from '../components/Header';
import { PhotoCard } from '../components/PhotoCard';
import { Button } from '../components/Button';
import { getPhotoById, deletePhoto } from '../services/supabase';

type PhotoDetailRouteProp = RouteProp<RootStackParamList, 'PhotoDetail'>;
type PhotoDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PhotoDetail'>;

export const PhotoDetailScreen: React.FC = () => {
  const navigation = useNavigation<PhotoDetailNavigationProp>();
  const route = useRoute<PhotoDetailRouteProp>();
  const { photoId } = route.params;

  const [photo, setPhoto] = useState<PhotoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchPhoto();
  }, [photoId]);

  const fetchPhoto = async () => {
    try {
      setLoading(true);
      const data = await getPhotoById(photoId);
      setPhoto(data);
    } catch (error) {
      Alert.alert('Error', 'Gagal memuat data foto.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Hapus Foto',
      'Apakah Anda yakin ingin menghapus foto ini?',
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Hapus', style: 'destructive', onPress: confirmDelete }
      ]
    );
  };

  const confirmDelete = async () => {
    if (!photo || !photo.id) return;

    try {
      setDeleting(true);

      const path = photo.photo_url.split('/').pop() || '';

      const success = await deletePhoto(photo.id, path);

      if (success) {
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Gagal menghapus foto. Silakan coba lagi.');
      }
    } catch (error) {
      Alert.alert('Error', 'Terjadi kesalahan saat menghapus foto.');
    } finally {
      setDeleting(false);
    }
  };

  const handleShare = async () => {
    if (!photo) return;

    try {
      await Share.share({
        message: `Lokasi saya: Latitude ${photo.latitude}, Longitude ${photo.longitude}`,
        url: photo.photo_url,
      });
    } catch (error) {
    }
  };

  const openInMaps = () => {
    if (!photo) return;

    const url = Platform.select({
      ios: `maps:0,0?q=${photo.latitude},${photo.longitude}`,
      android: `geo:0,0?q=${photo.latitude},${photo.longitude}`,
    });

    if (url) {
      Linking.openURL(url);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!photo) {
    return (
      <View style={styles.container}>
        <Header title="Detail Foto" showBackButton />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#FF3B30" />
          <Text style={styles.errorText}>Foto tidak ditemukan</Text>
          <Button
            title="Kembali"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Detail Foto"
        showBackButton
        rightComponent={
          <TouchableOpacity onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <PhotoCard photo={photo} showDetails />

        <View style={styles.actionsContainer}>
          <Button
            title="Lihat di Peta"
            onPress={openInMaps}
            variant="secondary"
            style={styles.actionButton}
          />

          <Button
            title="Hapus Foto"
            onPress={handleDelete}
            variant="danger"
            style={styles.actionButton}
            isLoading={deleting}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsContainer: {
    marginTop: 20,
  },
  actionButton: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#333',
    marginTop: 12,
    marginBottom: 20,
  },
  backButton: {
    marginTop: 10,
  },
});