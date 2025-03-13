import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import data from './data.json';
import styles from './App.styles';
import React from 'react';

const UserList = ({ navigation }) => {
  return (
    <ScrollView>
      {data.map((user) => {
        return (
          <View style={styles.container} key={user.email}>
            <TouchableOpacity 
              style={styles.card} 
              onPress={() => navigation.navigate("Profile", { user: user })}
            >
              <Image source={{ uri: user.photo_url }} style={styles.avatar} />
              <View>
                <Text style={styles.boldText}>{user.name}</Text>
                <Text>{user.email}</Text>
              </View>
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );
}

export default UserList;