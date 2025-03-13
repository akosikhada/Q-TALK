import React from "react";
import { View, TouchableOpacity, Switch, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import {
  DarkModeText,
  DarkModeSecondaryText,
  ResponsiveSize,
} from "./StyledComponents";

interface SettingItemProps {
  icon: string;
  iconColor?: string;
  title: string;
  subtitle?: string;
  value?: string | boolean;
  onPress?: () => void;
  hasToggle?: boolean;
  hasChevron?: boolean;
  disabled?: boolean;
  isDarkMode: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  iconColor,
  title,
  subtitle,
  value,
  onPress,
  hasToggle = false,
  hasChevron = true,
  disabled = false,
  isDarkMode,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.settingItem,
        {
          borderBottomColor: isDarkMode ? "#3D4A5C" : "#E5E7EB",
        },
      ]}
      onPress={onPress}
      activeOpacity={hasToggle ? 1 : 0.7}
      disabled={disabled}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: isDarkMode ? "#2D3748" : "#F3F4F6",
          },
        ]}
      >
        <Feather
          name={icon as any}
          size={ResponsiveSize.font(20)}
          color={iconColor || (isDarkMode ? "#A0A0A0" : "#9AA5B4")}
        />
      </View>
      <View style={styles.textContainer}>
        <DarkModeText style={styles.title}>{title}</DarkModeText>
        {subtitle && (
          <DarkModeSecondaryText style={styles.subtitle}>
            {subtitle}
          </DarkModeSecondaryText>
        )}
      </View>
      {typeof value === "string" && (
        <DarkModeSecondaryText style={styles.valueText}>
          {value}
        </DarkModeSecondaryText>
      )}
      {hasToggle && (
        <View style={styles.toggleContainer}>
          <Switch
            value={value as boolean}
            onValueChange={onPress as any}
            trackColor={{
              false: isDarkMode ? "#3D4A5C" : "#D8DEE6",
              true: isDarkMode ? "#25BE80" : "#1A8D60",
            }}
            thumbColor={"#FFFFFF"}
          />
        </View>
      )}
      {hasChevron && !hasToggle && (
        <View style={styles.chevronContainer}>
          <Feather
            name="chevron-right"
            size={ResponsiveSize.font(22)}
            color={isDarkMode ? "#A0A0A0" : "#9AA5B4"}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: ResponsiveSize.padding(16),
    paddingHorizontal: ResponsiveSize.padding(16),
    borderBottomWidth: StyleSheet.hairlineWidth,
    minHeight: ResponsiveSize.height(60),
  },
  iconContainer: {
    width: ResponsiveSize.width(40),
    height: ResponsiveSize.width(40),
    borderRadius: ResponsiveSize.width(20),
    alignItems: "center",
    justifyContent: "center",
    marginRight: ResponsiveSize.padding(16),
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: ResponsiveSize.font(16),
    fontWeight: "500",
  },
  subtitle: {
    fontSize: ResponsiveSize.font(14),
    marginTop: ResponsiveSize.padding(4),
  },
  valueText: {
    marginRight: ResponsiveSize.padding(12),
    fontSize: ResponsiveSize.font(14),
  },
  toggleContainer: {
    paddingHorizontal: ResponsiveSize.padding(8),
    minWidth: ResponsiveSize.width(60),
    alignItems: "center",
  },
  chevronContainer: {
    paddingHorizontal: ResponsiveSize.padding(8),
    minWidth: ResponsiveSize.width(40),
    alignItems: "center",
  },
});

export default SettingItem;
