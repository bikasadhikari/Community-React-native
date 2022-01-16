import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Platform, RefreshControl } from 'react-native';
import Constants from 'expo-constants';
import Spinner from 'react-native-loading-spinner-overlay';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
const Tab = createMaterialTopTabNavigator();
import VaccineCenters from './vaccineCenters/VaccineCenters';
import News from './news/News';


const Covid = ({navigation}) => {

    useEffect(() => {
        // console.log(navigation)
        
    }, []) 

        return (
            <>
            <View style={styles.header}>
                <Text style={styles.headerText}>Covid</Text>
            </View>
                <Tab.Navigator>
                    <Tab.Screen name="Centers" component={VaccineCenters} 
                    options={{ tabBarLabel: 'Vaccination Centers in your locality' }} />
                    <Tab.Screen name="News" component={News} initialParams={{navigation}}
                    options={{ tabBarLabel: 'News' }} />
                </Tab.Navigator>
            </>
        )
}

export default Covid;

const styles = StyleSheet.create({
    header: {
        height: 60,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'flex-start',
        // paddingTop: Platform.OS === 'ios' ? 0 : Constants.statusBarHeight,
        paddingLeft: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f7f9f9'
    },
    headerText: {
        fontSize: 23,
        textTransform: 'uppercase',
        fontWeight: '600'
    }
})