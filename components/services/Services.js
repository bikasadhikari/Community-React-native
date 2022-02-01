import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Services = ({navigation}) => {
    return (
        <View style={styles.container}>
        <View style={styles.titleBar}>
            <Text style={styles.headerText}>Services</Text>
        </View>
        <View style={styles.serviceContainer}>
            <TouchableOpacity style={styles.serviceItem} onPress={() => navigation.navigate('Buy')}>
                <Image source={require('../../assets/buy-button.png')} style={{width: 100, height: 100}} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.serviceItem} onPress={() => navigation.navigate('Sell')}>
                <Image source={require('../../assets/selling.png')} style={{width: 100, height: 100}} />
            </TouchableOpacity>
        </View>
        </View>
    )
}

export default Services;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    titleBar: {
        height: 60,
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between',
        // paddingTop: Platform.OS === 'ios' ? 0 : Constants.statusBarHeight,
        paddingLeft: 20,
        paddingRight: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f7f9f9',
    },
    headerText: {
        fontSize: 23,
        textTransform: 'uppercase',
        fontWeight: '600',
        color: '#000'
    },
    serviceContainer: {
        flex: 1,
        padding: 30,
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    serviceItem: {
        height: 100
    }
})