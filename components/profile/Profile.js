import React, {useEffect, useState, useRef} from 'react';
import { ScrollView, StyleSheet, View, Text, Button, RefreshControl, Alert } from 'react-native';
import Constants from 'expo-constants';
import ProfilePicture from './profilePicture/ProfilePicture';
import Info from './info/Info';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Profile = (navigation) => {
    const childRef = useRef();
    const childRef2 = useRef();
    const[refreshing, isRefreshing] = useState(false);

    useEffect(() => {
        // console.log(navigation.data.navigation)
    }, [])

    const logout = () => {
        Alert.alert("","Are you sure you want to logout ?" , 
        [{
            text: "Yes",
            onPress: () => {
                navigation.data.route.params.logout()
            }
        },
        {
           text: "Cancel",
           style: 'cancel'
        }])
        
    }

    const onRefresh = () => {
        childRef.current.fetchImage()
        childRef2.current.fetchName()
    }


    return (
        <View style={styles.container}>
            <View style={styles.titleBar}>
                <Text style={styles.headerText}>Profile</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            

            <ProfilePicture ref={childRef} />
            
            <Info ref={childRef2} />

            <View style={styles.menuContainer}>
                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.data.navigation.navigate('Account')}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <MaterialCommunityIcons name="account" size={20} style={{marginRight: 10}} color="#203a43" />
                        <Text style={styles.menuText}>Account</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.data.navigation.navigate('Location', {isProfile: true})}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <MaterialIcons name="my-location" size={20} style={{marginRight: 10}} color="#203a43" />
                        <Text style={styles.menuText}>Change Community</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.data.navigation.navigate('ChangePassword')}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <MaterialCommunityIcons name="security" size={20} style={{marginRight: 10}} color="#203a43" />
                        <Text style={styles.menuText}>Change Password</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => logout()} >
                    <LinearGradient colors={['#203a43', '#2c5364']} style={styles.buttonContainer}>
                            <Text style={styles.button}>Logout</Text>
                    </LinearGradient> 
            </TouchableOpacity>

            </ScrollView>
        </View>
    )
}

export default Profile;

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
    },
    headerText: {
        fontSize: 23,
        textTransform: 'uppercase',
        fontWeight: '600',
        color: '#000'
    },
    menuContainer: {
        borderColor: '#EAEDED',
        marginTop: 30,
        marginBottom: 50
    },
    menuItem: {
        borderColor: '#EAEDED',
        paddingHorizontal: 40,
        paddingVertical: 10,
    },
    menuText: {
        fontSize: 16,
        color: '#52575d'
    },
    buttonContainer: {
        width: 170,
        backgroundColor: '#203a43',
        marginTop: 15,
        marginBottom: 50,
        borderWidth: 1,
        paddingHorizontal: 40,
        paddingVertical: 10,
        borderColor: '#52575d',
        borderRadius: 5,
        alignItems: 'center',
        alignSelf: 'center'
    },
    button: {
        alignSelf: 'center',
        fontSize: 20,
        textTransform: 'uppercase',
        color: '#fff'
    }
})