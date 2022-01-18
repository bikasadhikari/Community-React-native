import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, TextInput, Alert, TouchableOpacity, ActivityIndicator, ToastAndroid} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {auth, firestore} from '../../../firebase';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Account = () => {
    
    const[user, setUser] = useState('','','','','')
    const[members, setMembers] = useState(null)
    const[loading, setLoading] = useState(false)
    const[saving, setSaving] = useState(false)
    const[name, setName] = useState(null)


    useEffect(() => {
        setLoading(true)
        firestore.collection('users')
        .doc(auth.currentUser.uid)
        .get()
        .then((snapshot) => {
            setUser(snapshot.data())
            setName(snapshot.data().name)
            setEmail(snapshot.data().email)
        })
        .catch(() => {
            setLoading(false)
        })
    }, [])

    useEffect(() => {
        firestore.collection('communities')
        .doc(user.pincode)
        .get()
        .then(snapshot => {
            setMembers(snapshot.data().members)
            setLoading(false)
        })
        .catch(() => {
            setLoading(false)
        })
    }, [user])

    const update = () => {
        setSaving(true)
        if (name != user.name) {
            firestore.collection('users')
            .doc(auth.currentUser.uid)
            .update({
                name: name
            })
            .then(() => {
                ToastAndroid.show("Name updated successfully", ToastAndroid.SHORT)
                setSaving(false)
            })
            .catch(err => {
                Alert.alert("Error", err.message)
                setSaving(false)
            })
        }
    }

    if (loading || !members) {
        return(
            <Spinner visible={true} />
        )
    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} >
            
            <View style={styles.titleBar}>
                <Text style={styles.headerText}>Account</Text>
            </View>

            <View style={styles.box}>
                <View style={styles.boxItem}>
                    <View style={{flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9F9'}}>
                    <Text style={styles.itemName}>Name</Text>
                    <MaterialIcons name="edit" size={20} style={{marginLeft: 10}} />
                    </View>
                    <TextInput style={styles.inputText} placeholder='Enter Name' value={name} onChangeText={(name) => setName(name)} />
                </View>
                <View style={styles.boxItem}>
                    <Text style={styles.itemName}>Email</Text>
                    <TextInput style={styles.inputText} placeholder='Enter Email' value={user.email} editable={false}  />
                </View>
                <View style={styles.boxItem}>
                    <Text style={styles.itemName}>Community</Text>
                    <TextInput editable={false} style={styles.inputText} placeholder='Pincode' value={user.pincode} />
                </View>
                <View style={styles.boxItem}>
                    <Text style={styles.itemName}>Members in Community</Text>
                    <TextInput editable={false} style={styles.inputText} placeholder='Members in your community' value={members.toString()} />
                </View>
                <View style={styles.boxItem}>
                    <Text style={styles.itemName}>City</Text>
                    <TextInput editable={false} style={styles.inputText} placeholder='City' value={user.city} />
                </View>
                <View style={styles.boxItem}>
                    <Text style={styles.itemName}>State</Text>
                    <TextInput editable={false} style={styles.inputText} placeholder='State' value={user.state} />
                </View>

                {(!saving) ? (
                <TouchableOpacity onPress={() => update()} >
                    <LinearGradient colors={['#203a43', '#2c5364']} 
                     style={styles.buttonContainer}>
                            <Text style={styles.buttonText}>Save</Text>
                    </LinearGradient> 
                </TouchableOpacity>
                ) : (
                    <ActivityIndicator style={styles.activity} size={50} color='#203a43' />
                )}
            </View>

            </ScrollView>
        </View>
    )
}

export default Account;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    titleBar: {
        height: 60,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'flex-start',
        // paddingTop: Platform.OS === 'ios' ? 0 : Constants.statusBarHeight,
        paddingLeft: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f7f9f9',
        marginBottom: 20
    },
    headerText: {
        fontSize: 23,
        textTransform: 'uppercase',
        fontWeight: '600'
    },
    box: {
        flex: 1,
        marginTop: 0,
        paddingHorizontal: 50,
        paddingVertical: 30,
        marginBottom: 30,
    },
    boxItem: {
        marginBottom: 10,
        flexDirection: 'column',
        borderBottomWidth: 1,
        borderColor: '#CCD1D1',
        marginBottom: 30
    },
    itemName: {
        fontSize: 22,
        color: '#000',
        backgroundColor: '#F8F9F9'
    },
    inputText: {
        fontSize: 18,
        marginTop: 10,
        color: '#515A5A'
    },
    buttonContainer: {
        width: 170,
        backgroundColor: '#203a43',
        marginTop: 30,
        borderWidth: 1,
        paddingHorizontal: 40,
        paddingVertical: 10,
        borderColor: '#52575d',
        borderRadius: 5,
        alignItems: 'center',
        alignSelf: 'center'
    },
    buttonText: {
        alignSelf: 'center',
        fontSize: 20,
        textTransform: 'uppercase',
        color: '#fff'
    },
    activity: {
        marginTop: 30,
        paddingHorizontal: 40,
        paddingVertical: 10
    }
})