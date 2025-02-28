import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const ButtonComponent = ({ title, onPress }: any) => {
  return (
    <TouchableOpacity
      style={style.button_container}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Text style={style.button_text}>{title}</Text>
    </TouchableOpacity>
  );
};

export default ButtonComponent;

const style = StyleSheet.create({
  button_container: {
    backgroundColor: "#00a884",
    alignItems: "center",
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(10),
    borderRadius: moderateScale(4),
  },
  button_text: {
    fontSize: moderateScale(14),
    color: "#ffffff",
  },
});
