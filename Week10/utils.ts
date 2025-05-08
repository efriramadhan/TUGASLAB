
import { Platform, Linking, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { StorageAccessFramework } from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const DOWNLOAD_DIRECTORY_URI_KEY = 'download_directory_uri';


export interface LocationData {
  longitude: number;
  latitude: number;
  altitude: number | null;
  accuracy: number | null;
  speed: number | null;
  timestamp: string;
}


export const formatTimestamp = (date: Date): string => {
  return date.toLocaleString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};


export const openInMaps = (latitude: number, longitude: number) => {
  const scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
  const url = Platform.OS === 'ios'
    ? `${scheme}?ll=${latitude},${longitude}&q=${latitude},${longitude}`
    : `${scheme}${latitude},${longitude}?q=${latitude},${longitude}`;

  Linking.canOpenURL(url).then(supported => {
    if (supported) {
      Linking.openURL(url);
    } else {
      const browserUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      Linking.openURL(browserUrl).catch(() => {
        Alert.alert('Error', 'Tidak dapat membuka peta');
      });
    }
  });
};





export const requestDownloadDirectoryPermission = async (
  downloadDirectoryUri: string | null,
  forceNew: boolean = false
): Promise<string | null> => {
  try {

    if (downloadDirectoryUri && !forceNew) {
      return downloadDirectoryUri;
    }

    if (forceNew) {
      Alert.alert(
        "Pilih Folder untuk Menyimpan",
        "Silakan pilih atau buat folder baru di dalam Downloads untuk menyimpan file. Folder utama Downloads tidak dapat digunakan langsung.",
        [{ text: "Mengerti" }]
      );
    }


    const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();

    if (permissions.granted) {

      const directoryUri = permissions.directoryUri;
      await AsyncStorage.setItem(DOWNLOAD_DIRECTORY_URI_KEY, directoryUri);
      return directoryUri;
    }

    return null;
  } catch (error) {
    console.error('Error requesting directory permission:', error);
    return null;
  }
};


export const clearSavedDirectoryUri = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(DOWNLOAD_DIRECTORY_URI_KEY);
  } catch (error) {
    console.error('Error clearing saved directory URI:', error);
  }
};


export const saveFileToDirectory = async (
  directoryUri: string,
  fileName: string,
  content: string
): Promise<boolean> => {
  try {

    const fileUri = await StorageAccessFramework.createFileAsync(
      directoryUri,
      fileName,
      'text/plain'
    );


    await StorageAccessFramework.writeAsStringAsync(fileUri, content);

    return true;
  } catch (error) {

    return false;
  }
};


export const saveFileToDownloadsFolder = async (
  fileName: string,
  content: string
): Promise<boolean> => {
  try {
    if (Platform.OS === 'android') {

      const downloadsUri = StorageAccessFramework.getUriForDirectoryInRoot('Download');


      const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync(downloadsUri);

      if (!permissions.granted) {
        return false;
      }


      const directoryUri = permissions.directoryUri;

      try {

        const fileUri = await StorageAccessFramework.createFileAsync(
          directoryUri,
          fileName,
          'text/plain'
        );


        await StorageAccessFramework.writeAsStringAsync(fileUri, content);

        return true;
      } catch (error) {
        console.error('Error saving file to Downloads folder:', error);
        return false;
      }
    }


    return false;
  } catch (error) {
    console.error('Error in saveFileToDownloadsFolder:', error);
    return false;
  }
};