import React, { Component } from 'react';
import { View, Text } from 'react-native';
import {createStackNavigator} from 'react-navigation';
import CameraScreen from '../screens/CameraScreen/CameraScreen';
import { SearchStack } from './SearchStack';
import { SearchHeader } from '../components/SearchHeader/SearchHeader';

export const ModalStack = createStackNavigator(
    {
        SearchStack: {
            screen: SearchStack,
            navigationOptions: ({navigation}) => ({
                gesturesEnabled: false,
                header: <SearchHeader navigation={navigation}/>
            })
        },
        CameraScreen: {
            screen: CameraScreen,
            navigationOptions: {gesturesEnable: false}
        }
    },
    {
        model: 'modal'
    }
);
