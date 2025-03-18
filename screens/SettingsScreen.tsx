import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, ScrollView, Switch, ActivityIndicator  } from "react-native";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

import { ref, onValue, off } from "firebase/database";
import { db, auth } from "../services/config";
import { subscribeToData } from "../services/databaseService";

type UserData = {
  name: string;
  email: string;
  photoURL: string;
  status: string;
};

type SettingsScreenProps = {
  onLogout: () => void;
  navigation?: any;
};

const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onLogout,
  navigation,
}) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: () => void;
    
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          // Subscribe to real-time updates for the user data
          unsubscribe = subscribeToData(`users/${currentUser.uid}`, (data) => {
            if (data) {
              setUserData({
                name: data.fullName || "User",
                email: data.email || currentUser.email || "",
                photoURL: data.photoURL || currentUser.photoURL || "",
                status: data.status || "Available"
              });
            } else {
              // If no data exists yet, use auth data
              setUserData({
                name: currentUser.displayName || "User",
                email: currentUser.email || "",
                photoURL: currentUser.photoURL || "",
                status: "Available"
              });
            }
            setLoading(false);
          });
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error in fetchUserData:", error);
        setLoading(false);
      }
    };

    fetchUserData();

    // Clean up the subscription when the component unmounts
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

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
          paddingBottom: insets.bottom + ResponsiveSize.padding(80),
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
          uri={userData?.photoURL || "https://randomuser.me/api/portraits/men/32.jpg"}
          name={userData?.name || "User"}
          size={60}
          backgroundColor={isDarkMode ? "#3D4A5C" : "#E8E8E8"}
        />
        <View style={styles.profileInfo}>
          <DarkModeText style={styles.profileName}>
            {userData?.name || "User"}
          </DarkModeText>
          <DarkModeSecondaryText style={styles.profileStatus}>
            {userData?.status || "Available"}
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
            icon="shield"
            title="Security"
            onPress={() => navigateToScreen("Security")}
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
          <SettingItem
            icon="moon"
            title="Dark Mode"
            hasToggle={true}
            value={isDarkMode}
            onPress={toggleTheme}
            hasChevron={false}
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
  loadingContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#E8E8E8",
    borderRadius: 30,
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
