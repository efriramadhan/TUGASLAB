import { Button, Text, View, Image, StyleSheet } from 'react-native';
import React from 'react';

const Profile = ({ navigation, route }) => {
  const { user } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      
      <View style={styles.profileContent}>
        <Image source={{ uri: user.image }} style={styles.profileImage} />
        <Text style={styles.profileName}>{user.name}'s Profile</Text>
        <Text style={styles.profileEmail}>{user.nim}</Text>
        <Button
          title="GO BACK"
          onPress={() => navigation.goBack()}
          color="#2196F3"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    marginLeft: 20,
    fontWeight: 'bold',
  },
  profileContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
});

export default Profile;