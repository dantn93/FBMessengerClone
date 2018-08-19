import React, { Component } from 'react';
import {View, Text} from 'react-native';
import { BottomScreenStyles } from '@config/styles';

export default class GamesScreen extends Component {
    state = {  }
    render() {
        return (
            <View style={BottomScreenStyles.container}
                testID="GameScreen"
            >
                <Text>Games Screen</Text>
            </View>
        );
    }
}