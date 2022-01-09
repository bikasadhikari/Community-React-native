import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Modal, Pressable } from 'react-native';

const Center = ({data}) => {

    useEffect(() => {
    }, [])
    return (
        <View style={styles.container}>
            <View style={styles.metadata}>
                <Text numberOfLines={3} style={styles.address}>{data.address}</Text>
                <Text style={styles.name}>{data.name}</Text>
            </View>
            <View style={styles.containerRight}>
                <Text numberOfLines={1} style={styles.feetype}>{data.fee_type}</Text>
            </View>
        </View>
    )
}

export default Center;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-evenly'
    },
    metadata: {
        backgroundColor: '#f7f0f0',
        width: '70%',
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 5
    },
    address: {
        textTransform: 'uppercase',
        fontWeight: 'bold',
        marginBottom: 5
    },
    containerRight: {
        justifyContent: 'center'
    },
    feetype: {
        backgroundColor: '#28B463',
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 5,
        paddingBottom: 5,
        color: '#fff',
        textTransform: 'uppercase',
        borderRadius: 5,
        fontWeight: 'bold'
    }
})