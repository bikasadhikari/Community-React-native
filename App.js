import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from './components/splashScreen/SplashScreen';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
const Stack = createStackNavigator();

import firebase from 'firebase/compat/app'
const firebaseConfig = {
  apiKey: "AIzaSyB38k5xN3V1xjdbTDfKnaalmrtm3J-IKvg",
  authDomain: "comhood-b84b8.firebaseapp.com",
  projectId: "comhood-b84b8",
  storageBucket: "comhood-b84b8.appspot.com",
  messagingSenderId: "633149241062",
  appId: "1:633149241062:web:a37e2d5bec54792644ad27",
  measurementId: "G-FZ7PRKW0M7"
};
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{headerShown: false}}>
        <Stack.Screen name="SplashScreen" component={SplashScreen}/>
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

