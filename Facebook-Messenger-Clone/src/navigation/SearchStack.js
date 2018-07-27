import React, { Component } from 'react';
import {createStackNavigator} from 'react-navigation';
import { BottomTabNavigation } from './BottomTabNavigation';
import SearchScreen from '../screens/SearchScreen/SearchScreen';


export const SearchStack = createStackNavigator(
    {
        BottomTabNavigation: {
            screen: BottomTabNavigation,
            navigationOptions: {
                gesturesEnabled: false
            }
        },
        SearchScreen: {
            screen: SearchScreen,
            navigationOptions: { gesturesEnabled: false }
        }
    },
    {
        mode: 'modal',
        headerMode: 'none'
    }
);