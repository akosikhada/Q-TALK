import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, ScrollView, Switch } from "react-native";
import {
  View,
  Text,
  TouchableOpacity,
  DarkModeWrapper,
  DarkModeText,
  DarkModeSecondaryText,
  ResponsiveSize,
  Avatar,
  BottomNavigation,
  SettingItem,
} from "../components";
import { ThemePreferencesModal } from "../components/modals";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

type SettingsScreenProps = {
  onLogout: () => void;
  navigation?: any;
};

const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onLogout,
  navigation,
}) => {
  const { isDarkMode, themePreference, setThemePreference } = useTheme();
  const [showThemeModal, setShowThemeModal] = useState(false);
  const insets = useSafeAreaInsets();

  const navigateToTab = (tabName: string) => {
    if (navigation) {
      // Navigate to the tab screen using the parent navigator
      const rootNavigation = navigation.getParent();
      if (rootNavigation) {
        rootNavigation.navigate("TabNavigator", { screen: tabName });
      }
    }
  };

  const navigateToScreen = (screenName: string) => {
    if (navigation) {
      // Get the parent navigator to navigate outside the tab navigator
      const rootNavigation = navigation.getParent();
      if (rootNavigation) {
        rootNavigation.navigate(screenName);
      }
    }
  };

  const getThemeValueText = () => {
    switch (themePreference) {
      case "light":
        return "Light Mode";
      case "dark":
        return "Dark Mode";
      case "system":
        return "System Default";
      default:
        return "System Default";
    }
  };

  return (
    <DarkModeWrapper>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: isDarkMode ? "#25BE80" : "#1A8D60",
            paddingTop: insets.top + ResponsiveSize.padding(10),
          },
        ]}
      >
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          paddingBottom: insets.bottom + ResponsiveSize.padding(100),
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <TouchableOpacity
          style={styles.profileSection}
          onPress={() => navigateToScreen("Profile")}
          activeOpacity={0.7}
        >
          <Avatar
            uri="https://randomuser.me/api/portraits/men/32.jpg"
            name="John Doe"
            size={60}
            backgroundColor={isDarkMode ? "#3D4A5C" : "#E8E8E8"}
          />
          <View style={styles.profileInfo}>
            <DarkModeText style={styles.profileName}>John Doe</DarkModeText>
            <DarkModeSecondaryText style={styles.profileStatus}>
              Available
            </DarkModeSecondaryText>
          </View>
          <Feather
            name="chevron-right"
            size={ResponsiveSize.font(20)}
            color={isDarkMode ? "#A0A0A0" : "#9AA5B4"}
          />
        </TouchableOpacity>

        {/* Account Section */}
        <View style={styles.section}>
          <DarkModeSecondaryText style={styles.sectionTitle}>
            Account
          </DarkModeSecondaryText>
          <SettingItem
            icon="key"
            title="Privacy"
            onPress={() => navigateToScreen("Privacy")}
            isDarkMode={isDarkMode}
          />
          <SettingItem
            icon="moon"
            title="Theme Preferences"
            value={getThemeValueText()}
            onPress={() => setShowThemeModal(true)}
            isDarkMode={isDarkMode}
          />
          <SettingItem
            icon="smartphone"
            title="Linked Devices"
            onPress={() => navigateToScreen("LinkedDevices")}
            isDarkMode={isDarkMode}
          />
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <DarkModeSecondaryText style={styles.sectionTitle}>
            Preferences
          </DarkModeSecondaryText>
          <SettingItem
            icon="message-square"
            title="Chat Settings"
            onPress={() => navigateToScreen("ChatSettings")}
            isDarkMode={isDarkMode}
          />
          <SettingItem
            icon="hard-drive"
            title="Data and Storage"
            onPress={() => navigateToScreen("DataStorage")}
            isDarkMode={isDarkMode}
          />
          <SettingItem
            icon="globe"
            title="Language"
            value="English"
            onPress={() => navigateToScreen("Language")}
            isDarkMode={isDarkMode}
          />
        </View>

        {/* Help Section */}
        <View style={styles.section}>
          <DarkModeSecondaryText style={styles.sectionTitle}>
            Help
          </DarkModeSecondaryText>
          <SettingItem
            icon="help-circle"
            title="Help Center"
            onPress={() => navigateToScreen("HelpCenter")}
            isDarkMode={isDarkMode}
          />
          <SettingItem
            icon="info"
            title="About"
            onPress={() => navigateToScreen("About")}
            isDarkMode={isDarkMode}
          />
          <SettingItem
            icon="file-text"
            title="Terms and Privacy Policy"
            onPress={() => navigateToScreen("Terms")}
            isDarkMode={isDarkMode}
          />
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[
            styles.logoutButton,
            {
              backgroundColor: isDarkMode ? "#2D3748" : "#F3F4F6",
            },
          ]}
          onPress={onLogout}
          activeOpacity={0.7}
        >
          <View style={styles.logoutContent}>
            <Feather
              name="log-out"
              size={ResponsiveSize.font(20)}
              color={isDarkMode ? "#FF5252" : "#FF3B30"}
              style={styles.logoutIcon}
            />
            <DarkModeText
              style={[
                styles.logoutText,
                { color: isDarkMode ? "#FF5252" : "#FF3B30" },
              ]}
            >
              Log out
            </DarkModeText>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Theme Preferences Modal */}
      <ThemePreferencesModal
        visible={showThemeModal}
        onClose={() => setShowThemeModal(false)}
        onSelectTheme={(theme) => setThemePreference(theme)}
        currentTheme={themePreference}
        isDarkMode={isDarkMode}
      />

      <BottomNavigation
        activeTab="settings"
        onTabPress={navigateToTab}
        isDarkMode={isDarkMode}
      />
    </DarkModeWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: ResponsiveSize.padding(16),
    paddingBottom: ResponsiveSize.padding(12),
    borderBottomLeftRadius: ResponsiveSize.width(20),
    borderBottomRightRadius: ResponsiveSize.width(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: ResponsiveSize.padding(16),
  },
  headerTitle: {
    fontSize: ResponsiveSize.font(24),
    lineHeight: ResponsiveSize.font(32),
    fontWeight: "700",
    color: "#FFFFFF",
  },
  container: {
    flex: 1,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: ResponsiveSize.padding(16),
    marginBottom: ResponsiveSize.padding(16),
  },
  profileInfo: {
    flex: 1,
    marginLeft: ResponsiveSize.padding(16),
  },
  profileName: {
    fontSize: ResponsiveSize.font(18),
    fontWeight: "600",
    marginBottom: ResponsiveSize.padding(4),
  },
  profileStatus: {
    fontSize: ResponsiveSize.font(14),
  },
  section: {
    marginBottom: ResponsiveSize.padding(24),
  },
  sectionTitle: {
    fontSize: ResponsiveSize.font(12),
    fontWeight: "600",
    paddingHorizontal: ResponsiveSize.padding(16),
    paddingVertical: ResponsiveSize.padding(8),
    textTransform: "uppercase",
  },
  logoutButton: {
    marginHorizontal: ResponsiveSize.padding(16),
    marginVertical: ResponsiveSize.padding(24),
    paddingVertical: ResponsiveSize.padding(12),
    borderRadius: ResponsiveSize.width(100),
    alignItems: "center",
    justifyContent: "center",
  },
  logoutContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: ResponsiveSize.padding(8),
  },
  logoutIcon: {
    marginRight: ResponsiveSize.padding(12),
  },
  logoutText: {
    fontWeight: "600",
    fontSize: ResponsiveSize.font(16),
    marginLeft: ResponsiveSize.padding(12),
  },
});

export default SettingsScreen;
