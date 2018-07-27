import {createStackNavigator} from 'react-navigation';
import {ModalStack} from './ModalStack';
import ChatScreen from '../screens/ChatScreen/ChatScreen';
import SplashScreen from '../screens/SplashScreen/SplashScreen';

import {
    createStore,
    applyMiddleware,
    combineReducers,
  } from 'redux';
import {
    reduxifyNavigator,
    createReactNavigationReduxMiddleware,
    createNavigationReducer,
  } from 'react-navigation-redux-helpers';
import { Provider, connect } from 'react-redux';

export const MessengerApp = createStackNavigator(
    {
        SplashScreen: {
            screen: SplashScreen,
            navigationOptions: { gesturesEnabled: false, header: null }
        },
        MainScreen: {
            screen: ModalStack,
            navigationOptions: {
                gesturesEnable: false, header: null
            }
        },
        ChatScreen: {
            screen: ChatScreen,
            navigationOptions: {gesturesEnabled: false, header: null}
        }
    }
)

const mapStateToProps = (state) => ({
  state: state.nav,
});

const middleware = createReactNavigationReduxMiddleware(
    "root",
    state => state.nav,
);
const App = reduxifyNavigator(MessengerApp, "root");
const AppWithNavigator = connect(mapStateToProps)(App);

export default AppWithNavigator;