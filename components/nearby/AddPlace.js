import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, TextInput, ActivityIndicator, TouchableOpacity, Alert, ToastAndroid} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { auth, firestore, storage, firebase } from '../../firebase';

const AddPlace = ({navigation}) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
    {label: 'Clinic', value: 'clinic'},
    {label: 'Restaurant', value: 'restaurant'},
    {label: 'Others', value: 'others'}
    ]);

    const [name, setName] = useState('')
    const [desc, setDesc] = useState('')
    const [spec, setSpec] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState(null)
    const [Landmark, setLandmark] = useState('')
    const [image, setImage] = useState('')
    const [loading, setLoading] = useState(false)

    const imagePicker = async() => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [10, 8],
            quality: 0.5
        })
        if (!result.cancelled) {
            setImage(result.uri)
        }
    }

    const getLocation = async() => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Error', 'Permission to access location was denied');
            return;
        }
  
        let {coords} = await Location.getCurrentPositionAsync({});
        if (coords) {
            const {latitude, longitude} = coords
            setAddress({latitude: latitude, longitude: longitude})
        } else {
            setAddress({latitude: '', longitude: ''})
        }
    }

    useEffect(() => {
    }, [])

    const saveHandler = async() => {
        setLoading(true)
        if (!value) {
            Alert.alert("Error", "Please select a category!")
            setLoading(false)
            return
        }
        if (!name || !desc || !address) {
            Alert.alert("Error", "Name, Description and Address is mandatory!")
            setLoading(false)
            return
        }
        let imageUrl = '';
        let flag = 1
        if (image) {
            const response = await fetch(image)
            const blob = await response.blob()
            const path = "places/" + new Date().getTime().toString()

            await storage.ref().child(path).put(blob)
            .then(async() => {
                imageUrl = await storage.ref().child(path).getDownloadURL() 
            })
            .catch(err => {
                flag = 0
                Alert.alert("Error", err.message)
            })
        }
        let pincode
        await firestore.collection('users')
        .doc(auth.currentUser.uid)
        .get()
        .then(snapshot => {
            pincode = snapshot.data().pincode
        })
        if (flag == 1) {
            await firestore.collection('places')
            .add({
                pincode: pincode,
                uid: auth.currentUser.uid,
                category: value,
                name: name,
                description: desc,
                speciality: spec,
                phone: phone,
                address: address,
                landmark: Landmark,
                image: imageUrl
            })
            .then(async() => {
                ToastAndroid.show("Place added successfully", ToastAndroid.SHORT)
                navigation.goBack()
                const increment = firebase.firestore.FieldValue.increment(50)
                await firestore.collection('users')
                .doc(auth.currentUser.uid)
                .update({
                    points: increment
                })
                setLoading(false)
            })
            .catch(err => {
                Alert.alert("Error", err.message)
                setLoading(false)
            })
        }
    }

    return (
        <View style={styles.container}>
        <View style={styles.titleBar}>
            <Text style={styles.headerText}>Add Place</Text>
        </View>
        
        <View style={{margin: 20}}>
        <DropDownPicker
                placeholder='Select a Category'
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                zIndex={999}
            />
        </View>
        <ScrollView style={{flex: 1}} nestedScrollEnabled={true}>
        <View style={styles.inputContainer}>

            <View style={styles.textItem} >
            <TextInput placeholder='Name' style={styles.textInput} maxLength={50} onChangeText={name => setName(name.trim())} />
            <MaterialCommunityIcons name='asterisk' size={10} color="#05375a" />
            </View>

            <View style={[styles.textItem, {alignItems: 'flex-start'}]}>
            <TextInput placeholder='Description' numberOfLines={5} maxLength={300} multiline={true} style={[styles.textInput, {height: 80, textAlignVertical: 'top'}]} onChangeText={desc => setDesc(desc.trim())} />
            <MaterialCommunityIcons name='asterisk' size={10} color="#05375a" />
            </View>

            <View style={styles.textItem}>
            <TextInput placeholder='Speciality' maxLength={50} style={styles.textInput} onChangeText={spec => setSpec(spec.trim())} />
            </View>

            <View style={styles.textItem}>
            <TextInput placeholder='Phone Number' maxLength={10} keyboardType='phone-pad' style={styles.textInput} onChangeText={phone => setPhone(phone.trim())} />
            </View>

            <View style={styles.textItem}>
            <TextInput placeholder='Address' value={(!address) ? '' : (address.latitude) ? address.latitude.toString()+", "+address.longitude.toString() : address} style={styles.textInput} onChangeText={address => setAddress(address)} />
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {/* <TouchableOpacity onPress={() => getLocation()}>
                <MaterialIcons name='my-location' color="#d8d9db" size={25} style={{marginRight: 10}} />
            </TouchableOpacity> */}
            <MaterialCommunityIcons name='asterisk' size={10} color="#05375a" />
            </View>
            </View>

            <View style={styles.textItem}>
            <TextInput placeholder='Landmark' maxLength={50} style={styles.textInput} onChangeText={landmark => setLandmark(landmark.trim())} />
            </View>

            {/* <View style={styles.textItem}>
            <TextInput placeholder='Image' editable={false} maxLength={20} style={styles.textInput} onChangeText={landmark => setLandmark(landmark.trim())} />
            <TouchableOpacity onPress={() => imagePicker()}>
                <Ionicons name="camera" size={32} color="#d8d9db"/>
            </TouchableOpacity>
            </View> */}

            {(loading) ? (
                <ActivityIndicator color="#203a43" size="large" />
            ) : (
                <TouchableOpacity style={styles.resetPass} onPress={() => saveHandler()}>
                <LinearGradient colors={['#203a43', '#2c5364']} style={styles.reset}>
                    <Text style={[styles.textreset, {color: '#fff'}]}>Save</Text>
                </LinearGradient>
                </TouchableOpacity>
            )}
        </View>
        </ScrollView>

        </View>
    )
}

export default AddPlace

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    titleBar: {
        height: 60,
        backgroundColor: '#fff',
        alignItems: 'flex-start',
        justifyContent: 'center',
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
    inputContainer: {
        backgroundColor: '#fff',
        flex: 1,
        margin: 20,
        elevation: 1,
        borderRadius: 5,
        padding: 10
    },
    textItem: {
        flexDirection: 'row', 
        alignItems: 'center',
        borderBottomWidth: 1,
        marginBottom: 30,
        borderBottomColor: '#203a43'
    },
    textInput: {
        backgroundColor: '#fff',
        flex: 1,
        fontSize: 16,
        color: '#05375a',
        height: 40
    },
    resetPass: {
        height: 50,
        justifyContent: 'center',
        borderRadius: 10
    },
    reset: {
        alignItems: 'center',
        height: 50,
        justifyContent: 'center',
        borderRadius: 10
    },
    textreset: {
        fontSize: 18,
        fontWeight: 'bold',
    }
})