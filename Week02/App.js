import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Tugas02 from './Tugas02';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text2}>Tugas Week 02</Text>
      <Text style={styles.text}>Efri Ramadhan - 00000078662</Text>
      <StatusBar style="auto" />

      <Tugas02 />
      
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

  text: {
    fontSize: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  text2: {
    fontSize: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    marginBottom: 20,
  },
});
