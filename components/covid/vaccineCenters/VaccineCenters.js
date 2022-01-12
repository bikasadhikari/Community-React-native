import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Center from './centers/Center';

const VaccineCenters = ({route}) => {
    useEffect(() => {
    //   console.log(route.params.centers)
    }, [])

    return (
        <ScrollView style={styles.container}>
            {route.params.centers.map(({center_id, address, name, fee_type, sessions}) => {
                let isCovishield = false
                let isCovaxin = false
                sessions.map(({vaccine}) => {
                    if (vaccine == "COVAXIN") {
                        isCovaxin = true
                    }
                    if (vaccine == "COVISHIELD") {
                        isCovishield = true
                    }
                })
                return (
                   <View style={styles.maincardView} key={center_id}>
                        <Center data={{address, name, fee_type, isCovishield, isCovaxin}} />
                    </View>
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
        height: 170,
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