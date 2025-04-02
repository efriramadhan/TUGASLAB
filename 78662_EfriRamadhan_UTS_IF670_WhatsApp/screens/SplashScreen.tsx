import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import styles from '../styles';

export default function SplashScreen({ navigation }: any) {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Login');
    }, 3000); // 3 detik delay ke halaman login
  }, [navigation]);

  return (
    <View style={styles.splashContainer}>
      <Image
        source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg' }}
        style={styles.splashLogo}
      />
      <Text style={styles.splashText}>WhatsApp Clone</Text>
    </View>
  );
}
