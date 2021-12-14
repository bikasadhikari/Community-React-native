import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f9f9'
    },
    wrapper: {
        paddingHorizontal: 30,
        paddingVertical: 20,
    },
    header: {
        fontSize: 25,
        textAlign: 'center',
        padding: 30,
        color: '#9B59B6'
    },
    item: {
        paddingVertical: 20
    },
    itemHeading: {
        fontSize: 22,
        paddingBottom: 10
    },
    itemDesc: {
        fontSize: 18,
        backgroundColor: '#fff',
        paddingTop: 10,
        paddingBottom: 10
    },
    button: {
        marginTop: 40,
        padding: 10,
        paddingHorizontal: 30,
        borderRadius: 15
    },
    buttonTxt: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center'
    }
})