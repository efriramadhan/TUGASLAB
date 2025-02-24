import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Counter from './Counter';
import Profile from './Profile';
import { useState } from 'react';

export default function App() {
  const [umur, setUmur] = useState(0);
  const [nama, setNama] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [namaTersimpan, setNamaTersimpan] = useState("");
  const [umurTersimpan, setUmurTersimpan] = useState(0);

  const tambahUmur = () => {
    setUmur(umur + 1);
  };

  const kurangiUmur = () => {
    if (umur > 0) {
      setUmur(umur - 1);
    }
  };

  const simpanNilai = () => {
    setNamaTersimpan(nama);
    setUmurTersimpan(umur);
    setShowProfile(true);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Masukkan nama Anda"
        value={nama}
        onChangeText={(text) => setNama(text)}
      />

      <Counter 
        umur={umur} 
        tambahUmur={tambahUmur} 
        kurangiUmur={kurangiUmur} 
        simpanNilai={simpanNilai} 
      />

      {showProfile && <Profile nama={namaTersimpan} umur={umurTersimpan} />}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    width: '90%',
    borderRadius: 5,
    backgroundColor: '#fff',
    fontSize: 18,
    marginBottom: 15,
  },
});

