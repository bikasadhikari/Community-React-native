import React, {useEffect, useState, useRef} from 'react';
import { ScrollView, StyleSheet, View, Text, Button, RefreshControl } from 'react-native';
import Constants from 'expo-constants';
import ProfilePicture from './profilePicture/ProfilePicture';
import Info from './info/Info';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Profile = (navigation) => {
    const childRef = useRef();
    const[refreshing, isRefreshing] = useState(false);

    useEffect(() => {
        // console.log(navigation.data.navigation)
    }, [])

    const logout = () => {
        navigation.data.route.params.logout()
    }

    const onRefresh = () => {
        childRef.current.fetchImage()
    }


    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <View style={styles.titleBar}>
                <Text style={styles.headerText}>Profile</Text>
            </View>

            <ProfilePicture ref={childRef} />
            
            <Info />

            <View style={styles.menuContainer}>
                <TouchableOpacity style={styles.menuItem}>
                    <View>
                        <Text style={styles.menuText}>Account</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.data.navigation.navigate('Location', {isProfile: true})}>
                    <View>
                        <Text style={styles.menuText}>Change Community</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <View>
                        <Text style={styles.menuText}>Change Password</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => logout()}>
                    <Text style={styles.button}>Logout</Text>
                </TouchableOpacity>
            </View>

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
        marginBottom: 20
    },
    headerText: {
        fontSize: 23,
        textTransform: 'uppercase',
        fontWeight: '600'
    },
    menuContainer: {
        borderTopWidth: 1,
        borderColor: '#EAEDED',
        marginTop: 30,
        marginBottom: 30
    },
    menuItem: {
        borderColor: '#EAEDED',
        borderBottomWidth: 1,
        paddingHorizontal: 45,
        paddingVertical: 15,
    },
    menuText: {
        fontSize: 18,
        color: '#52575d'
    },
    buttonContainer: {
        marginTop: 15,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        backgroundColor: '#203a43',
        borderWidth: 1,
        paddingHorizontal: 40,
        paddingVertical: 10,
        fontSize: 20,
        textTransform: 'uppercase',
        color: '#fff',
        borderColor: '#52575d',
        borderRadius: 5
    }
})