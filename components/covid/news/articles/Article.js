import React, {useEffect, useState} from 'react';
import { View, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import ArticleItem from './articleItem/ArticleItem';

const Article = ({nav, data}) => {
    const[articles, setArticles] = useState([])

    useEffect(() => {
        // console.log(nav)
        setArticles(data.articles)
    }, [])

    function loadBrowser(URL) {
        Linking.openURL(URL).catch(err => Alert.alert("Error", err.message))
    }

    if (articles) {
        return (
            <View style={styles.container}>
                {articles.map(({title, description, url}) => {
                    return (
                    <TouchableOpacity key={url} style={styles.maincardView} onPress={() => loadBrowser(url)} >
                        <ArticleItem data={{title, description}} />
                    </TouchableOpacity>
                    )
                })}
            </View>
        )
    }
    return (
        <View>  
        </View>
    )
}

export default Article;

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
        overflow: 'hidden',
        padding: 10
    }
})