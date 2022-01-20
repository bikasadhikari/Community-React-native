import React, {useState, useEffect} from 'react';
import { Text, View, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import {auth, firestore, database} from '../../firebase';


const Home = (navigation) => {
    const [posts, setPosts] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        getPosts()
    }, [])

    const getPosts = async() => {
        let pincode;
        await firestore.collection('users')
        .doc(auth.currentUser.uid)
        .get()
        .then(snapshot => {
            pincode = snapshot.data().pincode
        })
        .then(() => {
            firestore.collection('posts')
            .where('pincode', '==', pincode)
            .orderBy('timestamp', 'desc')
            .get()
            .then(snapshot => {
                var feed = []
                snapshot.docs.forEach(doc => {
                    const data = doc.data()
                    data.id = doc.id
                    feed.push(data)
                })
                setPosts(feed)
            })
        })
        .catch(err => {
            Alert.alert("Error", err.message)
            setLoading(false)
        })
    }

    const RenderPost = ({post}) => {
        return (
            <View style={styles.feedItem}>
                <View style={styles.feedMeta}>
                <Image source={require("../../assets/profile.png")} style={styles.feedAvatar} />
                <View style={{justifyContent: 'center', marginLeft: 7}}>
                    <Text style={{fontSize: 16, color: "#454d65"}}>Bikas Adhikari</Text>
                    <Text style={{fontSize: 11, color: '#c4c6ce', marginTop: 4}}>{post.timestamp}</Text>
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
                    <Ionicons name="ios-heart-outline" size={30} />
                </View>
            </View>
        )
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.titleBar}>
                <Text style={styles.headerText}>Feed</Text>
            </View>
            
            {(!posts) ? (
                    <ActivityIndicator size={60} style={{flex: 1, justifyContent: 'center'}} />
                ) : (
                    <ScrollView style={styles.feedContainer} showsVerticalScrollIndicator={true}>
                        {
                            posts.map((data) => {
                                return (
                                    <RenderPost key={data.id} post={data} />
                                )
                            })
                        }
                    </ScrollView>
            )}
            
            
            <View style={styles.postIconContainer}>
            <TouchableOpacity onPress={() => navigation.data.navigation.navigate("Post")}>
            <LinearGradient colors={['#203a43', '#2c5364']} style={{borderRadius: 40}} >
                <Ionicons name='ios-add' size={50} color="#fff" style={[styles.postIcon, {marginTop: 3, marginLeft: 3}]} />
            </LinearGradient>
            </TouchableOpacity>
            </View>
        </View>
    )
}

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EAEDED",
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
        marginBottom: 0
    },
    headerText: {
        fontSize: 23,
        textTransform: 'uppercase',
        fontWeight: '600',
        color: '#000'
    },
    postIconContainer: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 40,
        zIndex: 999,
        backgroundColor: '#203a43',
        elevation: 5,
    }, 
    postIcon: {
        fontSize: 40,
        padding: 10,
    },
    feedContainer: {
        backgroundColor: '#EAEDED',
        marginHorizontal: 20,
        marginVertical: 20
    },
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
    }
})