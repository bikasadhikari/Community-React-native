import { useTheme } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, View, Text, Alert, ActivityIndicator, ToastAndroid } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { LinearGradient } from "expo-linear-gradient";

import { auth, firestore } from "../../firebase";

const SignUp = ({navigation}) => {
    const { colors } = useTheme();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [load, setLoad] = useState(false);
    const [emptyName, setEmptyName] = useState(false);
    const [emptyEmail, setEmptyEmail] = useState(false);
    const [emptyPassword, setEmptyPassword] = useState(false);
    const [disableBtn, setDisableBtn] = useState(false);

    const [nameErr, setNameErr] = useState(false);
    const [emailErr, setEmailErr] = useState(false);
    const [passwordErr, setPasswordErr] = useState(false);

    const errAlert = (err) =>
    Alert.alert("Alert", err);


    const signUpHandler = async () => {
        setLoad(true);
        setDisableBtn(true);
        if (name == '') {
            setEmptyName(true);
            setNameErr(true);
        } else {
            setEmptyName(false);
            setNameErr(false);
        }
        if (email == '') {
            setEmptyEmail(true);
            setEmailErr(true);
        } else {
            setEmptyEmail(false);
            setEmailErr(false);
        }
        if (password == '') {
            setEmptyPassword(true);
            setPasswordErr(true);
        } else {
            setEmptyPassword(false);
            setPasswordErr(false);
        }
        if (name == '' || email == '' || password == '') {
            setLoad(false);
            setDisableBtn(false);
            return;
        }
        auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
            firestore.collection("users")
            .doc(auth.currentUser.uid)
            .set({
                uid: auth.currentUser.uid,
                name,
                email,
                pincode: null,
                comJoined: false
            });
            ToastAndroid.show("SignUp successfull", ToastAndroid.LONG)
            auth.currentUser.sendEmailVerification();
            setLoad(false);
            setDisableBtn(false);        
            navigation.navigate('SignIn')
        })
        .catch((error) => {
            switch(error.code) {
                case 'auth/email-already-in-use': errAlert("Email Address already in use!"); setEmailErr(true); break;
                case 'auth/invalid-email': errAlert("Email Address is not valid!"); setEmailErr(true); break;
                case 'auth/weak-password': errAlert("Password should be atleast 6 characters!"); setPasswordErr(true); break;
            }
            setLoad(false);
            setDisableBtn(false);
        });
        
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.text_header}>Register Now!</Text>
            </View>

            <Animatable.View animation="fadeInUpBig" style={styles.footer} duration={500}>
                <View style={styles.inputItem}>
                    <Feather name="user" color={colors.text} size={20} style={{paddingRight: 10}} />
                    <TextInput placeholder="Your Name" placeholderTextColor="#666666"
                    style={styles.textInput} onChangeText={(name) => setName(name)}>
                    </TextInput>
                    {(nameErr) ?
                    <Feather name="x-circle" color="red" size={20}></Feather>
                    : <Feather name="check-circle" color="green" size={20}></Feather>}
                </View>
                
                {(emptyName) ?
                <Animatable.View animation="bounceIn" duration={500}>
                <Text style={styles.errorMsg}>Name is mandatory!</Text>
                </Animatable.View>
                : <Text style={styles.errorMsg}></Text>
                }
                
                <View style={styles.inputItem}>
                    <FontAwesome name="at" color={colors.text} size={20} style={{paddingRight: 10}} />
                    <TextInput placeholder="Your Email" placeholderTextColor="#666666" autoCapitalize="none"
                    style={styles.textInput} onChangeText={(email) => setEmail(email)}></TextInput>
                    {(emailErr) ? 
                    <Feather name="x-circle" color="red" size={20}></Feather>
                    : <Feather name="check-circle" color="green" size={20}></Feather>
                    }
                </View>
                
                {(emptyEmail) ?
                <Animatable.View animation="bounceIn" duration={500}>
                <Text style={styles.errorMsg}>Email address is mandatory!</Text>
                </Animatable.View>
                : <Text style={styles.errorMsg}></Text>
                }
                
                <View style={styles.inputItem}>
                    <Feather name="lock" color={colors.text} size={20} style={{paddingRight: 10}} />
                    <TextInput placeholder="Enter Password" placeholderTextColor="#666666" autoCapitalize="none" secureTextEntry={true}
                    style={styles.textInput} onChangeText={(password) => setPassword(password)}></TextInput>
                    {(passwordErr) ? 
                    <Feather name="x-circle" color="red" size={20}></Feather>
                    :<Feather name="check-circle" color="green" size={20}></Feather>
                    }
                </View>
                {(emptyPassword) ?
                <Animatable.View animation="bounceIn" duration={500}>
                <Text style={styles.errorMsg}>Password is mandatory!</Text>
                </Animatable.View>
                : <Text style={styles.errorMsg}></Text>
                } 
                
                {(load) ?
                    <ActivityIndicator size="large" color="#3498DB"></ActivityIndicator>
                    : null
                }
                {(disableBtn) ? null : 
                <View style={styles.button}>
                        <TouchableOpacity style={[styles.signIn]} onPress={() => signUpHandler()}>
                            <LinearGradient colors={['#203a43', '#2c5364']} style={styles.signIn}>
                                <Text style={[styles.textSign, {color: '#fff'}]}>Sign Up</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('SignIn')} style={[styles.signIn, {borderColor: '#203a43', borderWidth: 1, marginTop: 15}]}>
                            <Text style={[styles.textSign, {color: '#203a43'}]}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                }
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
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#203a43',
    },
    textInput: {
        flex: 1,
        fontSize: 18,
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
        marginTop: 30,
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