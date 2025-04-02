import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles';

export default function ChatListScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat List</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ChatDetail')}
      >
        <Text style={styles.buttonText}>Pergi ke Chat Detail</Text>
      </TouchableOpacity>
    </View>
  );
}
