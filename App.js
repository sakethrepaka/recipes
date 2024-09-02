import React, { useState, useContext, useEffect } from 'react';
import { StatusBar, Modal, StyleSheet, Text, View, SafeAreaView, Platform, Alert, Image, Button} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-gesture-handler';
import SignUp from './Screens/SignUp';
import Login from './Screens/Login';
import { NotificationProvider } from './NotificationContext';
import LottieView from 'lottie-react-native';
import DrawerNavigation from './DrawerNavigation';
import Welcome from './Welcome';
import Admin from './Screens/Admin';
import AdminNavigation from './AdminNavigation';


import * as Linking from 'expo-linking';
import Feedback from './Feedback';

export default function App() {
  const Stack = createNativeStackNavigator()

  const prefix = Linking.createURL('recipes/SignUp');

  const linking = {
    prefixes: [prefix],
  }

  const [isLoading, setIsLoading] = useState(true);
  const animation = require('./Animation .json')

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LottieView
          style={{width: "100%", height: "100%"}}
          source={animation}
          autoPlay
          loop
        />
      </View>
    );
  }
  return (
    <NotificationProvider>
      <NavigationContainer linking={linking}>
        <Stack.Navigator initialRouteName='Welcome'>
          <Stack.Screen name='Welcome' component={Welcome} options={{ headerShown: false}}></Stack.Screen>
          <Stack.Screen name='SignUp' component={SignUp} options={{ headerShown: false }}></Stack.Screen>
          <Stack.Screen name='Login' component={Login} options={{ headerShown: false }}></Stack.Screen>
          <Stack.Screen name='AdminNavigation' component={AdminNavigation} options={{ headerShown: false }}></Stack.Screen>
          <Stack.Screen name='Feedback' component={Feedback} ></Stack.Screen>
          <Stack.Screen name='Restaurant' component={DrawerNavigation} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </NotificationProvider>
  );
}


const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,

  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  closeButton: {
    marginVertical: 10,
    borderRadius: 10,
    width: 100
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
