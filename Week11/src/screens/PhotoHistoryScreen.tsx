import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Text,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, PhotoData } from '../types';
import { Header } from '../components/Header';
import { PhotoCard } from '../components/PhotoCard';
import { EmptyState } from '../components/EmptyState';
import { getPhotos } from '../services/supabase';

type PhotoHistoryNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PhotoHistory'>;

export const PhotoHistoryScreen: React.FC = () => {
  const navigation = useNavigation<PhotoHistoryNavigationProp>();
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
  }, []);

  const handlePhotoPress = (photoId: string) => {
    navigation.navigate('PhotoDetail', { photoId });
  };

  const renderItem = ({ item }: { item: PhotoData }) => (
    <View style={styles.photoItem}>
      <PhotoCard
        photo={item}
        onPress={() => item.id && handlePhotoPress(item.id)}
      />
    </View>
  );

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0077E0" />
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

  return (
    <View style={styles.container}>
      <Header
        title="Riwayat Foto"
        showBackButton
      />

      <FlatList
        data={photos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id || item.photo_url}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#0077E0']}
            progressBackgroundColor="#FFFFFF"
          />
        }
        ListEmptyComponent={renderEmptyState()}
        ListHeaderComponent={
          photos.length > 0 ? (
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>
                {photos.length} foto ditemukan
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 30,
    flexGrow: 1,
  },
  photoItem: {
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    marginBottom: 20,
    paddingBottom: 10,
    alignItems: 'flex-start',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});