import { LinearGradient } from 'expo-linear-gradient';
import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert, ToastAndroid } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { auth, firestore, database, storage } from '../../firebase';

const Post = () => {

    const [postImage, setPostImage] = useState(null)
    const [postText, setPostText] = useState('')
    const [profilePicture, setProfilePicture] = useState(null)

    useEffect(() => {
        storage.ref().child('profilePictures/'+auth.currentUser.uid).getDownloadURL()
        .then((url) => {
            setProfilePicture(url)
        })
    }, [])

    const uploadPost = async() => {
        if (!postText && !postImage) {
            return;
        }
        let pincode;
        await firestore.collection('users')
        .doc(auth.currentUser.uid)
        .get()
        .then((snapshot) => {
            pincode = snapshot.data().pincode
        })
        .catch(err => {
            Alert.alert("Error", err.message)
        })
        if (pincode) {
            let imageUrl = ''
            let flag = 1
            if (postImage) {
                const time = new Date().getTime().toString()
                const path = "posts/"+auth.currentUser.uid+"_"+time  
                const response = await fetch(postImage)
                const blob = await response.blob()
        
                await storage.ref().child(path).put(blob)
                .then(async() => {
                    imageUrl = await storage.ref().child(path).getDownloadURL()
                })
                .catch(err => {
                    flag = 0
                    Alert.alert("Error", err.message)
                })
            }

            if (flag == 1) {
                await database.ref("Posts/"+pincode).push({
                    uid: auth.currentUser.uid,
                    postText: postText,
                    postImage: imageUrl,
                    date: new Date().toString()
                }).then(() => {
                    ToastAndroid.show("Your post has been shared in your community", ToastAndroid.LONG)
                })        
            }

        }
    }

    const imagePicker = async() => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [6, 5],
            quality: 0.5
        })
        if (!result.cancelled) {
            setPostImage(result.uri)
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.titleBar}>
                <Text style={styles.headerText}>Post</Text>
            </View>
            <View style={styles.inputContainer}>
                <View style={styles.avatarContainer}>
                <Image source={(profilePicture) ? {uri: profilePicture} : require("../../assets/profile.png")} resizeMode='center' style={styles.avatar} />
                </View>
                <TextInput autoFocus={true} multiline={true} maxLength={200} onChangeText={(postText) => setPostText(postText)} numberOfLines={4} placeholder='Want to share something ?' style={styles.textInput} />
            </View>
            <TouchableOpacity style={styles.icons} onPress={() => imagePicker()} >
                <Ionicons name="camera" size={32} color="#d8d9db"/>
            </TouchableOpacity>
            
            
            <TouchableOpacity style={styles.button} onPress={() => uploadPost()}>
                <LinearGradient colors={['#203a43', '#2c5364']}>
                    <Text style={styles.buttonText}>Post</Text>
                </LinearGradient>
            </TouchableOpacity>
            
        </View>
    )
}

export default Post;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
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
    inputContainer: {
        marginHorizontal: 32,
        marginTop: 32,
        flexDirection: 'row',
    },
    avatarContainer: {
        borderRadius: 100,
        marginRight: 16,
        width: 60,
        height: 60,
        overflow: 'hidden'
    },
    avatar: {
        width: undefined,
        height: undefined,
        flex: 1,
    }, 
    textInput: {
        flex: 1,
        textAlignVertical: 'top',
        marginTop: 5,
        fontSize: 16,
        borderBottomWidth: 1,
        borderColor: '#424949',
        height: 80
    },
    icons: {
        marginTop: 10,
        alignItems: 'flex-end',
        marginHorizontal: 32
    },
    button: {
        margin: 32,
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: 5
    },
    buttonText: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
        paddingHorizontal: 40,
        paddingVertical: 10,
        textAlign: 'center',
        textTransform: 'uppercase'
    }
})