import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import styles from '../styles';

export default function LoginScreen({ navigation }: any) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.loginContainer}>
      <Image
        source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg' }}
        style={styles.loginLogo}
      />
      <Text style={styles.loginTitle}>Login to WhatsApp</Text>

      <TextInput
        style={styles.input}
        placeholder="Nomor Telepon"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.loginButton} onPress={() => navigation.replace('Main')}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerText}>
          Belum punya akun? <Text style={styles.registerLink}>Daftar Sekarang</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
