import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Button, LogBox, ToastAndroid } from 'react-native';

import SplashScreen from './components/splashScreen/SplashScreen';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';

const Stack = createStackNavigator();

import ForgotPassword from './components/auth/ForgotPassword';
import Location from './components/setLocation/Location';

import { auth } from './firebase';

// LogBox.ignoreAllLogs(true); //hide warnings and error in expo app in android

const App = () => {

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        if (user.emailVerified) {
          setUser(user);
        }
      }
      setLoading(false);
    })
  }, [])

  function loggedIn(user) {
    setUser(user);
  }

  const logout = () => {
    auth.signOut().then(() => ToastAndroid.show("User logged out", ToastAndroid.LONG));
    setUser(null);
  }

  if (loading) return null;

  if (!user) {
    return (    
        <NavigationContainer>
          <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{headerShown: false}} >
            <Stack.Screen name="SplashScreen" component={SplashScreen}/>
            <Stack.Screen name="SignIn" component={SignIn} initialParams={{login: loggedIn}}/>
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          </Stack.Navigator>
        </NavigationContainer>
    );
  }
  
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Location" screenOptions={{headerShown: true}} >
          <Stack.Screen name="Location" component={Location} options={{
            headerRight: () => (
              <Button title="Logout" color="#000" onPress={() => logout()} />
            )
          }}/>
      </Stack.Navigator>
    </NavigationContainer>
    );

}
export default App;
