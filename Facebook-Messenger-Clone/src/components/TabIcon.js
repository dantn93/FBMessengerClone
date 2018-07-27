import React, { Component } from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types'

export default class TabIcon extends Component {
    render() {
        const {name, tintColor} = this.props;
        return (
            <Icon 
                name={name}
                size={30}
                color={tintColor}
            />
        );
    }
}
TabIcon.propTypes = {
    name: PropTypes.string,
    tintColor: PropTypes.string
}