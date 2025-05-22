import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, PhotoData } from '../types';
import { Header } from '../components/Header';
import { PhotoCard } from '../components/PhotoCard';
import { EmptyState } from '../components/EmptyState';
import { getPhotos } from '../services/supabase';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const data = await getPhotos();
      setPhotos(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPhotos();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchPhotos();

    const unsubscribe = navigation.addListener('focus', () => {
      fetchPhotos();
    });

    return unsubscribe;
  }, [navigation]);

  const handlePhotoPress = (photoId: string) => {
    navigation.navigate('PhotoDetail', { photoId });
  };

  const renderItem = ({ item }: { item: PhotoData }) => (
    <PhotoCard
      photo={item}
      onPress={() => item.id && handlePhotoPress(item.id)}
    />
  );

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      );
    }

    return (
      <EmptyState
        title="Belum Ada Foto"
        message="Mulai ambil foto dengan lokasi Anda sekarang!"
        buttonTitle="Ambil Foto"
        onButtonPress={() => navigation.navigate('Camera')}
      />
    );
  };

  const CameraButton = () => (
    <TouchableOpacity
      style={styles.cameraButton}
      onPress={() => navigation.navigate('Camera')}
      activeOpacity={0.7}
    >
      <Ionicons name="camera" size={28} color="#fff" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Foto Lokasi"
        rightComponent={
          <TouchableOpacity onPress={() => navigation.navigate('PhotoHistory')}>
            <Ionicons name="images-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        }
      />

      <FlatList
        data={photos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id || item.photo_url}
        contentContainerStyle={styles.listContent}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#007AFF']}
          />
        }
        ListEmptyComponent={renderEmptyState()}
      />

      <CameraButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    paddingBottom: 80,
    flexGrow: 1,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0077E0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.20,
    shadowRadius: 6,
    elevation: 6,
  },
});