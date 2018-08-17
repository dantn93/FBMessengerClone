jest.unmock('redux-mock-store')
jest.unmock('redux-thunk')
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
// const middlewares = [thunk];
const mockStore = configureStore()


import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

const store = mockStore();

beforeEach(() => {
  store.clearActions();
});

test('Goto ChatScreen', () => {
    const id = '1945858485472454';
    const roomid = '13764708'
    store.dispatch({ type: "GOTO_CHAT", data: { id, roomid } });

    const expectObj = [{"data": {"id": "1945858485472454", "roomid": "13764708"}, "type": "GOTO_CHAT"}];
    expect(store.getActions()).toEqual(expectObj);
});

test('Go back', () => {
    store.dispatch({ type: "GO_BACK" });
    const expectObj = [ { type: 'GO_BACK' } ];
    expect(store.getActions()).toEqual(expectObj);
});
