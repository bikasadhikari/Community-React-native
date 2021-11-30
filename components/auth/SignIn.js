import React from "react";
import { View, Text, TouchableOpacity, TextInput, Platform, StyleSheet, StatusBar, Alert, Touchable } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useTheme } from "@react-navigation/native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { LinearGradient } from "expo-linear-gradient";

const SignIn = ({navigation}) => {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#009387' barStyle="light-content"/>
            <View style={styles.header}>
                <Text style={styles.text_header}>Welcome!</Text>
            </View>
            <Animatable.View animation="fadeInUpBig" style={[styles.footer, {backgroundColor: colors.background}]}>
                <Text style={[styles.text_footer, {color: colors.text}]}>Email</Text>
                <View style={styles.action}>
                    <FontAwesome name="at" color={colors.text} size={20} />
                    <TextInput placeholder="Your Email" placeholderTextColor="#666666"
                    autoCapitalize="none" style={[styles.textInput, {color: colors.text}]}></TextInput>
                    <Animatable.View animation="bounceIn">
                        <Feather name='check-circle' color='green' size={20} />
                    </Animatable.View>
                </View>
                    <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>Username must be 5 characters long.</Text>
                    </Animatable.View>

                    <Text style={[styles.text_footer, {color: colors.text, marginTop: 35, backgroundColor: colors.background}]}>Password</Text>
                    <View style={styles.action}>
                        <Feather name="lock" color={colors.text} size={20}/>
                        <TextInput placeholder="Your Password" placeholderTextColor="#666666"
                        secureTextEntry={true} autoCapitalize='none' style={[styles.textInput, {color: colors.text}]}></TextInput>
                        <TouchableOpacity>
                            <Feather name="eye-off" color='grey' size={20} />
                            {/* <Feather name="eye" color='grey' size={20} /> */}
                        </TouchableOpacity>
                    </View>
                    <Animatable.View name="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>Password must be 6 characters long.</Text>
                    </Animatable.View>

                    <TouchableOpacity>
                        <Text style={{color: '#009387', marginTop: 15}}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <View style={styles.button}>
                        <TouchableOpacity style={[styles.signIn]}>
                            <LinearGradient colors={['#08d4c4', '#01ab9d']} style={styles.signIn}>
                                <Text style={[styles.textSign, {color: '#fff'}]}>Sign In</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={[styles.signIn, {borderColor: '#009387', borderWidth: 1, marginTop: 15}]}>
                            <Text style={[styles.textSign, {color: '#009387'}]}>Sign Up</Text>
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
        backgroundColor: '#fff',
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
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        paddingLeft: 10,
        color: '#05375a'
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