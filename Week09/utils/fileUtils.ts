import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Alert } from "react-native";

export const saveImageToPictures = async (uri: string): Promise<boolean> => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Izin Ditolak",
        "Aplikasi membutuhkan izin untuk menyimpan gambar ke galeri."
      );
      return false;
    }

    const asset = await MediaLibrary.createAssetAsync(uri);

    const albums = await MediaLibrary.getAlbumsAsync();
    const picturesAlbum =
      albums.find((album) => album.title === "Pictures") ||
      albums.find((album) => album.title === "DCIM");

    if (picturesAlbum) {
      await MediaLibrary.addAssetsToAlbumAsync(
        [asset],
        picturesAlbum.id,
        false
      );
      console.log("Gambar berhasil disimpan ke album Pictures");
    } else {
      console.log("Album Pictures tidak ditemukan, gambar disimpan ke galeri");
    }

    return true;
  } catch (error) {
    console.error("Error saving image:", error);
    Alert.alert("Error", "Gagal menyimpan gambar: " + error);
    return false;
  }
};
