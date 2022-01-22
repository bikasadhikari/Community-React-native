import React, {useEffect, useState} from "react"
import { ActivityIndicator } from "react-native-paper"
import { View, Text, Image, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from "moment";
import { firestore, auth, firebase } from "../../firebase";

const RenderPost = ({post}) => {

    const [isLiked, setIsLiked] = useState(false)
    const [likes, setLikes] = useState(post.likes.length)

    const [user, setUser] = useState({
        name: '',
        profilePic: require('../../assets/profile.png')
    })

    const getUser = () => {
        firestore.collection('users')
        .doc(post.uid)
        .get()
        .then(snapshot => {
            if (snapshot.data().profilePic) {
                setUser({name: snapshot.data().name, profilePic: {uri: snapshot.data().profilePic}})
            } else {
                setUser({name: snapshot.data().name, profilePic: require('../../assets/profile.png')})
            }
        })
    }
    
    useEffect(() => {
        getUser()
        if (post.likes.includes(auth.currentUser.uid)) {
            setIsLiked(true)
        }
    },[])

    const likeHandler = async() => {
        if (!isLiked) {
            setIsLiked(true)
            setLikes(likes+1)
            await firestore.collection('posts')
            .doc(post.id)
            .update({
                likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.uid)
            })
            .then(async() => {
                await firestore.collection('users')
                .doc(auth.currentUser.uid)
                .update({
                    likes: firebase.firestore.FieldValue.arrayUnion(post.id)
                })
            })
        } else {
            setIsLiked(false)
            setLikes(likes-1)
            await firestore.collection('posts')
            .doc(post.id)
            .update({
                likes: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.uid)
            })
            .then(async() => {
                await firestore.collection('users')
                .doc(auth.currentUser.uid)
                .update({
                    likes: firebase.firestore.FieldValue.arrayRemove(post.id)
                })
            })
        }
    }

    return (
        <View style={styles.feedItem}>
            <View style={styles.feedMeta}>
            <Image source={user.profilePic} style={styles.feedAvatar} />
            <View style={{justifyContent: 'center', marginLeft: 7}}>
                <Text style={{fontSize: 16, color: "#454d65"}}>{user.name}</Text>
                <Text style={{fontSize: 11, color: '#c4c6ce', marginTop: 4}}>{moment(new Date(post.timestamp)).fromNow()}</Text>
            </View>
            </View>

            <View style={styles.feedContent}>
                    <Text style={styles.feedText}>{post.postText}</Text>
                    {(post.postImage) ? (
                    <Image style={styles.feedImage} source={{uri: post.postImage}} resizeMode='cover' />
                    ) : (
                        null
                    )}
                    </View>

            <View style={styles.feedActivity}>
                {(isLiked) ? (
                    <Ionicons name="ios-heart" color='red' size={30} onPress={() => likeHandler()}/>
                ) : (
                    <Ionicons name="ios-heart-outline" color='#000' size={30} onPress={() => likeHandler()}/>
                )}
                <Text style={{marginLeft: 10, fontSize: 17, color: '#707B7C'}}>{likes} Likes</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    feedItem: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 8,
        marginVertical: 8
    },
    feedMeta: {
        flexDirection: 'row'
    },
    feedAvatar: {
        width: 50,
        height: 50,
        borderRadius: 30
    },
    feedContent: {
        marginTop: 10,
        marginBottom: 10
    },
    feedText: {
        marginBottom: 5,
        color: '#838899'
    },
    feedImage: {
        width: undefined,
        height: 200,
        borderRadius: 5
    },
    feedActivity: {
        flexDirection: 'row',
        alignItems: 'center'
    }
})

export default RenderPost;