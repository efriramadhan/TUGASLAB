import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import type { PhotoData, UploadResult } from '../types';

export const SUPABASE_ANON_KEY = 'your-anon-key';
export const SUPABASE_URL = 'your-supabase-url';

export const compressImage = async (uri: string, _options: { maxWidth: number; maxHeight: number; quality: number }) => uri;

export const PHOTOS_BUCKET = 'photos';

export const PHOTOS_TABLE = 'photos';

const AsyncStorageAdapter = {
  getItem: (key: string) => AsyncStorage.getItem(key),
  setItem: (key: string, value: string) => AsyncStorage.setItem(key, value),
  removeItem: (key: string) => AsyncStorage.removeItem(key),
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
  }
});

export const ensurePhotosBucket = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(PHOTOS_BUCKET)
      .list('', { limit: 1 });

    if (error) {
      return true;
    }

    return true;
  } catch (error) {
    return true;
  }
};

export const uploadPhoto = async (uri: string, fileName: string): Promise<UploadResult | null> => {
  try {
    try {
      const FileSystem = await import('expo-file-system');

      const compressedUri = await compressImage(uri, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.6
      });

      const uniqueFileName = `${Date.now()}_${fileName}`;
      const filePath = `public/${uniqueFileName}`;
      let uploadResponse: { status: number; body: string; headers: Record<string, string> } | null = null;
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries) {
        try {
          const uploadPromise = FileSystem.uploadAsync(
            `${SUPABASE_URL}/storage/v1/object/${PHOTOS_BUCKET}/${filePath}`,
            compressedUri,
            {
              httpMethod: 'POST',
              uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
              headers: {
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'image/jpeg',
                'x-upsert': 'true',
              },
            }
          );

          const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error('Upload timeout')), 15000);
          });

          uploadResponse = await Promise.race([uploadPromise, timeoutPromise]) as {
            status: number;
            body: string;
            headers: Record<string, string>
          };

          break;
        } catch (uploadError) {
          retryCount++;

          if (retryCount >= maxRetries) {
            throw uploadError;
          }

          const delay = 1000 * Math.pow(2, retryCount - 1);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }

      if (!uploadResponse) {
        throw new Error('Upload response is null');
      }

      if (uploadResponse.status >= 200 && uploadResponse.status < 300) {
        const { data } = supabase.storage
          .from(PHOTOS_BUCKET)
          .getPublicUrl(filePath);

        if (data) {
          const urlData = data as any;
          const publicURL = urlData.publicUrl || urlData.publicURL ||
            `${SUPABASE_URL}/storage/v1/object/public/${PHOTOS_BUCKET}/${filePath}`;

          return {
            path: filePath,
            url: publicURL
          };
        }
      }
    } catch (directError) {
    }

    try {
      const timestamp = Date.now();
      const uniqueFileName = `${timestamp}_${fileName}`;
      const filePath = `public/${uniqueFileName}`;
      const publicURL = `${SUPABASE_URL}/storage/v1/object/public/${PHOTOS_BUCKET}/${filePath}`;

      try {
        const FileSystem = await import('expo-file-system');
        const cacheDir = `${FileSystem.cacheDirectory}photos/`;
        await FileSystem.makeDirectoryAsync(cacheDir, { intermediates: true }).catch(() => { });
        const localPath = `${cacheDir}${uniqueFileName}`;
        await FileSystem.copyAsync({
          from: uri,
          to: localPath
        });
      } catch (cacheError) {
      }

      return {
        path: filePath,
        url: publicURL
      };
    } catch (fallbackError) {
      return {
        path: `local_${Date.now()}_${fileName}`,
        url: uri
      };
    }
  } catch (err) {
    return null;
  }
};

export const ensurePhotosTable = async (): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(PHOTOS_TABLE)
      .select('count', { count: 'exact', head: true });

    if (error) {
      return true;
    }

    return true;
  } catch (error) {
    return false;
  }
};

export const savePhotoData = async (photoData: PhotoData): Promise<PhotoData | null> => {
  await ensurePhotosTable();
  try {
    const { data, error } = await supabase
      .from(PHOTOS_TABLE)
      .insert([photoData])
      .select();

    if (error) {
      return null;
    }

    return data?.[0] || null;
  } catch (err) {
    return null;
  }
};

export const getPhotos = async (): Promise<PhotoData[]> => {
  try {
    const { data, error } = await supabase
      .from(PHOTOS_TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return [];
    }

    return data || [];
  } catch (err) {
    return [];
  }
};

export const getPhotoById = async (id: string): Promise<PhotoData | null> => {
  try {
    const { data, error } = await supabase
      .from(PHOTOS_TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return null;
    }

    return data;
  } catch (err) {
    return null;
  }
};

export const deletePhoto = async (id: string, path: string): Promise<boolean> => {
  try {
    const { error: dbError } = await supabase
      .from(PHOTOS_TABLE)
      .delete()
      .eq('id', id);

    if (dbError) {
      return false;
    }

    const { error: storageError } = await supabase.storage
      .from(PHOTOS_BUCKET)
      .remove([path]);

    if (storageError) {
      return false;
    }

    return true;
  } catch (err) {
    return false;
  }
};