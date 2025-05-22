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
        <Ionicons name="images-outline" size={100} color="#A9A9A9" />
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
    padding: 24,
  },

  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#222',
    marginBottom: 12,
    marginTop: 24,
    textAlign: 'center',
  },
  message: {
    fontSize: 17,
    color: '#555',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    marginTop: 16,
  },
});