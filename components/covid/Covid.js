import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
const Tab = createMaterialTopTabNavigator();
import axios from 'axios';
import { auth, firestore } from '../../firebase';
import VaccineCenters from './vaccineCenters/VaccineCenters';
import News from './news/News';


const Covid = ({navigation}) => {
    const[loading, setLoading] = useState(false)
    const[centers, setCenters] = useState(null)

    const fetchCenters = () => {
        let pincode
        firestore.collection('users')
        .where('uid', '==', auth.currentUser.uid)
        .get()
        .then((snapshot) => {
            snapshot.docs.forEach(doc => {
                pincode = doc.data().pincode;
            })
            const fetchCentres = async() => {
                await axios.get("https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=560010&date=10-01-2022")
                .then((result) => {
                    setCenters(result.data.centers)
                })
            }
            fetchCentres();
        })
        
    }

    useEffect(() => {
        // console.log(navigation)
        setLoading(true)
        fetchCenters()
        setLoading(false)
    }, []) 

    if (centers && !loading) {
        return (
            <>
                <Tab.Navigator>
                    <Tab.Screen name="Centers" initialParams={{centers}} component={VaccineCenters} 
                    options={{ tabBarLabel: 'Vaccination Centers' }} />
                    <Tab.Screen name="News" component={News} initialParams={{navigation}}
                    options={{ tabBarLabel: 'News' }} />
                    <Tab.Screen name="Certificate" initialParams={{centers}} component={VaccineCenters} 
                    options={{ tabBarLabel: 'Vaccination Certificate' }} />
                </Tab.Navigator>
            </>
        )
    }

    return (
        <View>
            <Spinner visible={true} />
        </View>
    )
}

export default Covid;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    }
})