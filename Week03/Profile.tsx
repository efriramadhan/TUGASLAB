import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface ProfileProps {
  nama: string;
  umur: number;
}

const Profile: React.FC<ProfileProps> = ({ nama, umur }) => {
  return (
    <View style={styles.profileContainer}>
      <Text style={styles.title}>Profile Info</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Nama</Text>
        <Text style={styles.value}>{nama}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Umur</Text>
        <Text style={styles.value}>{umur} tahun</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'flex-start',
    width: '90%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: 'column',
    marginVertical: 5,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default Profile;
