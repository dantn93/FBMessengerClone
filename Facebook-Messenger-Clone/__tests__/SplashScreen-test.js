


import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
console.log(React.version);
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';

import SplashScreen from '../src/screens/SplashScreen/SplashScreen';
const middlewares = []; // you can mock any middlewares here if necessary
const mockStore = configureStore(middlewares);

const initialState = {
  preferences: {
    save_photos_locally: false,
    open_to_camera: false,
  },
};

describe('Testing CameraSettings', () => {
  it('renders as expected', () => {
    const wrapper = shallow(
      <SplashScreen />,
      { context: { store: mockStore(initialState) } },
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});