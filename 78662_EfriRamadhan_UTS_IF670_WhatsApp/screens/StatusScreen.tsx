import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import styles from '../styles';

export default function StatusScreen({ navigation }: any) {
  const statuses = [
    { id: '1', name: 'Andi', time: '5 menit lalu', avatar: require('../assets/avatar1.png') },
    { id: '2', name: 'Budi', time: '15 menit lalu', avatar: require('../assets/avatar3.png') },
    { id: '3', name: 'Citra', time: '30 menit lalu', avatar: require('../assets/avatar2.png') },
  ];

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.statusItem} onPress={() => navigation.navigate('StatusViewer')}>
      <Image source={item.avatar} style={styles.statusAvatar} />
      <View style={styles.statusInfo}>
        <Text style={styles.statusName}>{item.name}</Text>
        <Text style={styles.statusTime}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.statusContainer}>
      <FlatList
        data={statuses}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}