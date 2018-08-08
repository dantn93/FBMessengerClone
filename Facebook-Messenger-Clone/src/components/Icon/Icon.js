import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";
import { AppStyles } from "@config/styles";

export default class Icon extends Component {
  render() {
    let icon;
    const { name, type, size, color, style, onPress } = this.props;
    switch (type) {
      case "material":
        icon = <MaterialIcon name={name} size={size} color={color} />;
        break;
      case "material-community":
        icon = <MaterialCommunityIcon name={name} size={size} color={color} />;
        break;
      case "entypo":
        icon = <Entypo name={name} size={size} color={color} />;
        break;
      case "fontawesome":
        icon = <FontAwesomeIcon name={name} size={size} color={color} />;
        break;
    }
    return (
      <TouchableOpacity style={style ? style : {}} onPress={onPress}>
        {icon}
      </TouchableOpacity>
    );
  }
}

Icon.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  size: PropTypes.number,
  color: PropTypes.string,
  onPress: PropTypes.func,
  style: PropTypes.object
};

Icon.defaultProps = {
  type: "material",
  color: AppStyles.colors.accentColor,
  size: 24
};
