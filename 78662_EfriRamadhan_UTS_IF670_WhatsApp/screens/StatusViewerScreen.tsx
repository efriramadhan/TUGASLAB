import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StatusBar } from 'react-native';
import styles from '../styles';

export default function StatusViewerScreen({ navigation }: any) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.goBack();
    }, 5000); // otomatis kembali setelah 5 detik

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.statusViewerContainer}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      <Image
        source={{ uri: 'https://via.placeholder.com/500' }}
        style={styles.statusViewerImage}
      />

      <View style={styles.statusViewerHeader}>
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }}
          style={styles.statusViewerAvatar}
        />
        <Text style={styles.statusViewerName}>Andi</Text>
      </View>

      <TouchableOpacity style={styles.statusViewerClose} onPress={() => navigation.goBack()}>
        <Text style={styles.statusViewerCloseText}>×</Text>
      </TouchableOpacity>
    </View>
  );
}
