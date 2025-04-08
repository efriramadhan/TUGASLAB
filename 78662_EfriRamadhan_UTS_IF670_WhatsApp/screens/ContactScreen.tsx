import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import styles from '../styles';

export default function ContactScreen({ navigation }: any) {
  const contacts = [
    { id: '1', name: 'Andi', status: 'Hey there!', avatar: require('../assets/avatar1.png') },
    { id: '2', name: 'Budi', status: 'Available', avatar: require('../assets/avatar3.png') },
    { id: '3', name: 'Citra', status: 'Busy', avatar: require('../assets/avatar2.png') },
  ];

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.contactItem} onPress={() => navigation.navigate('ChatDetail')}>
      <Image source={item.avatar} style={styles.contactAvatar} />
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactStatus}>{item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.contactContainer}>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}