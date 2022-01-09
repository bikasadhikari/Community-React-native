import React, {useEffect, useState} from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

const ArticleItem = ({data}) => {
    
    useEffect(() => {
        // console.log(data)
    }, [])

    return (
        <View>
            <Text numberOfLines={2} style={styles.title}>{data.title}</Text>
            <Text numberOfLines={3} style={styles.desc}>{data.description}</Text>
        </View>
    )
}

export default ArticleItem;

const styles = StyleSheet.create({
    title: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 5
    }
})