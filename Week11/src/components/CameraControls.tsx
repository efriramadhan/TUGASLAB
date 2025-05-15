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
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.controlButton}
        onPress={onToggleFlash}
      >
        <Ionicons
          name={flashMode === 'on' ? 'flash' : 'flash-off'}
          size={28}
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
      >
        <Ionicons name="camera-reverse" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  captureInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#fff',
  },
  capturingInner: {
    backgroundColor: '#ff4040',
  },
});