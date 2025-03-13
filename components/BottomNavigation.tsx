import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { DarkModeText, ResponsiveSize } from "./StyledComponents";

type NavigationTab = {
  name: string;
  icon: string;
  label: string;
};

interface BottomNavigationProps {
  activeTab: string;
  onTabPress: (tabName: string) => void;
  isDarkMode: boolean;
  tabs?: NavigationTab[];
}

const defaultTabs: NavigationTab[] = [
  { name: "messages", icon: "message-square", label: "Messages" },
  { name: "calls", icon: "phone", label: "Calls" },
  { name: "contacts", icon: "users", label: "Contacts" },
  { name: "settings", icon: "settings", label: "Settings" },
];

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabPress,
  isDarkMode,
  tabs = defaultTabs,
}) => {
  return (
    <View
      style={[
        styles.bottomNavigation,
        {
          backgroundColor: isDarkMode ? "#1A202C" : "#FFFFFF",
          borderTopColor: isDarkMode ? "#2D3748" : "#E5E7EB",
        },
      ]}
    >
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.name}
          style={styles.navItem}
          onPress={() => onTabPress(tab.name)}
        >
          <Feather
            name={tab.icon as any}
            size={ResponsiveSize.font(22)}
            color={
              activeTab === tab.name
                ? "#25BE80"
                : isDarkMode
                ? "#9AA5B4"
                : "#6B7280"
            }
          />
          <DarkModeText
            style={[
              styles.navLabel,
              {
                color:
                  activeTab === tab.name
                    ? "#25BE80"
                    : isDarkMode
                    ? "#9AA5B4"
                    : "#6B7280",
              },
            ]}
          >
            {tab.label}
          </DarkModeText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNavigation: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: ResponsiveSize.padding(10),
    borderTopWidth: 1,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: ResponsiveSize.padding(16),
  },
  navLabel: {
    fontSize: ResponsiveSize.font(12),
    marginTop: ResponsiveSize.padding(4),
    fontWeight: "500",
  },
});

export default BottomNavigation;
