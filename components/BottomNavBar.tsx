import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ResponsiveSize } from "./StyledComponents";

type TabItem = {
  name: "Messages" | "Calls" | "Contacts" | "Settings";
  label: string;
  icon: string;
  activeIcon?: string;
  iconFamily?: "Feather" | "Ionicons";
  badge?: number;
};

type BottomNavBarProps = {
  activeTab: "Messages" | "Calls" | "Contacts" | "Settings";
  navigation: any;
  isDarkMode: boolean;
  badges?: {
    Messages?: number;
    Calls?: number;
    Contacts?: number;
    Settings?: number;
  };
};

const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  navigation,
  isDarkMode,
  badges = {},
}) => {
  const insets = useSafeAreaInsets();
  const animatedValues = useRef({
    Messages: new Animated.Value(activeTab === "Messages" ? 1 : 0),
    Calls: new Animated.Value(activeTab === "Calls" ? 1 : 0),
    Contacts: new Animated.Value(activeTab === "Contacts" ? 1 : 0),
    Settings: new Animated.Value(activeTab === "Settings" ? 1 : 0),
  }).current;

  useEffect(() => {
    // Animate the active tab
    Object.keys(animatedValues).forEach((tab) => {
      Animated.spring(animatedValues[tab as keyof typeof animatedValues], {
        toValue: activeTab === tab ? 1 : 0,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }).start();
    });
  }, [activeTab, animatedValues]);

  const handleTabPress = (tabName: string) => {
    // Don't navigate if we're already on this tab
    if (tabName === activeTab) return;

    // Use the common navigation pattern
    if (navigation) {
      // For main tab screens
      if (
        tabName === "Messages" ||
        tabName === "Calls" ||
        tabName === "Contacts" ||
        tabName === "Settings"
      ) {
        // Check if we have a parent navigator
        const rootNavigation = navigation.getParent() || navigation;
        rootNavigation.navigate("TabNavigator", { screen: tabName });
      }
    }
  };

  const tabs: TabItem[] = [
    {
      name: "Messages",
      label: "Chats",
      icon: "message-square",
      activeIcon: "chatbubble",
      iconFamily: activeTab === "Messages" ? "Ionicons" : "Feather",
      badge: badges.Messages,
    },
    {
      name: "Calls",
      label: "Calls",
      icon: "phone",
      badge: badges.Calls,
    },
    {
      name: "Contacts",
      label: "Contacts",
      icon: "users",
      badge: badges.Contacts,
    },
    {
      name: "Settings",
      label: "Settings",
      icon: "settings",
      badge: badges.Settings,
    },
  ];

  const renderIcon = (tab: TabItem) => {
    const isActive = activeTab === tab.name;
    const color = isActive
      ? isDarkMode
        ? "#25BE80"
        : "#1A8D60"
      : isDarkMode
      ? "#A0A0A0"
      : "#9AA5B4";

    const scale = animatedValues[tab.name].interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.15],
    });

    const opacity = animatedValues[tab.name].interpolate({
      inputRange: [0, 1],
      outputRange: [0.8, 1],
    });

    const iconContent =
      tab.iconFamily === "Ionicons" ? (
        <Ionicons
          name={tab.activeIcon as any}
          size={ResponsiveSize.font(22)}
          color={color}
        />
      ) : (
        <Feather
          name={tab.icon as any}
          size={ResponsiveSize.font(22)}
          color={color}
        />
      );

    return (
      <Animated.View
        style={{
          transform: [{ scale }],
          opacity,
        }}
      >
        {iconContent}
      </Animated.View>
    );
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
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: isDarkMode ? 0.2 : 0.1,
          shadowRadius: 3,
          elevation: 5,
        },
      ]}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.name;

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.navItem}
            onPress={() => handleTabPress(tab.name)}
            activeOpacity={0.7}
          >
            {renderIcon(tab)}

            {tab.badge && tab.badge > 0 && (
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>
                  {tab.badge > 99 ? "99+" : tab.badge}
                </Text>
              </View>
            )}

            <Text
              style={[
                styles.navText,
                {
                  color: isActive
                    ? isDarkMode
                      ? "#25BE80"
                      : "#1A8D60"
                    : isDarkMode
                    ? "#A0A0A0"
                    : "#9AA5B4",
                  fontWeight: isActive ? "600" : "400",
                },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
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
    zIndex: 1000,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    position: "relative",
  },
  navText: {
    fontSize: ResponsiveSize.font(12),
    marginTop: ResponsiveSize.padding(4),
  },
  badgeContainer: {
    position: "absolute",
    top: -5,
    right: "25%",
    backgroundColor: "#FF5252",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: ResponsiveSize.font(10),
    fontWeight: "bold",
  },
});

export default BottomNavBar;
