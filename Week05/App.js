import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Email from './Email';
import HomeScreen from './HomeScreen';
import UserList from './UserList';
import Profile from './Profile';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Fungsi yang mengembalikan stack navigator untuk UserList dan Profile
function UserStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="UserListScreen" 
        component={UserList} 
        options={{ title: 'Daftar User' }}
      />
      <Stack.Screen 
        name="Profile" 
        component={Profile} 
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen 
          name="Users" 
          component={UserStack} 
          options={{ headerShown: false }}
        />
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Email" component={Email} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}