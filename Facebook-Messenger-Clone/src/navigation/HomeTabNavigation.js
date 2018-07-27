import { Platform } from 'react-native';
import {createMaterialTopTabNavigator} from 'react-navigation';
import MessagesScreen from '../screens/MessagesScreen/MessagesScreen';
import CallsScreen from '../screens/CallsScreen/CallsScreen';
import ActiveScreen from '../screens/ActiveScreen/ActiveScreen';
import GroupsScreen from '../screens/GroupScreen/GroupsScreen';

export const HomeTabNavigation = createMaterialTopTabNavigator(
    {
        MessagesScreen: {
            screen: MessagesScreen,
            navigationOptions: {header: null, title: 'Message'}
        },
        ActiveScreen: {
            screen: ActiveScreen,
            navigationOptions: {header: null, title: 'Active'}
        },
        GroupsScreen: {
            screen: GroupsScreen,
            navigationOptions: {header: null, title: 'Groups'}
        },
        CallsScreen: {
            screen: CallsScreen,
            navigationOptions: {header: null, title: 'Calls'}
        }
    },{
        tabBarPosition: 'top',
        tabBarOptions: {
            activeTintColor: '#0084ff',
            inactiveTintColor: '#626262',
            // pressColor: '#7f8c8d',
            labelStyle: {
                fontWeight: 'bold',
                fontSize: Platform.OS === 'ios' ? 11 : 12
            },
            indicatorStyle: {
                backgroundColor: '#0084ff'
            },
            style: {
                backgroundColor: 'white',
                // paddingTop: 30
            }
        }
    });


    