/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
// import {AppWithNavigationState, store} from './src/navigation/MessengerApp';
import { Provider, connect } from 'react-redux';
import MessenderApp from './src/navigation/MessengerApp';
import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import {AppReducer} from './src/redux/reduces'

import AppWithNavigator from './src/navigation/MessengerApp';
const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export const store = createStore(
  AppReducer,
  applyMiddleware(logger)
)

export class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppWithNavigator />
      </Provider>
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
