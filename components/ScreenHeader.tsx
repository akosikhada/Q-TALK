import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { DarkModeText, ResponsiveSize } from "./StyledComponents";

interface ScreenHeaderProps {
  title: string;
  leftIcon?: string;
  rightIcon?: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  isDarkMode: boolean;
  showBorder?: boolean;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  isDarkMode,
  showBorder = true,
}) => {
  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: isDarkMode ? "#1A202C" : "#FFFFFF",
          borderBottomColor: isDarkMode ? "#2D3748" : "#E5E7EB",
          borderBottomWidth: showBorder ? StyleSheet.hairlineWidth : 0,
        },
      ]}
    >
      {leftIcon && (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={onLeftPress}
          disabled={!onLeftPress}
        >
          <Feather
            name={leftIcon as any}
            size={ResponsiveSize.font(22)}
            color={isDarkMode ? "#FFFFFF" : "#1F2937"}
          />
        </TouchableOpacity>
      )}
      <DarkModeText style={styles.headerTitle}>{title}</DarkModeText>
      {rightIcon ? (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={onRightPress}
          disabled={!onRightPress}
        >
          <Feather
            name={rightIcon as any}
            size={ResponsiveSize.font(22)}
            color={isDarkMode ? "#FFFFFF" : "#1F2937"}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.headerButton} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: ResponsiveSize.padding(16),
    paddingVertical: ResponsiveSize.padding(12),
    width: "100%",
  },
  headerTitle: {
    fontSize: ResponsiveSize.font(18),
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  headerButton: {
    width: ResponsiveSize.width(40),
    height: ResponsiveSize.width(40),
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ScreenHeader;
