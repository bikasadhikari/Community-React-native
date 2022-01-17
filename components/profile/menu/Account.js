import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, TextInput, Alert} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {auth, firestore} from '../../../firebase';

const Account = () => {
    
    const[user, setUser] = useState('','','','','')
    const[members, setMembers] = useState(null)
    const[loading, setLoading] = useState(false)


    useEffect(() => {
        setLoading(true)
        firestore.collection('users')
        .doc(auth.currentUser.uid)
        .get()
        .then((snapshot) => {
            setUser(snapshot.data())
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
                    <Text style={styles.itemName}>Name</Text>
                    <TextInput style={styles.inputText} placeholder='Enter Name' value={user.name} />
                    
                </View>
                <View style={styles.boxItem}>
                    <Text style={styles.itemName}>Email</Text>
                    <TextInput style={styles.inputText} placeholder='Enter Email' value={user.email} />
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
    }
})