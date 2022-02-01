import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, ScrollView, TextInput, ActivityIndicator, ToastAndroid, Alert} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons'
import * as ImagePicker from 'expo-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {auth, firestore, storage} from '../../firebase';

const Sell = ({navigation}) => {

    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('')
    const [desc, setDesc] = useState('')
    const [price, setPrice] = useState('')
    const [phone, setPhone] = useState('')
    const [image, setImage] = useState('')

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

    const saveHandler = async() => {
        setLoading(true)
        if (!name || !desc || !price || !phone) {
            Alert.alert("Error", "Name, Description, Price and Phone number is mandatory!")
            setLoading(false)
            return
        }
        let imageUrl = '';
        let flag = 1
        if (image) {
            const response = await fetch(image)
            const blob = await response.blob()
            const path = "items/" + new Date().getTime().toString()

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
        let uname
        await firestore.collection('users')
        .doc(auth.currentUser.uid)
        .get()
        .then(snapshot => {
            pincode = snapshot.data().pincode
            uname = snapshot.data().name
        })
        if (flag == 1) {
            await firestore.collection('items')
            .add({
                pincode: pincode,
                uid: auth.currentUser.uid,
                name: name,
                uname: uname,
                description: desc,
                phone: phone,
                price: price,
                image: imageUrl,
                available: true
            })
            .then(async() => {
                ToastAndroid.show("Item added successfully", ToastAndroid.SHORT)
                navigation.goBack()
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
            <Text style={styles.headerText}>Sell</Text>
        </View>
        
        <ScrollView style={{flex: 1}} nestedScrollEnabled={true}>
        <View style={styles.inputContainer}>

            <View style={styles.textItem} >
            <TextInput placeholder='Item Name' style={styles.textInput} maxLength={50} onChangeText={name => setName(name.trim())} />
            <MaterialCommunityIcons name='asterisk' size={10} color="#05375a" />
            </View>

            <View style={[styles.textItem, {alignItems: 'flex-start'}]}>
            <TextInput placeholder='Description' numberOfLines={5} maxLength={300} multiline={true} style={[styles.textInput, {height: 80, textAlignVertical: 'top'}]} onChangeText={desc => setDesc(desc.trim())} />
            <MaterialCommunityIcons name='asterisk' size={10} color="#05375a" />
            </View>

            <View style={styles.textItem}>
            <TextInput placeholder='Price' maxLength={15} style={styles.textInput} keyboardType='number-pad' onChangeText={price => setPrice(price.trim())} />
            <MaterialCommunityIcons name='asterisk' size={10} color="#05375a" />
            </View>

            <View style={styles.textItem}>
            <TextInput placeholder='Phone Number' maxLength={10} keyboardType='phone-pad' style={styles.textInput} onChangeText={phone => setPhone(phone.trim())} />
            <MaterialCommunityIcons name='asterisk' size={10} color="#05375a" />
            </View>

            <View style={styles.textItem}>
            <TextInput placeholder='Image' editable={false} maxLength={20} style={styles.textInput} onChangeText={landmark => setLandmark(landmark.trim())} />
            <TouchableOpacity onPress={() => imagePicker()}>
                <Ionicons name="camera" size={32} color="#d8d9db"/>
            </TouchableOpacity>
            </View>

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

export default Sell;

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
    inputContainer: {
        backgroundColor: '#fff',
        flex: 1,
        margin: 20,
        elevation: 1,
        borderRadius: 5,
        padding: 10,
        marginTop: 40
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