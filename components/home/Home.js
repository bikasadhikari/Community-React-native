import React, {useState, useEffect} from 'react';
import { Text, View, StyleSheet, ScrollView, RefreshControl, Pressable, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

const Home = (navigation) => {

    useEffect(() => {
        console.log(navigation.data.navigation)
    }, [])
    
    return (
        <View style={styles.container}>
            <View style={styles.titleBar}>
                <Text style={styles.headerText}>Feed</Text>
            </View>
            
            <ScrollView>
            
            </ScrollView>
            
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
    }
})