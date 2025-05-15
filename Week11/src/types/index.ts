export interface PhotoData {
    id?: string;
    latitude: number;
    longitude: number;
    photo_url: string;
    created_at?: string;
  }
  
  export interface SupabaseResponse<T> {
    data: T | null;
    error: Error | null;
  }
  
  export interface LocationData {
    latitude: number;
    longitude: number;
    accuracy?: number;
    altitude?: number | null;
    heading?: number | null;
    speed?: number | null;
    altitudeAccuracy?: number | null;
    timestamp?: number;
  }
  
  export interface UploadResult {
    path: string;
    url: string;
  }
  
  export type RootStackParamList = {
    Home: undefined;
    Camera: undefined;
    PhotoDetail: { photoId: string };
    PhotoHistory: undefined;
  };