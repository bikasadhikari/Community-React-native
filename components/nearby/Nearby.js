import React, {useEffect, useState} from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Menu, Provider } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { ScrollView } from 'react-native-gesture-handler';
import {auth, firestore, storage} from '../../firebase';

const Nearby = ({navigation}) => {
    const [visible, setVisible] = useState(false);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('all');
    const [items, setItems] = useState([
    {label: 'All', value: 'all', selected: true},
    {label: 'Clinics', value: 'clinic'},
    {label: 'Restaurants', value: 'restaurant'},
    {label: 'Others', value: 'others'}
    ]);
    const [places, setPlaces] = useState(null)
    const openMenu = () => {
        setVisible(true)
    }
    const closeMenu = () => {
        setVisible(false)
    }

    const getPlaces = async() => {
        let pincode;
        await firestore.collection('users')
        .doc(auth.currentUser.uid)
        .get()
        .then((snapshot) => {
            pincode = snapshot.data().pincode
        })
        if (value == 'all') {
            await firestore.collection('places')
            .where('pincode', '==', pincode)
            .get()
            .then(snapshot => {
                var feed = []
                snapshot.docs.forEach(doc => {
                    var data = doc.data()
                    data.id = doc.id
                    feed.push(data)
                })
                setPlaces(feed)
            })
        } else {
            await firestore.collection('places')
            .where('pincode', '==', pincode)
            .where('category', '==', value)
            .get()
            .then(snapshot => {
                var feed = []
                snapshot.docs.forEach(doc => {
                    var data = doc.data()
                    data.id = doc.id
                    feed.push(data)
                })
                setPlaces(feed)
            })
        }
    }


    return (
        <Provider>
        <View style={styles.container}>
        <View style={styles.titleBar}>
            <Text style={styles.headerText}>Nearby Places</Text>
            <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={
                    <TouchableOpacity  onPress={openMenu} >
                        <MaterialCommunityIcons size={30} name="dots-vertical" />
                    </TouchableOpacity>
                }>
                    <Menu.Item onPress={() => {navigation.navigate('AddPlace')}} title="Add Place"/>
            </Menu>
        </View>

        <View style={{marginHorizontal: 20, marginTop: 20}}>
            <DropDownPicker 
            placeholder='Search for'
            defaultValue={value}
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            onChangeValue={() => getPlaces()}
            />
        </View>

        <ScrollView style={styles.infoContainer}>
            {
                places.map((data) => {
                    return (
                        <TouchableOpacity style={styles.infoItem} id={data.id}>
                            <View style={styles.infoImageContainer}>
                                <Image
                                source={
                                    (data.category=='clinic') ? require('../../assets/redcross.png') : (data.category=='restaurant') ? require('../../assets/restaurant.png') : require('../../assets/shop.png')}
                                resizeMode='cover' style={styles.infoImage} />
                            </View>
                            <View style={styles.itemDetails}>
                                <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 3}}>{data.name}</Text>
                                <Text>{data.description}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                })
            }
        </ScrollView>
        
        </View>
        </Provider>
    )
}

export default Nearby

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
        height: 100,
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
        overflow: 'hidden',
        paddingVertical: 20
    },
    infoImageContainer: {
        flex: 1,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
    },
    infoImage: {
        width: 60,
        height: 60
    },
    itemDetails: {
        flex: 3,
        overflow: 'hidden'
    }
})