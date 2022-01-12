import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Modal, Pressable } from 'react-native';

const Center = ({data}) => {

    useEffect(() => {
        console.log(data)
    }, [])
    return (
        <View style={styles.container}>
            <View style={styles.containerLeft}>
                <View style={styles.metadata}>
                    <Text numberOfLines={3} style={styles.address}>{data.address}</Text>
                    <Text style={styles.name}>{data.name}</Text>
                </View>
                <View style={styles.vaccine}>
                    { (data.isCovishield) ?
                    <Text style={styles.vaccineText}>COVISHIELD</Text> : null }
                    { (data.isCovaxin) ? 
                    <Text style={styles.vaccineText}>COVAXIN</Text> : null }
                </View>
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
    containerLeft: {
        flex: 4,
        paddingLeft: 15,
        paddingRight: 5
    },
    metadata: {
        backgroundColor: '#f7f0f0',
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
        justifyContent: 'center',
        flex: 1,
        paddingLeft: 5,
        paddingRight: 15
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
    },
    vaccine: {
        marginTop: 15,
        justifyContent: 'space-evenly',
        flexDirection: 'row',
    },
    vaccineText: {
        width: 90,
        borderRadius: 10,
        color: '#000',
        backgroundColor: '#f7f0f0',
        textAlign: 'center',
        paddingTop: 5,
        paddingBottom: 5,
        fontWeight: 'bold'
    }
})