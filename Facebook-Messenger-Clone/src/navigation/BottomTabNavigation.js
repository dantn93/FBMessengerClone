import React, { Component } from 'react';
import { View, Text } from 'react-native';
import {createBottomTabNavigator} from 'react-navigation';
import {HomeTabNavigation} from './HomeTabNavigation';
import PeopleScreen from '../screens/PeopleScreen/PeopleScreen';
import TabIcon from '../components/TabIcon';
import CameraScreen from '../screens/CameraScreen/CameraScreen';
import GamesScreen from '../screens/GamesScreen/GamesScreen';
import PopularScreen from '../screens/PopularScreen/PopularScreen';


const HomeTabIcon = ({ tintColor }) => (
    <TabIcon name={'home'} tintColor={tintColor}/>
)

const PeopleTabIcon = ({ tintColor }) => (
    <TabIcon name={'supervisor-account'} tintColor={tintColor}/>
)

const CameraTabIcon = ({ tintColor }) => (
    <TabIcon name={'photo-camera'} tintColor={tintColor}/>
)

const GamesTabIcon = ({ tintColor }) => (
    <TabIcon name={'gamepad'} tintColor={tintColor}/>
)

const PopularTabIcon = ({ tintColor }) => (
    <TabIcon name={'cloud-circle'} tintColor={tintColor}/>
)
export const BottomTabNavigation = createBottomTabNavigator(
    {
        HomeScreen: {
            screen: HomeTabNavigation,
            navigationOptions: {
                header: null, tabBarIcon: HomeTabIcon
            }
        },

        PeopleScreen: {
            screen: PeopleScreen,
            navigationOptions: {
                header: null, tabBarIcon: PeopleTabIcon
            }
        },

        CameraTabScreen: {
            screen: CameraScreen,
            navigationOptions: ({navigation}) => ({
                header: null,
                tabBarIcon: CameraTabIcon,
                tabBarOnPress: ({navigation}) => {
                    navigation.navigate('CameraScreen')
                }
            })
        },

        GamesScreen: {
            screen: GamesScreen,
            navigationOptions: {
                header: null, tabBarIcon: GamesTabIcon
            }
        },

        PopularScreen: {
            screen: PopularScreen,
            navigationOptions: {
                header: null, tabBarIcon: PopularTabIcon
            }
        }

    },{
        tabBarOptions: {
            showLabel: false,
            activeTintColor: '#0084ff',
            inactiveTintColor: '#626262',
            pressColor: '#7f8c8d',
        }
    }
)