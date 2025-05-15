import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CameraView as ExpoCamera } from 'expo-camera';

interface CameraViewProps {
  cameraRef: React.RefObject<any>;
  type: 'front' | 'back';
  flashMode: 'on' | 'off' | 'auto' | 'torch';
  children?: React.ReactNode;
}

export const CameraView: React.FC<CameraViewProps> = ({
  cameraRef,
  type,
  flashMode,
  children,
}) => {
  const cameraFlash = flashMode === 'torch' ? 'on' : flashMode;

  return (
    <React.Fragment>
      <ExpoCamera
        ref={cameraRef}
        style={styles.camera}
        facing={type}
        flash={cameraFlash}
      />

      <View style={styles.childrenContainer}>
        {children}
      </View>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  childrenContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
});