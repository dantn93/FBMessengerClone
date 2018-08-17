jest.unmock('redux-mock-store')
jest.unmock('redux-thunk')
// import configureStore from 'redux-mock-store';
// import thunk from 'redux-thunk';
// const middlewares = [thunk];
// const mockStore = configureStore(middlewares);
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import reducers from '../src/redux/reduces/nav-reducer';
import mockStore from 'redux-mock-store';

const store = mockStore();
import { MessengerApp } from '../src/navigation/MessengerApp';
import { HomeTabNavigation } from '../src/navigation/HomeTabNavigation';


test('Initial State', () => {
    const initAction = MessengerApp.router.getActionForPathAndParams("SplashScreen");
    const initialNavState = MessengerApp.router.getStateForAction(
        initAction
    );

    const index = reducers(initialNavState, {}).index;
    expect(reducers(initialNavState, {}).routes[index].routeName).toBe('SplashScreen');
});

test('Active Screen go to ChatScreen', () => {
    const id = '1945858485472454';
    const roomid = '13764708';
    const action = { type: "GOTO_CHAT", data: {id, roomid} };
    const initAction = HomeTabNavigation.router.getActionForPathAndParams("ActiveScreen");
    const initialNavState = HomeTabNavigation.router.getStateForAction(
        initAction
    );
    const index = reducers(initialNavState, action).index;
    expect(reducers(initialNavState, action).routes[index].routeName).toBe('ChatScreen');
});


test('Message Screen go to ChatScreen', () => {
    const id = '1945858485472454';
    const roomid = '13764708';
    const action = { type: "GOTO_CHAT", data: {id, roomid} };
    const initAction = HomeTabNavigation.router.getActionForPathAndParams("MessagesScreen");
    const initialNavState = HomeTabNavigation.router.getStateForAction(
        initAction
    );
    const index = reducers(initialNavState, action).index;
    expect(reducers(initialNavState, action).routes[index].routeName).toBe('ChatScreen');
});