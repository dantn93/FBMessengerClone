import React, { Component } from 'react';
import {View, Text, FlatList} from 'react-native';
import { BottomScreenStyles } from '@config/styles';
import axios from 'axios';
import { users } from '@assets/fake_data';


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