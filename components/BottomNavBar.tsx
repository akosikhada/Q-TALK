import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ResponsiveSize } from "./StyledComponents";

type BottomNavBarProps = {
  activeTab: "Messages" | "Calls" | "Contacts" | "Settings";
  navigation: any;
  isDarkMode: boolean;
};

const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  navigation,
  isDarkMode,
}) => {
  const insets = useSafeAreaInsets();

  const navigateToTab = (tabName: string) => {
    if (navigation) {
      navigation.navigate(tabName);
    }
  };

  return (
    <View
      style={[
        styles.bottomNav,
        {
          borderTopColor: isDarkMode ? "#2D3748" : "#F5F7FA",
          backgroundColor: isDarkMode ? "#1A202C" : "#FFFFFF",
          paddingBottom:
            insets.bottom > 0 ? insets.bottom : ResponsiveSize.padding(8),
        },
      ]}
    >
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigateToTab("Messages")}
        activeOpacity={0.7}
      >
        {activeTab === "Messages" ? (
          <Ionicons
            name="chatbubble"
            size={ResponsiveSize.font(22)}
            color={isDarkMode ? "#25BE80" : "#1A8D60"}
          />
        ) : (
          <Feather
            name="message-square"
            size={ResponsiveSize.font(22)}
            color={isDarkMode ? "#A0A0A0" : "#9AA5B4"}
          />
        )}
        <Text
          style={[
            styles.navText,
            {
              color:
                activeTab === "Messages"
                  ? isDarkMode
                    ? "#25BE80"
                    : "#1A8D60"
                  : isDarkMode
                  ? "#A0A0A0"
                  : "#9AA5B4",
            },
          ]}
        >
          Chats
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigateToTab("Calls")}
        activeOpacity={0.7}
      >
        <Feather
          name="phone"
          size={ResponsiveSize.font(22)}
          color={
            activeTab === "Calls"
              ? isDarkMode
                ? "#25BE80"
                : "#1A8D60"
              : isDarkMode
              ? "#A0A0A0"
              : "#9AA5B4"
          }
        />
        <Text
          style={[
            styles.navText,
            {
              color:
                activeTab === "Calls"
                  ? isDarkMode
                    ? "#25BE80"
                    : "#1A8D60"
                  : isDarkMode
                  ? "#A0A0A0"
                  : "#9AA5B4",
            },
          ]}
        >
          Calls
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigateToTab("Contacts")}
        activeOpacity={0.7}
      >
        <Feather
          name="users"
          size={ResponsiveSize.font(22)}
          color={
            activeTab === "Contacts"
              ? isDarkMode
                ? "#25BE80"
                : "#1A8D60"
              : isDarkMode
              ? "#A0A0A0"
              : "#9AA5B4"
          }
        />
        <Text
          style={[
            styles.navText,
            {
              color:
                activeTab === "Contacts"
                  ? isDarkMode
                    ? "#25BE80"
                    : "#1A8D60"
                  : isDarkMode
                  ? "#A0A0A0"
                  : "#9AA5B4",
            },
          ]}
        >
          Contacts
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigateToTab("Settings")}
        activeOpacity={0.7}
      >
        <Feather
          name="settings"
          size={ResponsiveSize.font(22)}
          color={
            activeTab === "Settings"
              ? isDarkMode
                ? "#25BE80"
                : "#1A8D60"
              : isDarkMode
              ? "#A0A0A0"
              : "#9AA5B4"
          }
        />
        <Text
          style={[
            styles.navText,
            {
              color:
                activeTab === "Settings"
                  ? isDarkMode
                    ? "#25BE80"
                    : "#1A8D60"
                  : isDarkMode
                  ? "#A0A0A0"
                  : "#9AA5B4",
            },
          ]}
        >
          Settings
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    borderTopWidth: 1,
    paddingTop: ResponsiveSize.padding(8),
    paddingHorizontal: ResponsiveSize.padding(8),
  },
  navItem: {
    flex: 1,
    alignItems: "center",
  },
  navText: {
    fontSize: ResponsiveSize.font(12),
    marginTop: ResponsiveSize.padding(4),
  },
});

export default BottomNavBar;
