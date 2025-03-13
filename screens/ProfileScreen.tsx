import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Image, ScrollView } from "react-native";
import {
  View,
  TouchableOpacity,
  DarkModeWrapper,
  DarkModeText,
  DarkModeSecondaryText,
  ResponsiveSize,
  SettingItem,
  Text,
} from "../components";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

type ProfileScreenProps = {
  navigation?: any;
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();

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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation?.goBack()}
            activeOpacity={0.7}
          >
            <Feather
              name="arrow-left"
              size={ResponsiveSize.font(24)}
              color="white"
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton} activeOpacity={0.7}>
              <Feather
                name="more-vertical"
                size={ResponsiveSize.font(22)}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          paddingBottom: insets.bottom + ResponsiveSize.padding(20),
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
              style={styles.profileImage}
            />
            <TouchableOpacity
              style={[
                styles.editButton,
                {
                  backgroundColor: isDarkMode ? "#25BE80" : "#1A8D60",
                },
              ]}
              activeOpacity={0.7}
            >
              <Feather
                name="edit-2"
                size={ResponsiveSize.font(16)}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <DarkModeText style={styles.profileName}>John Doe</DarkModeText>
            <View style={styles.statusContainer}>
              <View
                style={[styles.statusIndicator, { backgroundColor: "#25BE80" }]}
              />
              <DarkModeSecondaryText style={styles.profileStatus}>
                Available
              </DarkModeSecondaryText>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: isDarkMode ? "#2D3748" : "#F3F4F6" },
            ]}
            activeOpacity={0.7}
          >
            <Feather
              name="message-square"
              size={ResponsiveSize.font(20)}
              color={isDarkMode ? "#64B5F6" : "#2196F3"}
            />
            <DarkModeText style={styles.actionText}>Message</DarkModeText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: isDarkMode ? "#2D3748" : "#F3F4F6" },
            ]}
            activeOpacity={0.7}
          >
            <Feather
              name="phone"
              size={ResponsiveSize.font(20)}
              color={isDarkMode ? "#25BE80" : "#1A8D60"}
            />
            <DarkModeText style={styles.actionText}>Call</DarkModeText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: isDarkMode ? "#2D3748" : "#F3F4F6" },
            ]}
            activeOpacity={0.7}
          >
            <Feather
              name="video"
              size={ResponsiveSize.font(20)}
              color={isDarkMode ? "#FF5252" : "#FF3B30"}
            />
            <DarkModeText style={styles.actionText}>Video</DarkModeText>
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: isDarkMode ? "#1E293B" : "#FFFFFF",
              borderRadius: ResponsiveSize.width(16),
              marginHorizontal: ResponsiveSize.padding(16),
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDarkMode ? 0.2 : 0.1,
              shadowRadius: 4,
              elevation: 3,
            },
          ]}
        >
          <DarkModeSecondaryText style={styles.sectionTitle}>
            Personal Information
          </DarkModeSecondaryText>
          <SettingItem
            icon="phone"
            iconColor={isDarkMode ? "#64B5F6" : "#2196F3"}
            title="Phone Number"
            value="+1 (555) 123-4567"
            onPress={() => {}}
            hasChevron={false}
            isDarkMode={isDarkMode}
          />
          <SettingItem
            icon="mail"
            iconColor={isDarkMode ? "#25BE80" : "#1A8D60"}
            title="Email"
            value="john.doe@example.com"
            onPress={() => {}}
            hasChevron={false}
            isDarkMode={isDarkMode}
          />
          <SettingItem
            icon="info"
            iconColor={isDarkMode ? "#FFD54F" : "#FFC107"}
            title="About"
            value="Hey there! I'm using Q-TALK"
            onPress={() => {}}
            isDarkMode={isDarkMode}
          />
        </View>

        {/* Account Actions */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: isDarkMode ? "#1E293B" : "#FFFFFF",
              borderRadius: ResponsiveSize.width(16),
              marginHorizontal: ResponsiveSize.padding(16),
              marginTop: ResponsiveSize.padding(24),
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDarkMode ? 0.2 : 0.1,
              shadowRadius: 4,
              elevation: 3,
            },
          ]}
        >
          <DarkModeSecondaryText style={styles.sectionTitle}>
            Account
          </DarkModeSecondaryText>
          <SettingItem
            icon="key"
            iconColor={isDarkMode ? "#25BE80" : "#1A8D60"}
            title="Change Password"
            onPress={() => {}}
            isDarkMode={isDarkMode}
          />
          <SettingItem
            icon="bell"
            iconColor={isDarkMode ? "#FFD54F" : "#FFC107"}
            title="Notification Settings"
            onPress={() => {}}
            isDarkMode={isDarkMode}
          />
          <SettingItem
            icon="lock"
            iconColor={isDarkMode ? "#64B5F6" : "#2196F3"}
            title="Privacy Settings"
            onPress={() => navigation?.navigate("Privacy")}
            isDarkMode={isDarkMode}
          />
        </View>
      </ScrollView>
    </DarkModeWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  backButton: {
    width: ResponsiveSize.width(40),
    height: ResponsiveSize.width(40),
    borderRadius: ResponsiveSize.width(20),
    alignItems: "center",
    justifyContent: "center",
  },
  headerActions: {
    flexDirection: "row",
  },
  headerButton: {
    width: ResponsiveSize.width(40),
    height: ResponsiveSize.width(40),
    borderRadius: ResponsiveSize.width(20),
    alignItems: "center",
    justifyContent: "center",
  },
  profileHeader: {
    alignItems: "center",
    paddingTop: ResponsiveSize.padding(24),
    paddingBottom: ResponsiveSize.padding(24),
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: ResponsiveSize.padding(16),
  },
  profileImage: {
    width: ResponsiveSize.width(120),
    height: ResponsiveSize.width(120),
    borderRadius: ResponsiveSize.width(60),
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: ResponsiveSize.width(36),
    height: ResponsiveSize.width(36),
    borderRadius: ResponsiveSize.width(18),
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  profileInfo: {
    alignItems: "center",
  },
  profileName: {
    fontSize: ResponsiveSize.font(24),
    fontWeight: "700",
    marginBottom: ResponsiveSize.padding(8),
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIndicator: {
    width: ResponsiveSize.width(8),
    height: ResponsiveSize.width(8),
    borderRadius: ResponsiveSize.width(4),
    marginRight: ResponsiveSize.padding(6),
  },
  profileStatus: {
    fontSize: ResponsiveSize.font(16),
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: ResponsiveSize.padding(24),
    marginBottom: ResponsiveSize.padding(24),
  },
  actionButton: {
    alignItems: "center",
    justifyContent: "center",
    width: ResponsiveSize.width(80),
    height: ResponsiveSize.width(80),
    borderRadius: ResponsiveSize.width(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  actionText: {
    marginTop: ResponsiveSize.padding(8),
    fontSize: ResponsiveSize.font(14),
    fontWeight: "500",
  },
  section: {
    marginBottom: ResponsiveSize.padding(24),
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: ResponsiveSize.font(14),
    fontWeight: "600",
    paddingHorizontal: ResponsiveSize.padding(16),
    paddingVertical: ResponsiveSize.padding(16),
    textTransform: "uppercase",
  },
});

export default ProfileScreen;
