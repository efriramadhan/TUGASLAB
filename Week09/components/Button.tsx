import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { styles, colors } from "../styles";
import { Ionicons } from "@expo/vector-icons";

interface ButtonProps {
  title: string;
  onPress: () => void;
  color?: string;
  icon: keyof typeof Ionicons.glyphMap;
  style?: any;
}

export const Button = ({
  title,
  onPress,
  color = colors.primary,
  icon,
  style,
}: ButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }, style]}
      onPress={onPress}
      activeOpacity={0.8}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={24} color={colors.white} />
      </View>
      <View style={{ width: "70%", alignItems: "center" }}>
        <Text style={styles.buttonText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};
