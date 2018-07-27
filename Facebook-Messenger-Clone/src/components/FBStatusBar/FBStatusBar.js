import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import styles from './styles';

export const FBStatusBar = props => {
    return (
        <View
            style={[
                styles.statusBar,
                { backgroundColor: props.backgroundColor}
            ]}
        >
            <StatusBar 
                translucent
                backgroundColor={props.backgroundColor}
                {...props}
            />
        </View>
    );
};