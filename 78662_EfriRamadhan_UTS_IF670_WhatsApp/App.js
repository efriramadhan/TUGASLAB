import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ChatListScreen from './screens/ChatListScreen';
import ChatDetailScreen from './screens/ChatDetailScreen';
import ContactScreen from './screens/ContactScreen';
import StatusScreen from './screens/StatusScreen';
import StatusViewerScreen from './screens/StatusViewerScreen';
import CallScreen from './screens/CallScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
    tabBarIcon: ({ color, size }) => {
      let iconName;

      if (route.name === 'Chats') iconName = 'chatbubble-ellipses';
      else if (route.name === 'Status') iconName = 'ellipse';
      else if (route.name === 'Calls') iconName = 'call';
      else if (route.name === 'Contacts') iconName = 'people';
      else if (route.name === 'Profile') iconName = 'person-circle';

      return <Ionicons name={iconName} size={size} color={color} />;
    },
    tabBarActiveTintColor: '#128C7E',
    tabBarInactiveTintColor: 'gray',
  })}
>
  <Tab.Screen name="Chats" component={ChatListScreen} />
  <Tab.Screen name="Status" component={StatusScreen} />
  <Tab.Screen name="Calls" component={CallScreen} />
  <Tab.Screen name="Contacts" component={ContactScreen} />
  <Tab.Screen name="Profile" component={ProfileScreen} />
</Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
        <Stack.Screen name="Contact" component={ContactScreen} />
        <Stack.Screen name="StatusViewer" component={StatusViewerScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
