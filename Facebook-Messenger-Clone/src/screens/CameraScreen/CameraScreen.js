import React, { Component } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import { BottomScreenStyles } from '@config/styles'

export default class CameraScreen extends Component {
    state = {  }
    render() {
        return (
            <View style={[BottomScreenStyles.container, styles.container]}
                testID="CameraScreen"
            >
                <Text>Camera Screen</Text>
                <TouchableOpacity
                    style={styles.touchBack}
                    onPress={() => this.props.navigation.goBack(null)}
                    testID="CameraGoBack"
                    >
                    <Image
                        source={require("@assets/images/icons8-back-filled-100.png")}
                        style={styles.backImage}
                    />
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    touchBack: {
        top: 30,
        left: 10,
        width: 30,
        height: 30,
        position: "absolute",
        zIndex: 1
      },
    backImage: {
        width: 30,
        height: 30
    },
});
