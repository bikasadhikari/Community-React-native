import React, {useState, useEffect, useImperativeHandle, forwardRef} from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import * as ImagePicker from 'expo-image-picker';

import { auth, storage } from '../../../firebase'
import { ActivityIndicator } from 'react-native-paper';

const ProfilePicture = (props, ref) => {
    const[uid, setUid] = useState(null)
    const[imageUrl, setImageUrl] = useState(null)
    const[imageLoading, setImageLoading] = useState(false)

    useImperativeHandle(ref, () => ({
        fetchImage: () => { fetchImage() }
    }))

    useEffect(() => {
        setUid(auth.currentUser.uid)
    }, [])

    useEffect(() => {
        if (uid != null) {
            fetchImage()
        }
    }, [uid])

    const fetchImage = () => {
        setImageLoading(true)
        storage.ref().child('profilePictures/' + uid).getDownloadURL()
        .then((url) => {
            setImageUrl(url)
            setImageLoading(false)
        })
        .catch(() => {
            setImageLoading(false)
        })
    }

    const uploadPicture = async() => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 0.5
        })
        if (!result.cancelled) {
            setImageLoading(true)
            let uri = result.uri
            const response = await fetch(uri);
            const blob = await response.blob();
            await storage.ref().child('profilePictures/' + uid).put(blob)
            .then(() => {
                fetchImage()
            })
            .catch(() => {
                setImageLoading(false)
            })
        }
    }

    return (
        <View style={{alignSelf: 'center'}}>
            <View style={styles.profileImg}>
                {(imageLoading) ? 
                <ActivityIndicator size={30} color="#34495E" /> :
                <Image source={(imageUrl) ? {uri: imageUrl} : require('../../../assets/profile.png')} style={styles.image} resizeMode='center'></Image>}
            </View>
            <View style={styles.add}>
                <TouchableOpacity onPress={() => uploadPicture()}>
                    <Ionicons name="ios-add" size={48} color="#DFD8C8" style={{marginTop: 3, marginLeft: 3}} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default forwardRef(ProfilePicture);

const styles = StyleSheet.create({
    profileImg: {
        width: 200,
        height: 200,
        borderRadius: 100,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#ABB2B9',
        justifyContent: 'center'
    },
    add: {
        backgroundColor: "#203a43",
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30
    },
    image: {
        flex: 1,
        width: undefined,
        height: undefined
    }
})