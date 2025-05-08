

import { StatusBar } from 'expo-status-bar';
import {
  Text,
  View,
  Platform,
  Alert,
  ScrollView,
  Image,
  ToastAndroid,
  SafeAreaView,
  Linking
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { styles } from './styles';

import { ActionButton, CurrentLocationCard, LocationHistoryCard } from './components';


import {
  DOWNLOAD_DIRECTORY_URI_KEY,
  requestDownloadDirectoryPermission as requestDownloadPermission,
  clearSavedDirectoryUri,
  saveFileToDirectory,
  saveFileToDownloadsFolder
} from './utils';
import React from 'react';

export default function App() {
  const [coords, setCoords] = useState({ longitude: 0, latitude: 0, altitude: 0, speed: 0, accuracy: 0 });
  const [locationAvailable, setLocationAvailable] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [locationHistory, setLocationHistory] = useState<Array<{
    longitude: number;
    latitude: number;
    altitude: number;
    speed: number;
    accuracy: number;
    timestamp: string;
  }>>([]);
  const [timestamp, setTimestamp] = useState<Date | null>(null);
  const [saveCount, setSaveCount] = useState(0);
  const [downloadDirectoryUri, setDownloadDirectoryUri] = useState<string | null>(null);

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    (async () => {
      const locationPerm = await hasLocationPermission();
      setLocationPermission(locationPerm);


      try {
        const savedUri = await AsyncStorage.getItem(DOWNLOAD_DIRECTORY_URI_KEY);
        if (savedUri) {
          setDownloadDirectoryUri(savedUri);
        }
      } catch (error) {
        console.error('Error loading saved directory URI:', error);
      }
    })();
  }, []);


  const requestDownloadDirectoryPermission = async (forceNew: boolean = false): Promise<string | null> => {
    const directoryUri = await requestDownloadPermission(downloadDirectoryUri, forceNew);
    if (directoryUri) {
      setDownloadDirectoryUri(directoryUri);
    }
    return directoryUri;
  };


  const saveFileToDownloads = async (fileName: string, content: string): Promise<boolean> => {
    try {

      const success = await saveFileToDownloadsFolder(fileName, content);

      if (success) {
        return true;
      }


      const isFirstTime = !downloadDirectoryUri;


      if (isFirstTime) {
        Alert.alert(
          "Petunjuk Penyimpanan",
          "Untuk menyimpan file:\n\n" +
          "1. Pilih folder di dalam Downloads atau buat folder baru\n" +
          "2. Folder utama Downloads tidak dapat digunakan langsung\n" +
          "3. Setelah memilih folder, file akan disimpan otomatis",
          [{ text: "Lanjutkan" }]
        );
      }


      let directoryUri = await requestDownloadDirectoryPermission(isFirstTime);

      if (!directoryUri) {
        Alert.alert(
          "Izin Diperlukan",
          "Aplikasi memerlukan izin untuk menyimpan file.",
          [{ text: "OK" }]
        );
        return false;
      }

      try {

        const success = await saveFileToDirectory(directoryUri, fileName, content);

        if (success) {
          return true;
        } else {
          throw new Error("Gagal menyimpan file");
        }
      } catch (firstError) {

        if (!isFirstTime) {

          await clearSavedDirectoryUri();
          setDownloadDirectoryUri(null);


          Alert.alert(
            "Folder Tidak Dapat Diakses",
            "Folder yang dipilih sebelumnya tidak dapat diakses. Silakan pilih folder lain di dalam Downloads atau buat folder baru.",
            [{ text: "Lanjutkan" }]
          );

          directoryUri = await requestDownloadDirectoryPermission(true);

          if (!directoryUri) {
            return false;
          }


          return await saveFileToDirectory(directoryUri, fileName, content);
        } else {
          throw firstError;
        }
      }
    } catch (error) {

      return false;
    }
  };

  const hasLocationPermission = async () => {
    if (Platform.OS === "android" && Platform.Version < 23) {
      return true;
    }

    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
      Alert.alert(
        "Izin Lokasi Ditolak",
        "Aplikasi memerlukan izin lokasi untuk berfungsi dengan baik.",
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
      );
    }

    return false;
  };

  const getLocation = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      Alert.alert(
        "Izin Diperlukan",
        "Aplikasi memerlukan izin lokasi untuk mendapatkan koordinat.",
        [
          { text: "Batal", style: "cancel" },
          { text: "Pengaturan", onPress: () => Linking.openSettings() }
        ]
      );
      return;
    }

    try {
      setIsLoading(true);

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 10000,
        distanceInterval: 0,
      });

      const newCoords = {
        longitude: location.coords.longitude,
        latitude: location.coords.latitude,
        altitude: location.coords.altitude || 0,
        speed: location.coords.speed || 0,
        accuracy: location.coords.accuracy || 0
      };

      setCoords(newCoords);
      setTimestamp(new Date(location.timestamp));
      setLocationAvailable(true);


      setLocationHistory(prevHistory => [
        ...prevHistory,
        {
          ...newCoords,
          timestamp: new Date(location.timestamp).toLocaleString()
        }
      ]);


      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);

    } catch (error: any) {
      Alert.alert("Error", "Gagal mendapatkan lokasi: " + (error.message || 'Unknown error'));
      console.error('Error getting location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveLocationToFile = async () => {
    if (!locationAvailable) {
      Alert.alert("Peringatan", "Tidak ada data lokasi untuk disimpan.");
      return;
    }

    try {
      setIsLoading(true);

      const currentDate = new Date().toLocaleString().replace(/[/\\?%*:|"<>]/g, '-');
      const fileName = `GeoLocation_${currentDate}.txt`;

      let fileContent = "=== DATA GEOLOKASI ===\n\n";
      fileContent += `Nama: Axel Reginald Wiranto\n`;
      fileContent += `NIM: 00000078456\n`;
      fileContent += `Waktu Pengambilan: ${new Date().toLocaleString()}\n\n`;

      fileContent += "=== RIWAYAT LOKASI ===\n\n";

      locationHistory.forEach((loc, index) => {
        fileContent += `--- Lokasi #${index + 1} ---\n`;
        fileContent += `Waktu: ${loc.timestamp}\n`;
        fileContent += `Longitude: ${loc.longitude.toFixed(6)}\n`;
        fileContent += `Latitude: ${loc.latitude.toFixed(6)}\n`;
        fileContent += `Altitude: ${loc.altitude ? loc.altitude.toFixed(2) + ' m' : 'Tidak tersedia'}\n`;
        fileContent += `Kecepatan: ${loc.speed ? loc.speed.toFixed(2) + ' m/s' : 'Tidak tersedia'}\n`;
        fileContent += `Akurasi: ${loc.accuracy ? loc.accuracy.toFixed(2) + ' m' : 'Tidak tersedia'}\n\n`;
      });


      const tempFilePath = FileSystem.documentDirectory + fileName;
      await FileSystem.writeAsStringAsync(tempFilePath, fileContent);

      if (Platform.OS === 'android') {
        try {

          if (Platform.Version >= 30) {

            Alert.alert(
              "Pilih Metode Penyimpanan",
              "Pilih salah satu metode untuk menyimpan file geolokasi:",
              [
                {
                  text: "Simpan ke Downloads",
                  onPress: async () => {
                    try {

                      const success = await saveFileToDownloads(fileName, fileContent);

                      if (success) {
                        setSaveCount(prev => prev + 1);


                        Alert.alert(
                          "Berhasil Disimpan",
                          `File ${fileName} berhasil disimpan ke folder Downloads.\n\nFile dapat diakses melalui aplikasi File Manager di perangkat Anda.`,
                          [{ text: "OK" }]
                        );
                      } else {

                        if (await Sharing.isAvailableAsync()) {

                          await Clipboard.setStringAsync(fileContent);


                          await Sharing.shareAsync(tempFilePath, {
                            mimeType: 'text/plain',
                            dialogTitle: 'Simpan File Geolokasi ke Downloads',
                            UTI: 'public.plain-text'
                          });

                          setSaveCount(prev => prev + 1);


                          Alert.alert(
                            "Petunjuk Penyimpanan",
                            "Untuk menyimpan file ke folder Downloads:\n\n" +
                            "1. Pada dialog yang muncul, pilih aplikasi 'Drive' atau 'Files by Google'\n" +
                            "2. Pilih lokasi penyimpanan 'Download'\n" +
                            "3. Tekan 'Simpan' untuk konfirmasi\n\n" +
                            "Jika tidak melihat opsi penyimpanan, konten sudah disalin ke clipboard.",
                            [{ text: "Mengerti" }]
                          );
                        }
                      }
                    } catch (error: any) {

                      await clearSavedDirectoryUri();
                      setDownloadDirectoryUri(null);


                      Alert.alert(
                        "Folder Tidak Dapat Diakses",
                        "Folder yang dipilih tidak dapat digunakan untuk menyimpan file.\n\nSilakan pilih atau buat folder baru di dalam Downloads pada percobaan berikutnya. Jangan pilih folder utama Downloads.",
                        [{ text: "Mengerti" }]
                      );
                    }
                  }
                },
                {
                  text: "Lihat Konten File",
                  onPress: async () => {
                    try {

                      Alert.alert(
                        "Konten File",
                        fileContent.length > 1000
                          ? fileContent.substring(0, 1000) + "...\n\n(Konten terlalu panjang untuk ditampilkan seluruhnya)"
                          : fileContent,
                        [{ text: "OK" }]
                      );
                    } catch (error) {
                      console.error('Error displaying file content:', error);
                      Alert.alert(
                        "Gagal Menampilkan Konten",
                        "Terjadi kesalahan saat mencoba menampilkan konten file.",
                        [{ text: "OK" }]
                      );
                    }
                  }
                },
                {
                  text: "Salin & Buka Google Keep",
                  onPress: async () => {
                    try {

                      await Clipboard.setStringAsync(fileContent);


                      Alert.alert(
                        "Konten Disalin ke Clipboard",
                        "Konten file telah otomatis disalin ke clipboard. Anda dapat langsung menempelkannya di Google Keep.\n\nApakah Anda ingin membuka Google Keep sekarang?",
                        [
                          {
                            text: "Buka Google Keep",
                            onPress: async () => {
                              try {

                                const keepAppUrl = `https://keep.google.com`;
                                await Linking.openURL(keepAppUrl);


                                ToastAndroid.show(
                                  "Konten sudah disalin. Tempel (paste) di Google Keep.",
                                  ToastAndroid.LONG
                                );
                              } catch (error) {
                                console.error('Error opening Google Keep:', error);
                                Alert.alert(
                                  "Gagal Membuka Google Keep",
                                  "Terjadi kesalahan saat mencoba membuka Google Keep. Silakan buka Google Keep secara manual dan tempel konten yang sudah disalin.",
                                  [{ text: "OK" }]
                                );
                              }
                            }
                          },
                          { text: "Nanti Saja", style: "cancel" }
                        ]
                      );
                    } catch (error) {
                      console.error('Error copying to clipboard:', error);
                      Alert.alert(
                        "Gagal Menyalin ke Clipboard",
                        "Terjadi kesalahan saat mencoba menyalin konten file. Silakan coba lagi nanti.",
                        [{ text: "OK" }]
                      );
                    }
                  }
                },
                { text: "Batal", style: "cancel" }
              ]
            );
          } else {

            if (await Sharing.isAvailableAsync()) {
              Alert.alert(
                "Pilih Metode Penyimpanan",
                "Pilih salah satu metode untuk menyimpan file geolokasi:",
                [
                  {
                    text: "Simpan ke Downloads",
                    onPress: async () => {
                      try {

                        await Clipboard.setStringAsync(fileContent);


                        await Sharing.shareAsync(tempFilePath, {
                          mimeType: 'text/plain',
                          dialogTitle: 'Simpan File Geolokasi ke Downloads',
                          UTI: 'public.plain-text'
                        });

                        setSaveCount(prev => prev + 1);


                        Alert.alert(
                          "Petunjuk Penyimpanan",
                          "Untuk menyimpan file ke folder Downloads:\n\n" +
                          "1. Pada dialog yang muncul, pilih aplikasi 'Drive' atau 'Files by Google'\n" +
                          "2. Pilih lokasi penyimpanan 'Download'\n" +
                          "3. Tekan 'Simpan' untuk konfirmasi\n\n" +
                          "Jika tidak melihat opsi penyimpanan, konten sudah disalin ke clipboard.",
                          [{ text: "Mengerti" }]
                        );
                      } catch (error) {
                        console.error('Error in file sharing process:', error);
                        Alert.alert(
                          "Gagal Menyimpan File",
                          "Terjadi kesalahan saat mencoba menyimpan file. Silakan coba lagi nanti.",
                          [{ text: "OK" }]
                        );
                      }
                    }
                  },
                  {
                    text: "Lihat Konten File",
                    onPress: async () => {
                      try {

                        Alert.alert(
                          "Konten File",
                          fileContent.length > 1000
                            ? fileContent.substring(0, 1000) + "...\n\n(Konten terlalu panjang untuk ditampilkan seluruhnya)"
                            : fileContent,
                          [{ text: "OK" }]
                        );
                      } catch (error) {
                        console.error('Error displaying file content:', error);
                        Alert.alert(
                          "Gagal Menampilkan Konten",
                          "Terjadi kesalahan saat mencoba menampilkan konten file.",
                          [{ text: "OK" }]
                        );
                      }
                    }
                  },
                  {
                    text: "Salin & Buka Google Keep",
                    onPress: async () => {
                      try {

                        await Clipboard.setStringAsync(fileContent);


                        Alert.alert(
                          "Konten Disalin ke Clipboard",
                          "Konten file telah otomatis disalin ke clipboard. Anda dapat langsung menempelkannya di Google Keep.\n\nApakah Anda ingin membuka Google Keep sekarang?",
                          [
                            {
                              text: "Buka Google Keep",
                              onPress: async () => {
                                try {

                                  const keepAppUrl = `https://keep.google.com`;
                                  await Linking.openURL(keepAppUrl);


                                  ToastAndroid.show(
                                    "Konten sudah disalin. Tempel (paste) di Google Keep.",
                                    ToastAndroid.LONG
                                  );
                                } catch (error) {
                                  console.error('Error opening Google Keep:', error);
                                  Alert.alert(
                                    "Gagal Membuka Google Keep",
                                    "Terjadi kesalahan saat mencoba membuka Google Keep. Silakan buka Google Keep secara manual dan tempel konten yang sudah disalin.",
                                    [{ text: "OK" }]
                                  );
                                }
                              }
                            },
                            { text: "Nanti Saja", style: "cancel" }
                          ]
                        );
                      } catch (error) {
                        console.error('Error copying to clipboard:', error);
                        Alert.alert(
                          "Gagal Menyalin ke Clipboard",
                          "Terjadi kesalahan saat mencoba menyalin konten file. Silakan coba lagi nanti.",
                          [{ text: "OK" }]
                        );
                      }
                    }
                  },
                  { text: "Batal", style: "cancel" }
                ]
              );
            } else {

              Alert.alert(
                "Informasi",
                "Fitur berbagi tidak tersedia di perangkat ini. Untuk menyimpan file ke Downloads, gunakan development build aplikasi.",
                [
                  {
                    text: "Pelajari Lebih Lanjut",
                    onPress: () => Linking.openURL("https://docs.expo.dev/develop/development-builds/create-a-build")
                  },
                  { text: "OK", style: "cancel" }
                ]
              );
            }
          }
        } catch (error) {
          console.error('Error in file saving process:', error);
          Alert.alert(
            "Gagal Menyimpan File",
            "Terjadi kesalahan saat mencoba menyimpan file. Silakan coba lagi nanti.",
            [{ text: "OK" }]
          );
        }
      } else if (Platform.OS === 'ios') {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(tempFilePath, {
            mimeType: 'text/plain',
            dialogTitle: 'Simpan File Geolokasi',
            UTI: 'public.plain-text'
          });

          setSaveCount(prev => prev + 1);
          Alert.alert("Sukses", `File ${fileName} siap disimpan. Pilih "Save" untuk menyimpan ke perangkat Anda.`);
        }
      } else {
        Alert.alert(
          "Informasi",
          "Fitur berbagi tidak tersedia di perangkat ini. Untuk menyimpan file, gunakan development build aplikasi.",
          [
            {
              text: "Pelajari Lebih Lanjut",
              onPress: () => Linking.openURL("https://docs.expo.dev/develop/development-builds/create-a-build")
            },
            { text: "OK", style: "cancel" }
          ]
        );
      }
    } catch (error: any) {
      Alert.alert("Error", "Gagal menyimpan file: " + (error.message || 'Unknown error'));
      console.error('Error saving file:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    Alert.alert(
      "Konfirmasi",
      "Apakah Anda yakin ingin menghapus semua riwayat lokasi?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: () => {
            setLocationHistory([]);
            setLocationAvailable(false);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.container}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          ref={scrollViewRef}
        >
          <View style={styles.header}>
            <Image
              source={require('./assets/location-icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>GeoLocation Tracker</Text>
            <Text style={styles.subtitle}>Axel Reginald Wiranto - 00000078456</Text>
          </View>

          <View style={styles.buttonGroup}>
            <ActionButton
              title="Ambil Lokasi"
              onPress={getLocation}
              type="primary"
              disabled={!locationPermission}
              isLoading={isLoading}
            />

            <ActionButton
              title="Simpan ke File"
              onPress={saveLocationToFile}
              type="secondary"
              disabled={!locationAvailable}
              isLoading={isLoading}
            />

            {locationHistory.length > 0 && (
              <ActionButton
                title="Hapus Riwayat"
                onPress={clearHistory}
                type="danger"
                disabled={isLoading}
              />
            )}
          </View>


          {locationAvailable && timestamp && (
            <CurrentLocationCard
              currentLocation={{
                longitude: coords.longitude,
                latitude: coords.latitude,
                altitude: coords.altitude || null,
                accuracy: coords.accuracy || null,
                speed: coords.speed || null,
                timestamp: timestamp.toLocaleString()
              }}
              isLoading={isLoading}
            />
          )}


          {locationHistory.length > 0 && (
            <LocationHistoryCard
              locationHistory={locationHistory.map(loc => ({
                longitude: loc.longitude,
                latitude: loc.latitude,
                altitude: loc.altitude || null,
                accuracy: loc.accuracy || null,
                speed: loc.speed || null,
                timestamp: loc.timestamp
              }))}
              onClearHistory={clearHistory}
              saveCount={saveCount}
            />
          )}
        </ScrollView>

        <StatusBar style="light" />
      </LinearGradient>
    </SafeAreaView>
  );
}

