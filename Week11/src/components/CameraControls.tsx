import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type FlashModeValue = 'on' | 'off' | 'auto' | 'torch';

interface CameraControlsProps {
  onCapture: () => void;
  onFlipCamera: () => void;
  onToggleFlash: () => void;
  flashMode: FlashModeValue;
  isCapturing?: boolean;
}

export const CameraControls: React.FC<CameraControlsProps> = ({
  onCapture,
  onFlipCamera,
  onToggleFlash,
  flashMode,
  isCapturing = false,
}) => {
  const getFlashIconName = () => {
    switch (flashMode) {
      case 'on':
        return 'flash';
      case 'off':
        return 'flash-off';
      case 'auto':
        return 'flash-outline';
      case 'torch':
        return 'flashlight';
      default:
        return 'flash-off';
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.controlButton}
        onPress={onToggleFlash}
        disabled={isCapturing}
      >
        <Ionicons
          name={getFlashIconName()}
          size={30}
          color="#fff"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.captureButton}
        onPress={onCapture}
        disabled={isCapturing}
      >
        <View style={[
          styles.captureInner,
          isCapturing && styles.capturingInner
        ]} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.controlButton}
        onPress={onFlipCamera}
        disabled={isCapturing}
      >
        <Ionicons name="camera-reverse-outline" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '90%',
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  captureInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
  },
  capturingInner: {
    backgroundColor: '#ff4040',
  },
});