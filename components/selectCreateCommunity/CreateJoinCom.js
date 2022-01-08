import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Alert } from 'react-native';
import { auth, firestore } from '../../firebase';
import {LinearGradient} from 'expo-linear-gradient';
import Spinner from 'react-native-loading-spinner-overlay';
import {styles} from './CreateJoinComStyle';

const CreateJoinCom = (props) => {

    const [isCreate, setIsCreate] = useState(true);
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        let userPincode;
        firestore.collection('users')
        .where('uid', '==', auth.currentUser.uid)
        .get()
        .then((snapshot) => {
            snapshot.docs.forEach(doc => {
                const { city, state, pincode, district } = doc.data()
                userPincode = pincode
                setLocation({city, state, pincode, district})
            })
            firestore.collection('communities')
            .get()
            .then((snapshot) => {
                snapshot.docs.forEach(doc => {
                    if (userPincode == doc.data().pincode) {
                        setIsCreate(false)
                    }
                })
                setLoading(false)
            })
        })
        .catch((error) => {
            Alert.alert("Error", error.message);
            setLoading(false)
        })
    }, [])

    const comJoin = (isCreate) => {
        setLoading(true)
        firestore.collection('users')
        .doc(auth.currentUser.uid)
        .update({comJoined: true})
        .then(() => {
            if (isCreate) {
                firestore.collection('communities')
                .add({
                    pincode: location.pincode
                })
            }
            props.route.params.comjoin(true)
            setLoading(false);
        })
        .catch((error) => {
            Alert.alert(error.message)
            setLoading(false);
        })
    }

    if (loading) {
        return (
            <Spinner visible={true} />
        )
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.wrapper}>
            {isCreate ? (
            <Text style={styles.header}>CREATE COMMUNITY</Text>
            ) : (
            <Text style={styles.header}>JOIN COMMUNITY</Text>
            )}

            <View style={styles.item}>
                <Text style={styles.itemHeading}>Location</Text>
                <Text style={styles.itemDesc}>
                    {location.state + ", " + location.city + ", " + location.district || " "}
                </Text>
            </View>

            <View style={styles.item}>
                <Text style={styles.itemHeading}>Pincode</Text>
                <Text style={styles.itemDesc}>
                    {location.pincode}
                </Text>
            </View>


            <View>
                {isCreate ? (
                <TouchableOpacity onPress={() => comJoin(true)}>
                    <LinearGradient
                            colors={['#C39BD3', '#9B59B6']} 
                            style={styles.button}>
                                <Text style={styles.buttonTxt}>CREATE</Text>
                    </LinearGradient>
                </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={() => comJoin(false)}>
                    <LinearGradient
                            colors={['#C39BD3', '#9B59B6']} 
                            style={styles.button}>
                                <Text style={styles.buttonTxt}>JOIN</Text>
                    </LinearGradient>
                </TouchableOpacity>
                )}
            </View>

            </View>
        </View>
    )
}

export default CreateJoinCom;