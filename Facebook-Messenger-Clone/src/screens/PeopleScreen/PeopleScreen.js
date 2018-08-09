import React, { Component } from 'react';
import {View, Text, FlatList} from 'react-native';
import { BottomScreenStyles } from '@config/styles';

export default class PeopleScreen extends Component {
    state = {  
        people: []
    }

   
    render() {
        return (
            <View style={BottomScreenStyles.container}>
                <Text>People Screen</Text>
            </View>
        );
    }
}