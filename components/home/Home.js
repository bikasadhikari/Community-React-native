import React, {useState, useEffect} from 'react';
import { Text, View, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList, Alert, RefreshControl } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ActivityIndicator } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import {auth, firestore, storage} from '../../firebase';
import RenderPost from './RenderPost';


const Home = (navigation) => {
    const [posts, setPosts] = useState(null)
    const [refreshing, setRefreshing] = useState(false)
    const [loadVisible, setLoadVisible] = useState(true)
    const [loading, setLoading] = useState(false)
    global.pincode;
    const limit = 4
    global.lastFeed;

    useEffect(() => {
        getPosts()
    }, [])

    const getPosts = () => {
        setRefreshing(true)
        firestore.collection('users')
        .doc(auth.currentUser.uid)
        .get()
        .then(snapshot => {
            global.pincode = snapshot.data().pincode
        })
        .then(() => {
            firestore.collection('posts')
            .where('pincode', '==', global.pincode)
            .orderBy('timestamp', 'desc')
            .limit(limit)
            .get()
            .then(snapshot => {
                var feed = []
                snapshot.docs.forEach(doc => {
                    const data = doc.data()
                    data.id = doc.id
                    feed.push(data)
                })
                global.lastFeed = snapshot.docs[snapshot.docs.length - 1]
                setPosts(feed)
                setRefreshing(false)
            })
        })
        .catch(err => {
            Alert.alert("Error", err.message)
            setRefreshing(false)
        })
    }

    const onRefresh = () => {
        setPosts(null)
        setLoadVisible(true)
        global.lastFeed = null
        getPosts()
    }

    const loadMore = () => {
        setLoading(true)
        try {
        firestore.collection('posts')
            .where('pincode', '==', global.pincode)
            .orderBy('timestamp', 'desc')
            .limit(limit)
            .startAfter(global.lastFeed)
            .get()
            .then(snapshot => {
                var feed = []
                snapshot.docs.forEach(doc => {
                    const data = doc.data()
                    data.id = doc.id
                    feed.push(data)
                })
                setPosts([...posts, ...feed])
                setLoading(false)
                global.lastFeed = snapshot.docs[snapshot.docs.length - 1]
                if (feed.length == 0) {
                    setLoadVisible(false)
                }
        })
        } catch (e) {
            if (lastFeed == undefined) {
                setLoadVisible(false)
            }
            setLoading(false)
        }
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.titleBar}>
                <Text style={styles.headerText}>Feed</Text>
            </View>

            
            {(!posts) ? (
                    <ActivityIndicator size={50} color="#203a43" style={{justifyContent: 'center', flex: 1}}/>
                ) : ( 
                    (posts.length == 0) ? (
                        <ScrollView style={styles.feedContainer} refreshControl={
                            <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
                        }>
                        <Text style={{textAlign: 'center', marginTop: 50, backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 5, paddingVertical: 10, fontSize: 20, color: '#707B7C'}}>No Posts</Text>
                        </ScrollView>)
                    : (
                    <ScrollView style={styles.feedContainer} showsVerticalScrollIndicator={true}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }>
                        {
                            posts.map((data) => {
                                return (
                                    <RenderPost key={data.id} post={data} />
                                )
                            })
                        }
                        {(loadVisible) ? (
                            (loading) ? (
                                <ActivityIndicator color="#707B7C" style={{alignItems: 'center', justifyContent: 'center',paddingVertical: 5, marginVertical: 15}}/>
                            ) : (
                                <TouchableOpacity style={styles.loadMoreButton} onPress={() => loadMore()}>
                                <Text style={styles.loadText}>Load More</Text>
                                </TouchableOpacity>
                                // <ActivityIndicator color="#707B7C" style={{alignItems: 'center', justifyContent: 'center', marginVertical: 15}}/>
                            )
                        ) : (
                            <View style={styles.endFeed}>
                                <Text style={{fontSize: 15, color: '#707B7C'}}>You are up to date</Text>
                            </View>
                        )}
                    </ScrollView>
                    )
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
    loadMoreButton: {
        alignSelf: 'center',
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 5,
        marginTop: 15,
        marginBottom: 15,
        backgroundColor: '#fff'
    },
    loadText: {
        fontSize: 15
    },
    endFeed: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        paddingVertical: 5,
        backgroundColor: '#fff',
        borderRadius: 5
    }
})