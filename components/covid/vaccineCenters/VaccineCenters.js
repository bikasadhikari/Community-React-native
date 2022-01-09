import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Center from './centers/Center';

const VaccineCenters = ({route}) => {
    useEffect(() => {
      // console.log(route.params.centers)
    }, [])

    return (
        <ScrollView style={styles.container}>
            {route.params.centers.map(({center_id, address, name, fee_type}) => {
                return (
                   <TouchableOpacity style={styles.maincardView} key={center_id}>
                        <Center data={{address, name, fee_type}} />
                    </TouchableOpacity>
                )
            })} 
        </ScrollView>
    )
}

export default VaccineCenters;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    maincardView : {
        height: 120,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        borderRadius: 15,
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
        elevation: 8,
        overflow: 'hidden'
    }
})