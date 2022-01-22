import React, { useState, useEffect } from "react";
import { ToastAndroid, ActivityIndicator, View, Text, TouchableOpacity, TextInput, StyleSheet, StatusBar, Alert } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useTheme } from "@react-navigation/native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { LinearGradient } from "expo-linear-gradient";

import { auth } from "../../firebase"

const SignIn = (navigation) => {

    useEffect(() => {
        // console.log(navigation)
    }, [])

    const { colors } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [load, setLoad] = useState(false);
    const [emptyEmail, setEmptyEmail] = useState(false);
    const [emailErr, setEmailErr] = useState(false);
    const [emptyPassword, setEmptyPassword] = useState(false);
    const [passwordEye, setPasswordEye] = useState(false);

    const passwordEyeHandler = () => {
        if (!passwordEye)
            setPasswordEye(true);
        else 
            setPasswordEye(false);
    }

    const signInHandler = () => {
        setEmailErr(false)
        setLoad(true);
        (email == '') ? setEmptyEmail(true) : setEmptyEmail(false);
        (password == '') ? setEmptyPassword(true) : setEmptyPassword(false);
        if (email == '' || password == '') {
            setLoad(false);
            return;
        }
        auth.signInWithEmailAndPassword(email, password)
        .then((userCredentials) => {
            if (userCredentials.user.emailVerified == false) {
                Alert.alert("Alert", "Email not verified!",
                [{
                    text: "Resend",
                    onPress: () => {
                        auth.currentUser.sendEmailVerification();
                    }
                },
                {
                    text: "Cancel",
                    style: 'cancel'
                }
                ]);
            } else {
                ToastAndroid.show("Login Successful", ToastAndroid.LONG);
                navigation.route.params.login(userCredentials.user)
            }
        setLoad(false)
            
        })
        .catch((error) => {
            switch(error.code) {
                case 'auth/user-not-found': Alert.alert("Error", "User not found!"); setLoad(false); setEmailErr(true); break;
                case 'auth/user-disabled': Alert.alert("Error", "User is temporarily blocked!"); setLoad(false); break;
                case 'auth/wrong-password': Alert.alert("Error", "Wrong password. Try again!"); setLoad(false); break;
                case 'auth/invalid-email': Alert.alert("Error", "Invalid email!"); setLoad(false); setEmailErr(true); break;
                default: Alert.alert("Error", error.message); setLoad(false);;
            }
        })
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#203a43' barStyle="light-content"/>
            <View style={styles.header}>
                <Text style={styles.text_header}>Welcome!</Text>
            </View>
            <Animatable.View animation="fadeInUpBig" style={[styles.footer]} duration={500}>
                <Text style={[styles.text_footer, {color: colors.text}]}>Email</Text>
                <View style={styles.action}>
                    <FontAwesome name="at" color={colors.text} size={20} />
                    <TextInput placeholder="Your Email" placeholderTextColor="#666666"
                    autoCapitalize="none" style={[styles.textInput, {color: colors.text}]}
                    onChangeText={(email) => setEmail(email)}></TextInput>
                    <Animatable.View animation="bounceIn">
                        {(emptyEmail || emailErr) ? <Feather name='x-circle' color='red' size={20} /> :
                        <Feather name='check-circle' color='green' size={20} />}
                    </Animatable.View>
                </View>
                {(emptyEmail) ? 
                    <Animatable.View animation="bounceIn" duration={500}>
                        <Text style={styles.errorMsg}>Email address is mandatory!</Text>
                    </Animatable.View> : null}

                    <Text style={[styles.text_footer, {color: colors.text, marginTop: 35}]}>Password</Text>
                    <View style={styles.action}>
                        <Feather name="lock" color={colors.text} size={20}/>
                        <TextInput placeholder="Your Password" placeholderTextColor="#666666"
                        secureTextEntry={(passwordEye) ? false : true} autoCapitalize='none' style={[styles.textInput, {color: colors.text}]}
                        onChangeText={(password) => setPassword(password)}></TextInput>
                        <TouchableOpacity onPress={() => passwordEyeHandler()}>
                            {(passwordEye) ? <Feather name="eye" color='grey' size={20} /> : 
                            <Feather name="eye-off" color='grey' size={20} />}
                        </TouchableOpacity>
                    </View>
                    {(emptyPassword) ? 
                    <Animatable.View animation="bounceIn" duration={500}>
                        <Text style={styles.errorMsg}>Password is mandatory!</Text>
                    </Animatable.View> : null}

                    <TouchableOpacity onPress={() => navigation.navigation.navigate('ForgotPassword')}>
                        <Text style={{color: '#203a43', marginTop: 15}}>Forgot Password?</Text>
                    </TouchableOpacity>

                    {(load) ? <ActivityIndicator size="large" color="#203a43"></ActivityIndicator> : 
                    <View style={styles.button}>
                        <TouchableOpacity style={[styles.signIn]} onPress={() => signInHandler()}>
                            <LinearGradient colors={['#203a43', '#2c5364']} style={styles.signIn}>
                                <Text style={[styles.textSign, {color: '#fff'}]}>Sign In</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigation.navigate('SignUp')} style={[styles.signIn, {borderColor: '#203a43', borderWidth: 1, marginTop: 15}]}>
                            <Text style={[styles.textSign, {color: '#203a43'}]}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>}
            </Animatable.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#203a43'
    },
    header: {
        flex: 1,
        justifyContent: "flex-end",
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    footer: {
        flex:3,
        backgroundColor: '#F8F9F9',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30,
        // justifyContent: 'center'
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#203a43',
        paddingBottom: 5,
        alignItems: 'center'
    },
    textInput: {
        flex: 1,
        paddingLeft: 10,
        color: '#05375a',
        fontSize: 16
    },
    errorMsg: {
        color: '#ff0000',
        fontSize: 14
    },
    button: {
        alignItems: 'center',
        marginTop: 50
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
})

export default SignIn;