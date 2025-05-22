import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { LocationData } from '../types';

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  if (Platform.OS === 'ios') {
    try {
      token = (await Notifications.getExpoPushTokenAsync({
        projectId: 'your-project-id',
      })).data;
    } catch (error) {
      
    }
  }

  return token;
}

export async function configureNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  await registerForPushNotificationsAsync();
}

export async function sendUploadSuccessNotification(latitude: number, longitude: number, photoUrl: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Upload Berhasil',
      body: `Foto berhasil diunggah ke server.\nLatitude: ${latitude}\nLongitude: ${longitude}`,
      data: { photoUrl, latitude, longitude },
    },
    trigger: null,
  });
}

export async function sendUploadFailureNotification(latitude: number, longitude: number) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Upload Gagal',
      body: `Foto berhasil diambil tetapi gagal diunggah ke server.\nLatitude: ${latitude}\nLongitude: ${longitude}`,
      data: { latitude, longitude },
    },
    trigger: null,
  });
}

export async function sendSaveSuccessNotification(latitude: number, longitude: number, photoId: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Penyimpanan Berhasil',
      body: `Foto berhasil disimpan ke database.\nLatitude: ${latitude}\nLongitude: ${longitude}`,
      data: { photoId, latitude, longitude },
    },
    trigger: null,
  });
}

export async function sendSaveFailureNotification(latitude: number, longitude: number) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Penyimpanan Gagal',
      body: `Foto berhasil diambil tetapi gagal menyimpan data ke database.\nLatitude: ${latitude}\nLongitude: ${longitude}`,
      data: { latitude, longitude },
    },
    trigger: null,
  });
}

export async function sendDeleteSuccessNotification(latitude: number, longitude: number) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Penghapusan Berhasil',
      body: `Foto berhasil dihapus dari database dan storage.\nLatitude: ${latitude}\nLongitude: ${longitude}`,
      data: { latitude, longitude },
    },
    trigger: null,
  });
}

export async function sendDeleteFailureNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Penghapusan Gagal',
      body: 'Gagal menghapus foto. Silakan coba lagi.',
    },
    trigger: null,
  });
}

export async function sendLocationCaptureNotification(location: LocationData) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Lokasi Tertangkap',
      body: `Lokasi saat ini:\nLatitude: ${location.latitude}\nLongitude: ${location.longitude}`,
      data: { location },
    },
    trigger: null,
  });
}