import styles from './App.style';
import React from 'react';
import {View, Text, Button} from 'react-native';

const HomeScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text>Navigation List</Text>
      <Button
        title="Email"
        onPress={() => navigation.navigate("Email")}
      />
    </View>
  );
};

export default HomeScreen;