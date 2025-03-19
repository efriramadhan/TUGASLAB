import { StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import Input from './Input';

export default function App() {
  const [name, setName] = useState('');
  const [nim, setNim] = useState('');
  
  return (
    <View style={styles.container}>
      <Text>{name} - {nim || "" }</Text>
      
      <View style={styles.inputsContainer}>
        <Input 
          label="Name" 
          placeholder="Input your name" 
          value={name}
          onChangeText={setName} 
        />
        
        <Input 
          label="NIM" 
          placeholder="Input your NIM" 
          value={nim}
          onChangeText={setNim} 
          keyboardType="numeric" 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputsContainer: {
    width: '80%',
    marginTop: 20,
  }
});