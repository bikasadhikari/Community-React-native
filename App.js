import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Button, LogBox, ToastAndroid } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

import SplashScreen from './components/splashScreen/SplashScreen';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';

const Stack = createStackNavigator();

import ForgotPassword from './components/auth/ForgotPassword';
import Location from './components/setLocation/Location';

import { auth, firestore } from './firebase';
import BottomNavigation from './components/bottomNavigation/BottomNavigation';
import Covid from './components/covid/Covid';
import Article from './components/covid/news/articles/Article';
import Profile from './components/profile/Profile';
import ChangePassword from './components/profile/menu/ChangePassword';
import Account from './components/profile/menu/Account';

// LogBox.ignoreAllLogs(true); //hide warnings and error in expo app in android

const App = () => {

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [comJoined, setComjoined] = useState(false);
  const [skipLocation, setSkipLocation] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        if (user.emailVerified) {
          firestore.collection('users')
          .where("uid", "==", auth.currentUser.uid)
          .get()
          .then((snapshot) => {
            snapshot.docs.forEach(doc => {
              setComjoined(doc.data().comJoined);
              setLoading(false)
            })
          })
          setUser(user);
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    })
  }, [])

  function loggedIn(user) {
    setLoading(true);
    firestore.collection('users')
          .where("uid", "==", auth.currentUser.uid)
          .get()
          .then((snapshot) => {
            snapshot.docs.forEach(doc => {
              setComjoined(doc.data().comJoined);
            })
          })
    setUser(user);
  }

  function comjoin(isJoined) {
    setSkipLocation(true)
    setComjoined(isJoined)
  }

  function skipLoc(skip) {
    setSkipLocation(skip)
  }

  const logout = () => {
    auth.signOut().then(() => ToastAndroid.show("User logged out", ToastAndroid.LONG));
    setUser(null);
  }

  if (loading) return (
    <Spinner 
    visible={true} />
  );

  if (!user && !loading) {
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

  if (user && comJoined) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="BottomTabNavigation" component={BottomNavigation} initialParams={{logout: logout, skipLoc: skipLoc}}/>
          <Stack.Screen name="Covid" component={Covid} />
          <Stack.Screen name="Article" component={Article} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="ChangePassword" component={ChangePassword} />
          <Stack.Screen name="Account" component={Account} /> 
          {(!skipLocation) ? (
          <Stack.Screen name="Location" component={Location} initialParams={{comjoin: comjoin}} 
          options={{
            title: "Hello"
          }}/>
          ) : (
            null
          )}
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
  
  if (user && !loading && !comJoined) {
    return (
      <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: true}} >
          <Stack.Screen name="Location" component={Location} initialParams={{comjoin: comjoin}} options={{
            title: "Set Location"
          },
          {
            headerRight: () => (
              <Button
                onPress={() => logout()}
                title="Logout"
                color="#000"
              />
            )
          }}/>
            {/* <Stack.Screen name="CreateJoinCom" component={CreateJoinCom} initialParams={{comjoin: comjoin}} options={{ title: "Create/Join Community" }} /> */}
      </Stack.Navigator>
    </NavigationContainer>
    );
    }

}
export default App;
