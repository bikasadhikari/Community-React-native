import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Home from '../home/Home';
import Covid from '../covid/Covid';

const Tab = createMaterialBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
        initialRouteName='Feed'
        backBehavior='initialRoute' 
        labeled={true}
        activeColor="#2C3E50"
        inactiveColor="#99A3A4"
        barStyle={{ backgroundColor: '#fff', paddingBottom: 0 }}>

            <Tab.Screen 
            name="Covid 19" 
            component={Covid} 
            options={{
                tabBarLabel: 'Covid',
                tabBarIcon: ({ color }) => (
                <MaterialIcons name="medical-services" color={color} size={26} />
                ),
            }}/>

            <Tab.Screen 
            name="Nearby" 
            component={Home} 
            options={{
                tabBarLabel: 'Nearby',
                tabBarIcon: ({ color }) => (
                <MaterialIcons name="place" color={color} size={26} />
                ),
            }}/>

            <Tab.Screen name="Feed" 
            component={Home} 
            options={{
                tabBarLabel: 'Feed',
                tabBarIcon: ({ color }) => (
                    <MaterialIcons name="rss-feed" color={color} size={26} />
            ),}}/>

            <Tab.Screen 
            name="Services" 
            component={Home} 
            options={{
                tabBarLabel: 'Services',
                tabBarIcon: ({ color }) => (
                <MaterialIcons name="home-repair-service" color={color} size={26} />
                ),
            }}/>

            <Tab.Screen 
            name="Settings" 
            component={Home}
            options={{
                tabBarLabel: 'Settings',
                tabBarIcon: ({ color }) => (
                <MaterialIcons name="settings" color={color} size={26} />
                ),
            }} />

      
    </Tab.Navigator>
  );
}

export default MyTabs;

