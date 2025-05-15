import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  message: string;
  buttonTitle?: string;
  onButtonPress?: () => void;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  buttonTitle,
  onButtonPress,
  icon,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {icon || (
        <Ionicons name="images-outline" size={80} color="#CCCCCC" />
      )}

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>

      {buttonTitle && onButtonPress && (
        <Button
          title={buttonTitle}
          onPress={onButtonPress}
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    marginTop: 8,
  },
});