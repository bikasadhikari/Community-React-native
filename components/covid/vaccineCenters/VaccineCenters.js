import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import Center from './centers/Center';
import axios from 'axios';
import { auth, firestore } from '../../../firebase';
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';

const VaccineCenters = () => {
    const[loading, setLoading] = useState(false)
    const[centers, setCenters] = useState(null)

    useEffect(() => {
        setLoading(true)
        fetchCenters()
    }, [])

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
                await axios.get("https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=" + pincode + "&date=" + new moment().format("DD-MM-YYYY"))
                .then((result) => {
                    setCenters(result.data.centers)
                    setLoading(false)
                })
                .catch(() => {
                    setLoading(false)
                })
            }
            fetchCentres();
        })
        .catch(() => {
            setLoading(false)
        })
        
    }

    const onRefresh = () => {
        setLoading(true)
        fetchCenters()
    }

    if (centers && !loading) {
    return (
        <ScrollView refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onRefresh}/>
        } style={styles.container}>
            {centers.map(({center_id, address, name, fee_type, sessions}) => {
                let isCovishield = false
                let isCovaxin = false
                sessions.map(({vaccine}) => {
                    if (vaccine == "COVAXIN") {
                        isCovaxin = true
                    }
                    if (vaccine == "COVISHIELD") {
                        isCovishield = true
                    }
                })
                return (
                   <View style={styles.maincardView} key={center_id}>
                        <Center data={{address, name, fee_type, isCovishield, isCovaxin}} />
                    </View>
                )
            })} 
        </ScrollView>
    )
    }

    return (
        <Spinner visible={true} />
    )

}

export default VaccineCenters;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    maincardView : {
        height: 170,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        borderRadius: 15,
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
        elevation: 8,
        overflow: 'hidden'
    }
})