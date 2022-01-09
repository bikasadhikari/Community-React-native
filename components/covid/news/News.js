import React, { useState, useEffect } from 'react'
import { View, ScrollView, Alert } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import axios from 'axios'
import Article from './articles/Article'

const News = ({navigation}) => {

    const[loading, setLoading] = useState(false)
    const[articles, setArticles] = useState(null)

    const getArticles = () => {
        axios.get("https://newsapi.org/v2/top-headlines?country=in&category=health&q=covid&apiKey=be7ff02b3f314ee4861f4195604a5c79")
        .then((result) => {
            setArticles(result.data)
            setLoading(false)
        })
        .catch((error) => {
            Alert.alert("Error", error.message)
            setLoading(false)
        })
    }

    useEffect(() => {
        setLoading(true)
        getArticles()
    }, [])


    if (articles && !loading) {
    return(
        <ScrollView>
            <Article nav={navigation} data={articles} />
        </ScrollView>
    )
    }

    return (
        <Spinner visible={true} />
    )
}

export default News;