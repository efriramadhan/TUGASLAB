import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../styles';

export default function CallScreen() {
  const callLogs = [
    { id: '1', name: 'Andi', time: 'Hari ini, 08:12', type: 'incoming', avatar: require('../assets/avatar1.png') },
    { id: '2', name: 'Budi', time: 'Kemarin, 19:45', type: 'outgoing', avatar: require('../assets/avatar3.png') },
    { id: '3', name: 'Citra', time: 'Kemarin, 17:20', type: 'missed', avatar: require('../assets/avatar2.png') },
  ];

  const renderItem = ({ item }: any) => (
    <View style={styles.callItem}>
      <Image source={item.avatar} style={styles.callAvatar} />
      <View style={styles.callInfo}>
        <Text style={styles.callName}>{item.name}</Text>
        <View style={styles.callDetails}>
          <Ionicons
            name={item.type === 'incoming' ? 'arrow-down' : item.type === 'outgoing' ? 'arrow-up' : 'close'}
            size={16}
            color={item.type === 'missed' ? 'red' : '#25D366'}
          />
          <Text style={styles.callTime}>{item.time}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.callButton}>
        <Ionicons name="call" size={24} color="#128C7E" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.callContainer}>
      <FlatList
        data={callLogs}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}