import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ToastAndroid } from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import Spinner from 'react-native-loading-spinner-overlay';
import { auth, firestore } from '../../firebase';

const Locations = (props) => {

    const [mapRegion, setMapRegion] = useState({
        latitude: 12.971599,
        longitude: 77.594566,
        latitudeDelta: 0.04,
        longitudeDelta: 0.05
    });
    const [marker, setMarker] = useState(mapRegion);
    const [location, setLocation] = useState(mapRegion);
    

    useEffect(() => {
        (() => {
          let { status } =  Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            return;
          }
    
          let location =  Location.getCurrentPositionAsync({});
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
                district: response[0].district,
                country: response[0].country,
                city: response[0].city,
                locality: response[0].name,
                state: response[0].region
            })
        }
        getLocation();
    }, [marker]);

    const getStreet = async (event) => {
        const coord = await event.nativeEvent.coordinate;
        setMarker(coord);
        setMapRegion({
            latitude: coord.latitude,
            longitude: coord.longitude,
            latitudeDelta: 0.04,
            longitudeDelta: 0.05
        });
    }

    const [locationSaveLoad, setLocationSaveLoad] = useState(false);
    const saveLocation = () => {
        const { country, city, locality, state, postalCode, district,} = location;
        Alert.alert("Location", "Postal Code " + postalCode + " selected. Do you want to continue ?",
        [{
            text: "Continue",
            onPress: async() => {
                var userPincode = null
                setLocationSaveLoad(true)
                await firestore.collection('users')
                .where("uid", "==", auth.currentUser.uid)
                .get()
                .then(async(snapshot) => {
                    snapshot.docs.forEach(doc => {
                        userPincode = doc.data().pincode
                    })
                })
                .then(async() => {
                    if (userPincode == null) {
                        var members
                        var flag = 0
                        await firestore.collection('communities')
                        .where("pincode", "==", postalCode)
                        .get()
                        .then((snapshot) => {
                            snapshot.docs.forEach(doc => {
                                members = doc.data().members
                                flag = 1
                            })
                        })
                        .then(async() => {
                            if (flag == 0) {
                                await firestore.collection('communities')
                                .doc(postalCode)
                                .set({
                                    pincode: postalCode,
                                    members: 1
                                })
                            } else {
                                await firestore.collection('communities')
                                .doc(postalCode)
                                .update({
                                    members: members + 1
                                })
                            }
                        })
                    } else {
                        console.log("userPincode" + userPincode + "\n\n")
                        var curMembers
                        await firestore.collection('communities')
                        .where("pincode", "==", userPincode)
                        .get()
                        .then((snapshot) => {
                            snapshot.docs.forEach(doc => {
                                curMembers = doc.data().members
                            })
                        })
                        .then(async() => {
                            await firestore.collection('communities')
                            .doc(userPincode)
                            .update({
                                members: curMembers - 1
                            })
                            .then(() => {
                                console.log("subtracted")
                            })
                        })
                        .then(async() => {
                            var flag = 0
                            var members
                            await firestore.collection('communities')
                            .where('pincode', '==', postalCode)
                            .get()
                            .then((snapshot) => {
                                snapshot.docs.forEach(doc => {
                                    members = doc.data().members
                                    flag = 1
                                })
                            })
                            .then(async() => {
                                if (flag == 0) {
                                    await firestore.collection('communities')
                                    .doc(postalCode)
                                    .set({
                                        pincode: postalCode,
                                        members: 1
                                    })
                                } else {
                                    await firestore.collection('communities')
                                    .doc(postalCode)
                                    .update({
                                        members: members + 1
                                    })
                                }
                            })
                        })

                    }
                })
                .then(async() => {
                    console.log("saving")
                    await firestore.collection('users')
                    .doc(auth.currentUser.uid)
                    .update({
                        country: country,
                        city: city,
                        district: district,
                        locality: locality,
                        state: state,
                        pincode: postalCode,
                        comJoined: true
                    })
                    .then(() => {
                        setLocationSaveLoad(false)
                        ToastAndroid.show("Location saved", ToastAndroid.LONG)
                        console.log(props.route.params)
                        if (props.route.params.isProfile == true) {
                            props.navigation.goBack()
                        } else {
                            props.route.params.comjoin(true)
                        }
                    })
                })
                .catch(err => {
                    setLocationSaveLoad(false)
                    Alert.alert("Error", err.message)
                })
            }
                
        },
        {
            text: "Cancel",
            style: 'cancel',
            onPress: () => {
                setLocationSaveLoad(false)
            }
        }])
    }

    return (
        <>
        <View style={styles.container}>
            <Spinner 
            visible={locationSaveLoad}/>
            <MapView style={styles.map}
            initialRegion={mapRegion}
            region={mapRegion}
            showsUserLocation={true} 
            zoomEnabled={true} 
            onPress={(e) => getStreet(e)}>
                <MapView.Marker coordinate={(marker) ? marker : mapRegion} title={location.district + " " + location.postalCode}>
                </MapView.Marker>
            </MapView>

            <TouchableOpacity style={styles.button} onPress={() => saveLocation()}>
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
        borderColor: "#203a43"
    },
    buttontxt: {
        fontSize: 20,
        fontWeight: 'bold',
        color: "#203a43"
    }
})


export default Locations;