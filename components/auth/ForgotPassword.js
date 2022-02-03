import { useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from "expo-linear-gradient";

import { auth } from "../../firebase";

const ForgotPassword = () => {
    const { colors } = useTheme();

    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [emptyEmail, setEmptyEmail] = useState(false);

    const resetHandler = () => {
        setIsLoading(true);
        if (email == '') {
            setEmptyEmail(true);
            setIsLoading(false);
            return;
        } else {
            setEmptyEmail(false);
        }
        auth.sendPasswordResetEmail(email)
        .then(() => {
            Alert.alert("Success", "Password reset email sent to your email address.")
            setIsLoading(false);
        })
        .catch((error) => {
            switch(error.code) {
                case 'auth/invalid-email': Alert.alert("Error", "Invalid email!"); break;
                case 'auth/user-not-found': Alert.alert("Error", "User not found!"); break;
                default: Alert.alert("Error", error.message);
            }
            setIsLoading(false);
        });
    }

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.text_header}>Forgot Password</Text>
            </View>
            <Animatable.View style={styles.footer} animation="fadeInUpBig" duration={300}>
            <Text style={[styles.text_footer, {color: colors.text}]}>Email</Text>
            <View style={styles.action}>
                <FontAwesome name="at" size={20} color={colors.text}></FontAwesome>
                <TextInput placeholder="Your Email" placeholderTextColor="#666666"
                autoCapitalize="none" style={styles.textinput}
                onChangeText={(email) => setEmail(email.trim())}></TextInput>
            </View>
            {(emptyEmail) ? 
            <Animatable.View animation="bounceIn">
                <Text style={styles.errorMsg}>Email address is mandatory!</Text>
            </Animatable.View> : null }
            <View style={styles.button}>
                {(isLoading) ? 
                <ActivityIndicator size="large" color="#3498DB"></ActivityIndicator> :
                <TouchableOpacity style={styles.resetPass} onPress={() => resetHandler()}>
                    <LinearGradient colors={['#203a43', '#2c5364']} style={styles.reset}>
                        <Text style={[styles.textreset, {color: '#fff'}]}>Reset Password</Text>
                    </LinearGradient>
                </TouchableOpacity>
                }
            </View>
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
        paddingBottom: 30
    },
    text_header: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold'
    },
    footer: {
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    text_footer: {
        fontSize: 18,
        color: '#05375a',
        marginTop: 10
    },
    action: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        borderBottomWidth: 1,
        borderColor: '#203a43',
        paddingBottom: 5
    },
    textinput: {
        flex: 1,
        paddingLeft: 10,
        fontSize: 16,
        color: '#05375a'
    },
    errorMsg: {
        color: 'red'
    },
    button: {
        marginTop: 50
    },
    resetPass: {
        height: 50,
        justifyContent: 'center',
        borderRadius: 10
    },
    reset: {
        alignItems: 'center',
        height: 50,
        justifyContent: 'center',
        borderRadius: 10
    },
    textreset: {
        fontSize: 18,
        fontWeight: 'bold',
    }
});

export default ForgotPassword;