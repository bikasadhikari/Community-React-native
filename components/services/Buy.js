import React, {useEffect, useState} from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image, Alert} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { ScrollView } from 'react-native-gesture-handler';
import {auth, firestore, storage} from '../../firebase';

const Buy = ({navigation}) => {
   
    const [items, setItems] = useState(null)

    const getItems = async() => {
        let pincode;
        try {
            await firestore.collection('users')
            .doc(auth.currentUser.uid)
            .get()
            .then((snapshot) => {
                pincode = snapshot.data().pincode
            })
            await firestore.collection('items')
            .where('pincode', '==', pincode)
            .where('available', '==', true)
            .get()
            .then(snapshot => {
                var feed = []
                snapshot.docs.forEach(async(doc) => {
                    var data = doc.data()
                    data.id = doc.id
                    feed.push(data)
                })
                setItems(feed)
            })
        } catch(e) {
            Alert.alert("Error", "Something went wrong!")
        }
    }

    useEffect(() => {
        getItems()
    }, [])


    return (
        <View style={styles.container}>
        <View style={styles.titleBar}>
            <Text style={styles.headerText}>Items on Sale</Text>
        </View>

        {(!items) ? null : (
            <ScrollView style={styles.infoContainer}>
            {
                items.map((data) => {
                    const delItem = () => {
                        firestore.collection('items')
                        .doc(data.id)
                        .update({
                            available: false
                        })
                        .then(() => {
                            getItems()
                        })
                    }
                    return (
                        <View style={styles.infoItem} id={data.id}>
                            <View style={styles.infoImageContainer}>
                                <Image
                                source={(data.image) ? {uri: data.image} : require('../../assets/favicon.png')}
                                resizeMode='cover' style={styles.infoImage} />
                            </View>
                            <View style={styles.itemDetails}>
                                <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 3}}>{data.name}</Text>
                                <Text style={{fontSize: 15, fontWeight: 'light', marginBottom: 3}}>{data.description}</Text>
                                <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 15}}>Price : ₹{data.price}</Text>
                                <Text style={{fontSize: 17, fontWeight: 'medium', marginBottom: 3}}>Name : {data.uname}</Text>
                                <Text style={{fontSize: 17, fontWeight: 'medium', marginBottom: 3}}>Phone : {data.phone} </Text>
                                {(data.uid == auth.currentUser.uid) ? (
                                    <TouchableOpacity onPress={() => delItem()} style={{backgroundColor: '#203a43', borderRadius: 5, paddingVertical: 10, marginTop: 20}}>
                                        <Text style={{color: '#fff', alignSelf: 'center' }}>Take Down</Text>
                                    </TouchableOpacity>
                                ) : (null)}
                            </View>
                        </View>
                    )
                })
            }
        </ScrollView>
        )}
        
        </View>
    )
}

export default Buy;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    titleBar: {
        height: 60,
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between',
        // paddingTop: Platform.OS === 'ios' ? 0 : Constants.statusBarHeight,
        paddingLeft: 20,
        paddingRight: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f7f9f9',
    },
    headerText: {
        fontSize: 23,
        textTransform: 'uppercase',
        fontWeight: '600',
        color: '#000'
    },
    infoContainer: {
        flex: 1,
    }, 
    infoItem: {
        backgroundColor: '#fff',
        borderRadius: 15,
        flexDirection: 'row',
        elevation: 8,
        alignItems: 'center',
        margin: 20,
        justifyContent: 'space-evenly',
        paddingVertical: 10,
        paddingHorizontal: 10
    },
    infoImageContainer: {
        overflow: 'hidden',
        marginRight: 10
    },
    infoImage: {
        width: 120,
        height: 120
    },
    itemDetails: {
        flex: 3,
        overflow: 'hidden'
    }
})