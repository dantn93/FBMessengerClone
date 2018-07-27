import React, { Component } from 'react';
import {View, Text} from 'react-native';
import { BottomScreenStyles } from '@config/styles';

export default class PopularScreen extends Component {
    state = {  }
    render() {
        return (
            <View style={BottomScreenStyles.container}>
                <Text>Popular Screen</Text>
            </View>
        );
    }
}