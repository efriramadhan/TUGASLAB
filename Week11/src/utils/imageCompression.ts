import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

export interface CompressImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

/**
 * Mengompresi gambar untuk mengurangi ukuran file
 */
export const compressImage = async (
  uri: string,
  options: CompressImageOptions = {}
): Promise<string> => {
  try {
    const {
      maxWidth = 1200,
      maxHeight = 1200,
      quality = 0.6
    } = options;

    const fileInfo = await FileSystem.getInfoAsync(uri);
    
    if (!fileInfo.exists) {
      return uri;
    }

    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: maxWidth, height: maxHeight } }],
      { compress: quality, format: ImageManipulator.SaveFormat.JPEG }
    );

    return manipResult.uri;
  } catch (error) {
    return uri;
  }
};

/**
 * Mengompresi gambar dan mengembalikan ukuran file sebelum dan sesudah kompresi
 */
export const compressImageWithStats = async (
  uri: string,
  options: CompressImageOptions = {}
): Promise<{ uri: string; originalSize: number; compressedSize: number }> => {
  try {
    const originalInfo = await FileSystem.getInfoAsync(uri, { size: true });
    const originalSize = 'size' in originalInfo && originalInfo.size ? originalInfo.size : 0;

    const compressedUri = await compressImage(uri, options);
    
    if (compressedUri === uri) {
      return { uri, originalSize, compressedSize: originalSize };
    }

    const compressedInfo = await FileSystem.getInfoAsync(compressedUri, { size: true });
    const compressedSize = 'size' in compressedInfo && compressedInfo.size ? compressedInfo.size : 0;

    return {
      uri: compressedUri,
      originalSize,
      compressedSize
    };
  } catch (error) {
    return { uri, originalSize: 0, compressedSize: 0 };
  }
};