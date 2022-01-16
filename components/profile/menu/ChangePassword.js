import React, {useState} from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import {auth} from '../../../firebase';
import { LinearGradient } from 'expo-linear-gradient';

const ChangePassword = () => {
    const [curPassword, setCurPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const passwordHandler = async() => {
        setLoading(true)
        var user = auth.currentUser;
        auth.signInWithEmailAndPassword(user.email, curPassword)
        .then(() => {
            user.updatePassword(newPassword)
            .then(() => {
                setLoading(false)
                Alert.alert("Success", "Password successfully changed.")
            })
            .catch(err => {
                setLoading(false)
                Alert.alert("Error", err.message)
            })
        })
        .catch(err => {
            setLoading(false)
            Alert.alert("Error", err.message)
        })
    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.titleBar}>
                <Text style={styles.headerText}>Change Password</Text>
            </View>
            <View style={styles.box}>
                <TextInput style={styles.textInput} placeholder='Enter Current Password' onChangeText={(pass) => setCurPassword(pass)} 
                placeholderTextColor="#666666" secureTextEntry={true} autoCapitalize='none'/>
                <TextInput style={styles.textInput} placeholder='Enter New Password' onChangeText={(pass) => setNewPassword(pass)} 
                placeholderTextColor="#666666" secureTextEntry={true} autoCapitalize='none'/>
                {(!loading) ? (
                <TouchableOpacity onPress={() => passwordHandler()} >
                    <LinearGradient colors={['#203a43', '#2c5364']} style={styles.buttonContainer}>
                            <Text style={styles.buttonText}>Save</Text>
                    </LinearGradient> 
                </TouchableOpacity>
                ) : (
                    <ActivityIndicator style={styles.activity} size={50} color='#203a43' />
                )}
            </View>
            </ScrollView>
        </View>
    )
}

export default ChangePassword;

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
    box: {
        flex: 1,
        marginTop: 20,
        paddingHorizontal: 50,
        paddingVertical: 30,
        marginBottom: 30,
    },
    textInput: {
        fontSize: 18,
        borderBottomWidth: 1,
        borderColor: '#203a43',
        height: 50,
        marginBottom: 20
    },
    buttonContainer: {
        width: 170,
        backgroundColor: '#203a43',
        marginTop: 30,
        borderWidth: 1,
        paddingHorizontal: 40,
        paddingVertical: 10,
        borderColor: '#52575d',
        borderRadius: 5,
        alignItems: 'center',
        alignSelf: 'center'
    },
    buttonText: {
        alignSelf: 'center',
        fontSize: 20,
        textTransform: 'uppercase',
        color: '#fff'
    },
    activity: {
        marginTop: 30,
        paddingHorizontal: 40,
        paddingVertical: 10
    }
})