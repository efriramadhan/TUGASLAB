import React, { useEffect, useState } from 'react';
import { StatusBar, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator'; // Ensure this file exists at the specified path
import { requestAllPermissions } from './src/utils/permissions';
import { ensurePhotosBucket, ensurePhotosTable } from './src/services/supabase';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await requestAllPermissions();
        await ensurePhotosBucket();
        await ensurePhotosTable();
      } catch (error) {
        setInitError('Terjadi kesalahan saat menginisialisasi aplikasi. Beberapa fitur mungkin tidak berfungsi dengan baik.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Memuat aplikasi...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {initError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Peringatan</Text>
          <Text style={styles.errorText}>{initError}</Text>
          <View style={styles.errorButton}>
            <Text style={styles.errorButtonText} onPress={() => setInitError(null)}>
              Lanjutkan
            </Text>
          </View>
        </View>
      ) : (
        <AppNavigator />
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#555',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
  },
  errorButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  errorButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});