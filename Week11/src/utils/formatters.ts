export const formatDate = (dateString: string, short: boolean = false): string => {
    const date = new Date(dateString);
  
    if (short) {
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    }
  
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  export const formatCoordinate = (coordinate: number, decimals: number = 7): string => {
    return coordinate.toFixed(decimals);
  };
  
  export const getFileNameFromUri = (uri: string): string => {
    return uri.split('/').pop() || `photo_${Date.now()}.jpg`;
  };
  
  export const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
  };