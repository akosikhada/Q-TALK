import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { ScrollView, Switch, StyleSheet } from "react-native";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  DarkModeWrapper,
  DarkModeText,
  DarkModeSecondaryText,
  ResponsiveSize,
  BottomNavBar,
} from "../components";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

type SettingsScreenProps = {
  onLogout: () => void;
  navigation?: any;
};

const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onLogout,
  navigation,
}) => {
  const [notifications, setNotifications] = useState(true);
  const { isDarkMode, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();

  const SettingItem = ({
    icon,
    iconColor,
    title,
    value,
    onPress,
    hasToggle = false,
    hasChevron = true,
  }: {
    icon: string;
    iconColor?: string;
    title: string;
    value?: string | boolean;
    onPress?: () => void;
    hasToggle?: boolean;
    hasChevron?: boolean;
  }) => (
    <TouchableOpacity
      style={[
        styles.settingItem,
        { borderBottomColor: isDarkMode ? "#2D3748" : "#F5F7FA" },
      ]}
      onPress={onPress}
      activeOpacity={hasToggle ? 1 : 0.7}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: isDarkMode ? "#2D3748" : "#F5F7FA" },
        ]}
      >
        <Feather
          name={icon as any}
          size={ResponsiveSize.font(18)}
          color={iconColor || (isDarkMode ? "#A0A0A0" : "#9AA5B4")}
        />
      </View>
      <View style={styles.textContainer}>
        <DarkModeText style={styles.title}>{title}</DarkModeText>
      </View>
      {typeof value === "string" && (
        <DarkModeSecondaryText style={styles.valueText}>
          {value}
        </DarkModeSecondaryText>
      )}
      {hasToggle && (
        <Switch
          value={value as boolean}
          onValueChange={onPress as any}
          trackColor={{
            false: isDarkMode ? "#3D4A5C" : "#D8DEE6",
            true: "#1A8D60",
          }}
          thumbColor={"#FFFFFF"}
        />
      )}
      {hasChevron && !hasToggle && (
        <Feather
          name="chevron-right"
          size={ResponsiveSize.font(20)}
          color={isDarkMode ? "#A0A0A0" : "#9AA5B4"}
        />
      )}
    </TouchableOpacity>
  );

  const navigateToTab = (tabName: string) => {
    if (navigation) {
      navigation.navigate(tabName);
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
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom + ResponsiveSize.padding(80),
        }}
      >
        {/* Profile Section */}
        <TouchableOpacity
          style={[
            styles.profileContainer,
            { backgroundColor: isDarkMode ? "#1E293B" : "#F5F7FA" },
          ]}
          activeOpacity={0.7}
        >
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <DarkModeText style={styles.profileName}>Michael Chen</DarkModeText>
            <DarkModeSecondaryText>Available</DarkModeSecondaryText>
          </View>
          <Feather
            name="edit-2"
            size={ResponsiveSize.font(20)}
            color={isDarkMode ? "#A0A0A0" : "#9AA5B4"}
          />
        </TouchableOpacity>

        {/* Account Settings */}
        <View style={styles.section}>
          <DarkModeSecondaryText style={styles.sectionTitle}>
            Account
          </DarkModeSecondaryText>
          <SettingItem
            icon="user"
            iconColor={isDarkMode ? "#25BE80" : "#1A8D60"}
            title="Account"
            onPress={() => {}}
          />
          <SettingItem
            icon="shield"
            iconColor={isDarkMode ? "#64B5F6" : "#2196F3"}
            title="Privacy"
            onPress={() => navigation?.navigate("Privacy")}
          />
          <SettingItem
            icon="bell"
            iconColor={isDarkMode ? "#FFD54F" : "#FFC107"}
            title="Notifications"
            hasToggle={true}
            value={notifications}
            onPress={() => setNotifications(!notifications)}
          />
        </View>

        {/* Appearance Settings */}
        <View style={styles.section}>
          <DarkModeSecondaryText style={styles.sectionTitle}>
            Appearance
          </DarkModeSecondaryText>
          <SettingItem
            icon="moon"
            iconColor={isDarkMode ? "#A0A0A0" : "#5D6B7E"}
            title="Dark Mode"
            hasToggle={true}
            value={isDarkMode}
            onPress={toggleTheme}
          />
          <SettingItem
            icon="type"
            iconColor={isDarkMode ? "#A0A0A0" : "#9AA5B4"}
            title="Chat Text Size"
            value="Medium"
            onPress={() => {}}
          />
        </View>

        {/* Help & About */}
        <View style={styles.section}>
          <DarkModeSecondaryText style={styles.sectionTitle}>
            Help & About
          </DarkModeSecondaryText>
          <SettingItem
            icon="help-circle"
            iconColor={isDarkMode ? "#64B5F6" : "#2196F3"}
            title="Help Center"
            onPress={() => {}}
          />
          <SettingItem
            icon="info"
            iconColor={isDarkMode ? "#A0A0A0" : "#9AA5B4"}
            title="About"
            value="v1.0.0"
            hasChevron={false}
            onPress={() => {}}
          />
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[
            styles.logoutButton,
            { backgroundColor: isDarkMode ? "#2D3748" : "#F5F7FA" },
          ]}
          onPress={onLogout}
          activeOpacity={0.7}
        >
          <View style={styles.logoutContent}>
            <Feather
              name="log-out"
              size={ResponsiveSize.font(18)}
              color={isDarkMode ? "#FF5252" : "#E53935"}
              style={styles.logoutIcon}
            />
            <DarkModeText style={styles.logoutText}>Logout</DarkModeText>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavBar
        activeTab="Settings"
        navigation={navigation}
        isDarkMode={isDarkMode}
        badges={{
          Messages: 5, // Example badge for unread messages
          Settings: 1, // Example badge for settings notification
        }}
      />
    </DarkModeWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: ResponsiveSize.padding(16),
    paddingBottom: ResponsiveSize.padding(12),
  },
  headerTitle: {
    fontSize: ResponsiveSize.font(24),
    lineHeight: ResponsiveSize.font(32),
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: ResponsiveSize.padding(16),
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: ResponsiveSize.padding(16),
    marginBottom: ResponsiveSize.padding(16),
  },
  profileImage: {
    width: ResponsiveSize.width(64),
    height: ResponsiveSize.width(64),
    borderRadius: ResponsiveSize.width(32),
    marginRight: ResponsiveSize.padding(16),
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: ResponsiveSize.font(18),
    fontWeight: "600",
    marginBottom: ResponsiveSize.padding(4),
  },
  section: {
    marginBottom: ResponsiveSize.padding(16),
  },
  sectionTitle: {
    fontSize: ResponsiveSize.font(12),
    fontWeight: "600",
    paddingHorizontal: ResponsiveSize.padding(16),
    paddingVertical: ResponsiveSize.padding(8),
    textTransform: "uppercase",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: ResponsiveSize.padding(12),
    paddingHorizontal: ResponsiveSize.padding(16),
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: ResponsiveSize.width(32),
    height: ResponsiveSize.width(32),
    borderRadius: ResponsiveSize.width(16),
    alignItems: "center",
    justifyContent: "center",
    marginRight: ResponsiveSize.padding(12),
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: ResponsiveSize.font(16),
    fontWeight: "500",
  },
  valueText: {
    marginRight: ResponsiveSize.padding(8),
    fontSize: ResponsiveSize.font(14),
  },
  logoutButton: {
    marginHorizontal: ResponsiveSize.padding(16),
    marginVertical: ResponsiveSize.padding(24),
    paddingVertical: ResponsiveSize.padding(12),
    borderRadius: ResponsiveSize.width(100),
  },
  logoutContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutIcon: {
    marginRight: ResponsiveSize.padding(8),
  },
  logoutText: {
    fontWeight: "600",
    fontSize: ResponsiveSize.font(16),
  },
});

export default SettingsScreen;
