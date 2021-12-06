import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Button, StyleSheet } from 'react-native';

import SplashScreen from './components/splashScreen/SplashScreen';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
const Stack = createStackNavigator();

import firebase from 'firebase/compat/app'
import 'firebase/compat/auth';

import ForgotPassword from './components/auth/ForgotPassword';
import Location from './components/setLocation/Location';
import { Alert, ToastAndroid } from 'react-native';
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


export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      loaded: false
    };
  }

  async componentDidMount() {
      await firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.setState({loggedIn: true, loaded: true});
        } else {
          this.setState({loggedIn: false, loaded: true});
        }
      })
  }

  render() {
    
  const logout = async () => {
    try {
      await firebase.auth().signOut();
      this.setState({loggedIn: false});
    }
    catch (e) {
    }
  }
    return (
      (!this.state.loggedIn && this.state.loaded) ?
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{headerShown: false}} >
          <Stack.Screen name="SplashScreen" component={SplashScreen}/>
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        </Stack.Navigator>
      </NavigationContainer>
      :
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Location" screenOptions={{headerShown: true, title: "Your Location"}}>
          <Stack.Screen name="Location" component={Location} options={{
          headerRight: () => (
            <Button title="Logout" color="#000" onPress={() => logout()} />
          )
        }}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

