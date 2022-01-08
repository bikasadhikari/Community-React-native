import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Dimensions, Image, TouchableOpacity, Touchable, Alert } from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';

const SplashScreen = ({navigation}) => {

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Animatable.Image animation="bounceIn" duration={500}
                source={require('../../assets/teamwork.jpg')}
                style={styles.logo}
                resizeMode="stretch" />
            </View>
            <Animatable.View style={[styles.footer]} animation="fadeInUpBig">
                <Text style={styles.title}>Stay connected with everyone!</Text>
                <Text style={styles.text}>Sign in with your account</Text>
                <View style={styles.button}>
                    <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                        <LinearGradient
                        colors={['#C39BD3', '#9B59B6']} 
                        style={styles.signIn}>
                            <Text style={styles.textSign}>Get Started</Text>
                            <MaterialIcons
                            name="navigate-next"
                            color="#fff"
                            size={20}/>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </View>
    );
};

const { height } = Dimensions.get("screen");
const height_logo = height * 0.28;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#9B59B6'
    },
    header: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footer: {
        flex: 1,
        backgroundColor: '#F8F9F9',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 50,
        paddingHorizontal: 30
    },
    logo: {
        width: height_logo,
        height: height_logo,
        borderRadius: 180,
    },
    title: {
        color: '#05375a',
        fontSize: 30,
        fontWeight: 'bold'
    },
    text: {
        color: 'grey',
        marginTop: 5
    }, 
    button: {
        alignItems: 'flex-end',
        marginTop: 30
    },
    signIn: {
        width: 150,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        flexDirection: 'row'
    },
    textSign: {
        color: '#fff',
        fontWeight: 'bold'
    }
})

export default SplashScreen;