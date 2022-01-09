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
import CreateJoinCom from './components/selectCreateCommunity/CreateJoinCom';

import { auth, firestore } from './firebase';
import BottomNavigation from './components/bottomNavigation/BottomNavigation';
import ArticleContent from './components/covid/news/articles/articleItem/articleContent/ArticleContent';
import Covid from './components/covid/Covid';
import Article from './components/covid/news/articles/Article';

// LogBox.ignoreAllLogs(true); //hide warnings and error in expo app in android

const App = () => {

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [locationSaved, setLocationSaved] = useState(false);
  const [comJoined, setComjoined] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        if (user.emailVerified) {
          firestore.collection('users')
          .where("uid", "==", auth.currentUser.uid)
          .get()
          .then((snapshot) => {
            snapshot.docs.forEach(doc => {
              const pincode = doc.data().pincode;
              setComjoined(doc.data().comJoined);
              if (pincode == null || pincode == "") {
                setLocationSaved(false);
                setLoading(false);
              } else {
                setLocationSaved(true);
                setLoading(false);
              }
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
              const pincode = doc.data().pincode
              setComjoined(doc.data().comJoined);
              if (pincode == null || pincode == "") {
                setLocationSaved(false);
                setLoading(false);
              } else {
                setLocationSaved(true);
                setLoading(false);
              }
            })
          })
    setUser(user);
  }

  function isLocationSaved(isSaved) {
    setLocationSaved(isSaved);
  }

  function comjoin(isJoined) {
    setComjoined(isJoined);
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
        <Stack.Navigator>
          <Stack.Screen name="BottomTabNavigation" component={BottomNavigation} options={{ title: "COMHOOD"}} />
          <Stack.Screen name="Covid" component={Covid} />
          <Stack.Screen name="Article" component={Article} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
  
  if (user && !loading && !comJoined) {
    return (
      <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: true}} >
          {locationSaved == false ? (
          <Stack.Screen name="Location" component={Location} initialParams={{isLocationSaved: isLocationSaved}} options={{
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
          ) : (
            <Stack.Screen name="CreateJoinCom" component={CreateJoinCom} initialParams={{comjoin: comjoin}} options={{ title: "Create/Join Community" }} />
          )}
      </Stack.Navigator>
    </NavigationContainer>
    );
    }

}
export default App;
