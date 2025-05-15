import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { HomeScreen } from '../screens/HomeScreen';
import { CameraScreen } from '../screens/CameraScreen';
import { PhotoDetailScreen } from '../screens/PhotoDetailScreen';
import { PhotoHistoryScreen } from '../screens/PhotoHistoryScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen 
          name="Camera" 
          component={CameraScreen} 
          options={{
            animation: 'slide_from_bottom',
            presentation: 'fullScreenModal',
          }}
        />
        <Stack.Screen name="PhotoDetail" component={PhotoDetailScreen} />
        <Stack.Screen name="PhotoHistory" component={PhotoHistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};