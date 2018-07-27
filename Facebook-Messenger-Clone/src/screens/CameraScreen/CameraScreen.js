import React, { Component } from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { BottomScreenStyles } from '@config/styles'

export default class CameraScreen extends Component {
    state = {  }
    render() {
        return (
            <View style={[BottomScreenStyles.container, styles.container]}>
                <Text>Camera Screen</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
