import { useTheme } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, View, Text, Alert } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { LinearGradient } from "expo-linear-gradient";

import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const SignUp = ({navigation}) => {
    const { colors } = useTheme();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const errAlert = (err) =>
    Alert.alert("Alert", err);


    const signUpHandler = () => {
        const auth = firebase.auth();
        const firestore = firebase.firestore();
        auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
            firestore.collection("users")
            .doc(auth.currentUser.uid)
            .set({
                name,
                email
            })
        })
        .catch((error) => {
            switch(error.code) {
                case 'auth/email-already-in-use': errAlert("Email Address already in use!"); break;
                case 'auth/invalid-email': errAlert("Email Address is not valid!"); break;
                case 'auth/weak-password': errAlert("Weak Password!"); break;
            }
        })
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.text_header}>Register Now!</Text>
            </View>

            <Animatable.View animation="fadeInUpBig" style={styles.footer}>
                <View style={styles.inputItem}>
                    <Feather name="user" color={colors.text} size={20} style={{paddingRight: 10}} />
                    <TextInput placeholder="Your Name" placeholderTextColor="#666666"
                    style={styles.textInput} onChangeText={(name) => setName(name)}></TextInput>
                </View>
                <Text style={styles.errorMsg}>Name is mandatory!</Text>
                <View style={styles.inputItem}>
                    <FontAwesome name="at" color={colors.text} size={20} style={{paddingRight: 10}} />
                    <TextInput placeholder="Your Email" placeholderTextColor="#666666" autoCapitalize="none"
                    style={styles.textInput} onChangeText={(email) => setEmail(email)}></TextInput>
                </View>
                <Text style={styles.errorMsg}>Email address is mandatory!</Text>
                <View style={styles.inputItem}>
                    <Feather name="lock" color={colors.text} size={20} style={{paddingRight: 10}} />
                    <TextInput placeholder="Enter Password" placeholderTextColor="#666666" autoCapitalize="none" secureTextEntry={true}
                    style={styles.textInput} onChangeText={(password) => setPassword(password)}></TextInput>
                </View>
                <Text style={styles.errorMsg}>Password is mandatory!</Text>
                
                    <View style={styles.button}>
                        <TouchableOpacity style={[styles.signIn]} onPress={() => signUpHandler()}>
                            <LinearGradient colors={['#08d4c4', '#01ab9d']} style={styles.signIn}>
                                <Text style={[styles.textSign, {color: '#fff'}]}>Sign Up</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('SignIn')} style={[styles.signIn, {borderColor: '#009387', borderWidth: 1, marginTop: 15}]}>
                            <Text style={[styles.textSign, {color: '#009387'}]}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
            </Animatable.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#009387'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    text_header: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },
    inputItem: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    textInput: {
        flex: 1,
        fontSize: 18,
        borderBottomWidth: 1,
        borderColor: '#009387',
        // paddingLeft: 15,
        height: 45
    },  
    errorMsg: {
        color: '#ff0000',
        fontSize: 14,
        marginBottom: 10,
        paddingLeft: 28
    },
    footer: {
        flex: 6,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    button: {
        // alignItems: 'center',
        marginTop: 50,
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        // paddingHorizontal: 50
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    }
});

export default SignUp;