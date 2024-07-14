import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const PlayPuaseButton = (props: CustomButtonProps) => {
  return (
    <TouchableOpacity style={styles.btnContainer} onPress={props.onPress}>
      <FontAwesome name={props.icon} size={24} color="#FFF" />
    </TouchableOpacity>
  );
};

export default PlayPuaseButton;

const styles = StyleSheet.create({
  btnContainer: {
    backgroundColor: "#FDA681",
    width: 64,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
});
