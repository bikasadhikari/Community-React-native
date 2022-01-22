import React, {useEffect, useState, useImperativeHandle, forwardRef} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {auth, firestore} from '../../../firebase';

const Info = (props, ref) => {

    const [name, setName] = useState('')
    const [stats, setStats] = useState({
        'posts': 0,
        'points': 0,
        'likes': 0
    })

    useImperativeHandle(ref, () => ({
        fetchName: () => { fetchName() }
    }))

    useEffect(() => {
        fetchName()
    }, [])

    const fetchName = () => {
        firestore.collection('users')
        .doc(auth.currentUser.uid)
        .get()
        .then(snapshot => {
            setName(snapshot.data().name)
            try {
                setStats({
                    'posts': snapshot.data().posts.length,
                    'likes': snapshot.data().likes.length,
                    'points': snapshot.data().points
                })
            } catch(e) {
                console.log(e.message)
            }
        })
    }

    return (
        <View>
            <View style={styles.infoContainer}>
                <Text style={styles.text}>{name}</Text>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statsBox}>
                    <Text style={[styles.text, {fontSize: 26}]}>{stats.posts}</Text>
                    <Text style={[styles.text, styles.subText]}>Posts</Text>
                </View>
                <View style={[styles.statsBox, {borderColor: '#dfd8c8',borderLeftWidth: 1, borderRightWidth: 1}]}>
                    <Text style={[styles.text, {fontSize: 26}]}>{stats.points}</Text>
                    <Text style={[styles.text, styles.subText]}>Points</Text>
                </View>
                <View style={styles.statsBox}>
                    <Text style={[styles.text, {fontSize: 26}]}>{stats.likes}</Text>
                    <Text style={[styles.text, styles.subText]}>Likes</Text>
                </View>
            </View>
        </View>
    )
}

export default forwardRef(Info);

const styles = StyleSheet.create({
    infoContainer: {
        alignSelf: 'center',
        alignItems: 'center',
        marginTop: 16
    },
    text: {
        fontWeight: "200",
        fontSize: 30,
        color: '#52575d'
    },
    statsContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 32
    },
    statsBox: {
        alignItems: 'center',
        flex: 1
    },
    subText: {
        fontSize: 15,
        color: '#aeb5bc',
        fontWeight: 'bold',
        textTransform: 'uppercase'
    }
})