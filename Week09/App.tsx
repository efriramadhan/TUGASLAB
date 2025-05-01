import { StatusBar } from "expo-status-bar";
import { Text, View, Image, Alert, SafeAreaView } from "react-native";
import { Animated, View as AnimatedView } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { Ionicons } from "@expo/vector-icons";
import { styles, colors } from "./styles";
import { Button } from "./components/Button";
import { saveImageToPictures } from "./utils/fileUtils";

export default function App() {
  const [uri, setUri] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      const cameraPermission =
        await ImagePicker.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();

      console.log("Camera permission:", cameraPermission.status);
      console.log("Media library permission:", mediaLibraryPermission.status);
    })();
  }, []);

  useEffect(() => {
    if (showSuccess) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setShowSuccess(false));
    }
  }, [showSuccess, fadeAnim]);

  const showSuccessNotification = (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
  };

  const openImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        setUri(selectedImage.uri);
        showSuccessNotification("Gambar berhasil dipilih");
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Gagal memilih gambar: " + error);
    }
  };

  const handleCameraLaunch = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const photo = result.assets[0];
        setUri(photo.uri);
        showSuccessNotification("Foto berhasil diambil");
      }
    } catch (error) {
      console.error("Error taking picture:", error);
      Alert.alert("Error", "Gagal mengambil foto: " + error);
    }
  };

  const saveImage = async () => {
    if (!uri) {
      Alert.alert("Peringatan", "Tidak ada gambar yang dipilih untuk disimpan");
      return;
    }

    try {
      const success = await saveImageToPictures(uri);

      if (success) {
        showSuccessNotification("Gambar berhasil disimpan ke galeri");
      }
    } catch (error) {
      console.error("Error saving image:", error);
      Alert.alert("Error", "Gagal menyimpan gambar: " + error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Kamera & Galeri</Text>
        <Text style={styles.subtitle}>
          Ambil, pilih, dan simpan foto dengan mudah
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Buka Kamera"
          onPress={handleCameraLaunch}
          color={colors.primary}
          icon="camera-outline"
        />
        <Button
          title="Buka Galeri"
          onPress={openImagePicker}
          color={colors.secondary}
          icon="images-outline"
        />
        <Button
          title="Simpan Gambar"
          onPress={saveImage}
          color={colors.accent}
          icon="save-outline"
        />
      </View>

      <View style={styles.imageContainer}>
        {uri ? (
          <Image source={{ uri }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.noImageContainer}>
            <Ionicons name="image-outline" size={50} color={colors.textLight} />
            <Text style={styles.noImageText}>
              Belum ada gambar yang dipilih
            </Text>
          </View>
        )}
      </View>

      {showSuccess && (
        <AnimatedView style={[styles.successMessage, { opacity: fadeAnim }]}>
          <Ionicons name="checkmark-circle" size={24} color={colors.white} />
          <Text style={styles.successText}>{successMessage}</Text>
        </AnimatedView>
      )}

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
