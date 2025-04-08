import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../styles';

export default function ProfileScreen() {
  const [name, setName] = useState('WBI');
  const [about, setAbout] = useState('Do you like my status?');
  const [phone] = useState('+62 •••• ••••');
  const [instagram, setInstagram] = useState('wabetainfo');

  const handleSave = () => {
    alert('Profil disimpan!');
  };

  return (
    <ScrollView contentContainerStyle={styles.profileContainer}>
      <View style={{ alignItems: 'center' }}>
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }}
          style={styles.profileAvatar}
        />
        <TouchableOpacity style={styles.editAvatarButton}>
          <Ionicons name="camera" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileItem}>
        <Ionicons name="person-outline" size={20} color="#555" />
        <View style={styles.profileTextGroup}>
          <Text style={styles.profileLabel}>Name</Text>
          <TextInput
            style={styles.profileInput}
            value={name}
            onChangeText={setName}
          />
        </View>
      </View>

      <View style={styles.profileItem}>
        <Ionicons name="information-circle-outline" size={20} color="#555" />
        <View style={styles.profileTextGroup}>
          <Text style={styles.profileLabel}>About</Text>
          <TextInput
            style={styles.profileInput}
            value={about}
            onChangeText={setAbout}
          />
        </View>
      </View>

      <View style={styles.profileItem}>
        <Ionicons name="call-outline" size={20} color="#555" />
        <View style={styles.profileTextGroup}>
          <Text style={styles.profileLabel}>Phone</Text>
          <Text style={styles.profileValue}>{phone}</Text>
        </View>
      </View>

      <View style={styles.profileItem}>
        <Ionicons name="link-outline" size={20} color="#555" />
        <View style={styles.profileTextGroup}>
          <Text style={styles.profileLabel}>Instagram</Text>
          <TextInput
            style={styles.profileInput}
            value={instagram}
            onChangeText={setInstagram}
            placeholder="Username Instagram"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.profileButton} onPress={handleSave}>
        <Text style={styles.profileButtonText}>Simpan</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
