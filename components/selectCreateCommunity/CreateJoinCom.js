import React from 'react';
import { Text, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

function createScreen() {
    return (
        <View>
            <Text>Create Community</Text>
        </View>
    )
}

function joinScreen() {
    return (
        <View>
            <Text>Join Community</Text>
        </View>
    )
}

const Tab = createMaterialTopTabNavigator();

const CreateJoinCom = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Create" component={createScreen} />
            <Tab.Screen name="Join" component={joinScreen} />
        </Tab.Navigator>
    )
}

export default CreateJoinCom;