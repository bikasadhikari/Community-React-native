import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';

const Locations = () => {

    const [mapRegion, setMapRegion] = useState({
        latitude: 12.971599,
        longitude: 77.594566,
        latitudeDelta: 0.04,
        longitudeDelta: 0.05
    });
    const [marker, setMarker] = useState(mapRegion);
    const [location, setLocation] = useState(mapRegion);
    
    useEffect(() => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            return;
          }
    
          let location = await Location.getCurrentPositionAsync({});
          setMapRegion({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.04,
              longitudeDelta: 0.05
          })
          setMarker({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          })
        })();
    }, []);

    useEffect(() => {
        const getLocation = async() => {
            let response = await Location.reverseGeocodeAsync({
                latitude: marker.latitude,
                longitude: marker.longitude
            })
            setLocation({
                postalCode: response[0].postalCode,
                street: response[0].street,
                district: response[0].district
            })
        }
        getLocation();
    }, [marker]);

    const getStreet = async (event) => {
        const coord = event.nativeEvent.coordinate;
        setMarker(coord);
        setMapRegion({
            latitude: coord.latitude,
            longitude: coord.longitude,
            latitudeDelta: 0.04,
            longitudeDelta: 0.05
        });
    }

    return (
        <>
        <View style={styles.container}>
            <MapView style={styles.map}
            initialRegion={mapRegion}
            region={mapRegion}
            showsUserLocation={true} 
            zoomEnabled={true} 
            onPress={(e) => getStreet(e)}>
                <MapView.Marker coordinate={(marker) ? marker : mapRegion} title={location.district + " " + location.postalCode}>
                </MapView.Marker>
            </MapView>

            <TouchableOpacity style={styles.button}>
                <View style={styles.setloc}>
                    <Text style={styles.buttontxt}>Set Location</Text>
                </View>
            </TouchableOpacity>
        </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    map: {
        flex: 13
    },
    button: {
        flex: 1,
        padding: 30
    },
    setloc: {
        alignItems: 'center',
        height: 50,
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 50,
        borderColor: "#9B59B6"
    },
    buttontxt: {
        fontSize: 20,
        fontWeight: 'bold',
        color: "#9B59B6"
    }
})


export default Locations;