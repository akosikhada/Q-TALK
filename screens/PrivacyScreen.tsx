import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { ScrollView, Switch, StyleSheet } from "react-native";
import {
  View,
  Text,
  TouchableOpacity,
  DarkModeWrapper,
  DarkModeText,
  DarkModeSecondaryText,
  ResponsiveSize,
  BottomNavBar,
  ProfilePhotoPrivacyModal,
  GroupAddPermissionModal,
  CallsPermissionModal,
  MessageRetentionModal,
  BlockedContactActionModal,
} from "../components";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

type PrivacyScreenProps = {
  navigation?: any;
};

const PrivacyScreen: React.FC<PrivacyScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const [lastSeen, setLastSeen] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState("everyone");
  const [blockList, setBlockList] = useState<string[]>([
    "John Doe",
    "Jane Smith",
  ]);
  const [anonymousMode, setAnonymousMode] = useState(false);
  const [hideOnlineStatus, setHideOnlineStatus] = useState(false);
  const [hideTypingStatus, setHideTypingStatus] = useState(false);
  const [hideProfilePhoto, setHideProfilePhoto] = useState(false);
  const [hideName, setHideName] = useState(false);
  const [showPhotoPrivacyModal, setShowPhotoPrivacyModal] = useState(false);

  // Additional privacy controls
  const [groupAddPermission, setGroupAddPermission] = useState("everyone");
  const [showGroupAddModal, setShowGroupAddModal] = useState(false);
  const [callsPermission, setCallsPermission] = useState("everyone");
  const [showCallsModal, setShowCallsModal] = useState(false);
  const [statusPrivacy, setStatusPrivacy] = useState("contacts");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [screenshotNotification, setScreenshotNotification] = useState(true);
  const [messageRetention, setMessageRetention] = useState("forever");
  const [showRetentionModal, setShowRetentionModal] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [showBlockedContactModal, setShowBlockedContactModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState("");
  const [selectedContactIndex, setSelectedContactIndex] = useState(-1);

  // Handle anonymous mode toggle
  const handleAnonymousModeToggle = () => {
    const newMode = !anonymousMode;
    setAnonymousMode(newMode);

    // When anonymous mode is enabled, automatically enable all privacy features
    if (newMode) {
      setHideOnlineStatus(true);
      setHideTypingStatus(true);
      setHideProfilePhoto(true);
      setHideName(true);
      setLastSeen(false);
      setReadReceipts(false);
    }
  };

  const handleUnblockContact = () => {
    if (selectedContactIndex !== -1) {
      const updatedBlockList = [...blockList];
      updatedBlockList.splice(selectedContactIndex, 1);
      setBlockList(updatedBlockList);
    }
  };

  const handleDeleteContact = () => {
    if (selectedContactIndex !== -1) {
      // In a real app, you would also delete the contact from your contacts list
      const updatedBlockList = [...blockList];
      updatedBlockList.splice(selectedContactIndex, 1);
      setBlockList(updatedBlockList);
    }
  };

  const SettingItem = ({
    icon,
    iconColor,
    title,
    subtitle,
    value,
    onPress,
    hasToggle = false,
    hasChevron = true,
    disabled = false,
  }: {
    icon: string;
    iconColor?: string;
    title: string;
    subtitle?: string;
    value?: string | boolean;
    onPress?: () => void;
    hasToggle?: boolean;
    hasChevron?: boolean;
    disabled?: boolean;
  }) => (
    <TouchableOpacity
      style={[
        styles.settingItem,
        {
          opacity: disabled ? 0.7 : 1,
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
          size={ResponsiveSize.font(18)}
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
        <Switch
          value={value as boolean}
          onValueChange={onPress as any}
          trackColor={{
            false: isDarkMode ? "#3D4A5C" : "#D8DEE6",
            true: isDarkMode ? "#25BE80" : "#1A8D60",
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

  const SectionCard = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <View style={styles.sectionWrapper}>
      <DarkModeSecondaryText style={styles.sectionTitle}>
        {title}
      </DarkModeSecondaryText>
      <View
        style={[
          styles.sectionCard,
          {
            backgroundColor: isDarkMode ? "#1E293B" : "#FFFFFF",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDarkMode ? 0.2 : 0.1,
            shadowRadius: 4,
            elevation: 3,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );

  return (
    <DarkModeWrapper>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + ResponsiveSize.padding(10),
            backgroundColor: isDarkMode ? "#25BE80" : "#1A8D60",
            borderBottomLeftRadius: ResponsiveSize.width(20),
            borderBottomRightRadius: ResponsiveSize.width(20),
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 4,
          },
        ]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation?.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Feather
              name="arrow-left"
              size={ResponsiveSize.font(24)}
              color="white"
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Privacy</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => {}}
              activeOpacity={0.7}
            >
              <Feather
                name="help-circle"
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
          paddingBottom: insets.bottom + ResponsiveSize.padding(80),
          paddingTop: ResponsiveSize.padding(16),
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Privacy Info */}
        <View style={styles.infoContainer}>
          <View style={styles.infoIconContainer}>
            <Feather
              name="shield"
              size={ResponsiveSize.font(24)}
              color={isDarkMode ? "#25BE80" : "#1A8D60"}
            />
          </View>
          <DarkModeText style={styles.infoText}>
            Control your privacy settings and manage how your data is used in
            Q-TALK. Anonymous Mode enables all privacy features at once,
            including hiding your online status, typing status, profile photo,
            and name.
          </DarkModeText>
        </View>

        {/* Anonymous Mode Section */}
        <SectionCard title="ANONYMOUS MODE">
          <SettingItem
            icon="eye-off"
            iconColor={isDarkMode ? "#FF9800" : "#F57C00"}
            title="Anonymous Mode"
            subtitle="Enable complete privacy for your account"
            hasToggle={true}
            value={anonymousMode}
            onPress={handleAnonymousModeToggle}
          />

          <View style={styles.divider} />

          <SettingItem
            icon="wifi-off"
            iconColor={isDarkMode ? "#9575CD" : "#673AB7"}
            title="Hide Online Status"
            subtitle="Don't show when you're online"
            hasToggle={true}
            value={anonymousMode ? true : hideOnlineStatus}
            onPress={() => setHideOnlineStatus(!hideOnlineStatus)}
            disabled={anonymousMode}
          />

          <View style={styles.divider} />

          <SettingItem
            icon="message-square"
            iconColor={isDarkMode ? "#4DB6AC" : "#009688"}
            title="Hide Typing Status"
            subtitle="Don't show when you're typing"
            hasToggle={true}
            value={anonymousMode ? true : hideTypingStatus}
            onPress={() => setHideTypingStatus(!hideTypingStatus)}
            disabled={anonymousMode}
          />

          <View style={styles.divider} />

          <SettingItem
            icon="image"
            iconColor={isDarkMode ? "#FFB74D" : "#FF9800"}
            title="Hide Profile Photo"
            subtitle="Show a default avatar instead of your photo"
            hasToggle={true}
            value={anonymousMode ? true : hideProfilePhoto}
            onPress={() => setHideProfilePhoto(!hideProfilePhoto)}
            disabled={anonymousMode}
          />

          <View style={styles.divider} />

          <SettingItem
            icon="user"
            iconColor={isDarkMode ? "#4FC3F7" : "#03A9F4"}
            title="Hide Name"
            subtitle="Display 'Anonymous' instead of your name to others"
            hasToggle={true}
            value={anonymousMode ? true : hideName}
            onPress={() => setHideName(!hideName)}
            disabled={anonymousMode}
          />
        </SectionCard>

        {/* Privacy Controls Section */}
        <SectionCard title="PRIVACY CONTROLS">
          <SettingItem
            icon="eye"
            iconColor={isDarkMode ? "#64B5F6" : "#2196F3"}
            title="Last Seen"
            subtitle="Allow others to see when you were last online"
            hasToggle={true}
            value={anonymousMode ? false : lastSeen}
            onPress={() => setLastSeen(!lastSeen)}
            disabled={anonymousMode}
          />

          <View style={styles.divider} />

          <SettingItem
            icon="check-circle"
            iconColor={isDarkMode ? "#81C784" : "#4CAF50"}
            title="Read Receipts"
            subtitle="Let others know when you've read their messages"
            hasToggle={true}
            value={anonymousMode ? false : readReceipts}
            onPress={() => setReadReceipts(!readReceipts)}
            disabled={anonymousMode}
          />

          <View style={styles.divider} />

          <SettingItem
            icon="image"
            iconColor={isDarkMode ? "#FFD54F" : "#FFC107"}
            title="Profile Photo"
            subtitle="Who can see your profile photo"
            value={
              anonymousMode
                ? "Nobody"
                : profilePhoto === "everyone"
                ? "Everyone"
                : profilePhoto === "contacts"
                ? "Contacts Only"
                : "Nobody"
            }
            onPress={() => {
              if (!anonymousMode) {
                setShowPhotoPrivacyModal(true);
              }
            }}
            disabled={anonymousMode}
          />

          <View style={styles.divider} />

          <SettingItem
            icon="users"
            iconColor={isDarkMode ? "#9575CD" : "#673AB7"}
            title="Group Add Permission"
            subtitle="Control who can add you to groups"
            value={
              anonymousMode
                ? "Nobody"
                : groupAddPermission === "everyone"
                ? "Everyone"
                : groupAddPermission === "contacts"
                ? "Contacts Only"
                : "Nobody"
            }
            onPress={() => {
              if (!anonymousMode) {
                setShowGroupAddModal(true);
              }
            }}
            disabled={anonymousMode}
          />

          <View style={styles.divider} />

          <SettingItem
            icon="phone"
            iconColor={isDarkMode ? "#4DB6AC" : "#009688"}
            title="Calls"
            subtitle="Control who can call you"
            value={
              anonymousMode
                ? "Nobody"
                : callsPermission === "everyone"
                ? "Everyone"
                : callsPermission === "contacts"
                ? "Contacts Only"
                : "Nobody"
            }
            onPress={() => {
              if (!anonymousMode) {
                setShowCallsModal(true);
              }
            }}
            disabled={anonymousMode}
          />

          <View style={styles.divider} />

          <SettingItem
            icon="camera"
            iconColor={isDarkMode ? "#F06292" : "#E91E63"}
            title="Screenshot Notification"
            subtitle="Get notified when someone takes a screenshot"
            hasToggle={true}
            value={anonymousMode ? false : screenshotNotification}
            onPress={() => setScreenshotNotification(!screenshotNotification)}
            disabled={anonymousMode}
          />
        </SectionCard>

        {/* Data & Security Section */}
        <SectionCard title="DATA & SECURITY">
          <SettingItem
            icon="clock"
            iconColor={isDarkMode ? "#FF8A65" : "#FF5722"}
            title="Message Retention"
            subtitle="Control how long messages are kept"
            value={
              messageRetention === "24h"
                ? "24 Hours"
                : messageRetention === "7d"
                ? "7 Days"
                : messageRetention === "30d"
                ? "30 Days"
                : "Forever"
            }
            onPress={() => setShowRetentionModal(true)}
          />

          <View style={styles.divider} />

          <SettingItem
            icon="lock"
            iconColor={isDarkMode ? "#7986CB" : "#3F51B5"}
            title="Two-Factor Authentication"
            subtitle="Add an extra layer of security"
            hasToggle={true}
            value={twoFactorAuth}
            onPress={() => setTwoFactorAuth(!twoFactorAuth)}
          />

          <View style={styles.divider} />

          <SettingItem
            icon="download"
            iconColor={isDarkMode ? "#4FC3F7" : "#03A9F4"}
            title="Request Account Data"
            subtitle="Download a copy of your data"
            onPress={() => {
              // This would typically open a flow to request data
            }}
          />

          <View style={styles.divider} />

          <SettingItem
            icon="trash-2"
            iconColor={isDarkMode ? "#EF5350" : "#F44336"}
            title="Delete Account"
            subtitle="Permanently delete your account and data"
            onPress={() => {
              // This would typically open a confirmation dialog
            }}
          />
        </SectionCard>

        {/* Blocked Accounts Section */}
        <SectionCard title="BLOCKED ACCOUNTS">
          {blockList.length > 0 ? (
            <>
              {blockList.map((contact, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <View style={styles.divider} />}
                  <TouchableOpacity
                    style={styles.settingItem}
                    onPress={() => {
                      setSelectedContact(contact);
                      setSelectedContactIndex(index);
                      setShowBlockedContactModal(true);
                    }}
                    disabled={anonymousMode}
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
                        name="user-x"
                        size={20}
                        color={isDarkMode ? "#EF5350" : "#F44336"}
                      />
                    </View>
                    <View style={styles.textContainer}>
                      <DarkModeText style={styles.title}>
                        {contact}
                      </DarkModeText>
                      <DarkModeSecondaryText style={styles.subtitle}>
                        Tap to manage
                      </DarkModeSecondaryText>
                    </View>
                    <Feather
                      name="chevron-right"
                      size={20}
                      color={isDarkMode ? "#A0A0A0" : "#9AA5B4"}
                    />
                  </TouchableOpacity>
                </React.Fragment>
              ))}
            </>
          ) : (
            <View style={styles.emptyStateContainer}>
              <Feather
                name="user-check"
                size={ResponsiveSize.font(40)}
                color={isDarkMode ? "#3D4A5C" : "#E5E7EB"}
                style={{ marginBottom: ResponsiveSize.padding(12) }}
              />
              <DarkModeSecondaryText style={styles.emptyStateText}>
                You haven't blocked any contacts yet
              </DarkModeSecondaryText>
            </View>
          )}
        </SectionCard>
      </ScrollView>

      {/* Modals */}
      <ProfilePhotoPrivacyModal
        visible={showPhotoPrivacyModal}
        onClose={() => setShowPhotoPrivacyModal(false)}
        onSelect={setProfilePhoto}
        currentValue={profilePhoto}
        isDarkMode={isDarkMode}
      />

      <GroupAddPermissionModal
        visible={showGroupAddModal}
        onClose={() => setShowGroupAddModal(false)}
        onSelect={setGroupAddPermission}
        currentValue={groupAddPermission}
        isDarkMode={isDarkMode}
      />

      <CallsPermissionModal
        visible={showCallsModal}
        onClose={() => setShowCallsModal(false)}
        onSelect={setCallsPermission}
        currentValue={callsPermission}
        isDarkMode={isDarkMode}
      />

      <MessageRetentionModal
        visible={showRetentionModal}
        onClose={() => setShowRetentionModal(false)}
        onSelect={setMessageRetention}
        currentValue={messageRetention}
        isDarkMode={isDarkMode}
      />

      <BlockedContactActionModal
        visible={showBlockedContactModal}
        onClose={() => setShowBlockedContactModal(false)}
        contactName={selectedContact}
        onUnblock={handleUnblockContact}
        onDelete={handleDeleteContact}
        isDarkMode={isDarkMode}
      />

      {/* Bottom Navigation */}
      <BottomNavBar
        activeTab="Settings"
        navigation={navigation}
        isDarkMode={isDarkMode}
        badges={{
          Messages: 5, // Example badge for unread messages
        }}
      />
    </DarkModeWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: ResponsiveSize.padding(15),
    paddingHorizontal: ResponsiveSize.padding(16),
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: ResponsiveSize.width(40),
    height: ResponsiveSize.width(40),
    borderRadius: ResponsiveSize.width(20),
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: ResponsiveSize.font(24),
    fontWeight: "700",
    color: "white",
    flex: 1,
    textAlign: "center",
  },
  headerRight: {
    width: ResponsiveSize.width(40),
  },
  headerButton: {
    width: ResponsiveSize.width(40),
    height: ResponsiveSize.width(40),
    borderRadius: ResponsiveSize.width(20),
    alignItems: "center",
    justifyContent: "center",
  },
  infoContainer: {
    padding: ResponsiveSize.padding(16),
    marginBottom: ResponsiveSize.padding(16),
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: ResponsiveSize.padding(16),
  },
  infoIconContainer: {
    marginRight: ResponsiveSize.padding(12),
  },
  infoText: {
    fontSize: ResponsiveSize.font(14),
    lineHeight: ResponsiveSize.font(20),
    flex: 1,
  },
  sectionWrapper: {
    marginBottom: ResponsiveSize.padding(24),
    paddingHorizontal: ResponsiveSize.padding(16),
  },
  sectionCard: {
    borderRadius: ResponsiveSize.width(16),
    overflow: "hidden",
  },
  section: {
    marginBottom: ResponsiveSize.padding(24),
  },
  sectionTitle: {
    fontSize: ResponsiveSize.font(13),
    fontWeight: "600",
    marginBottom: ResponsiveSize.padding(8),
    marginLeft: ResponsiveSize.padding(4),
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: ResponsiveSize.padding(14),
    paddingHorizontal: ResponsiveSize.padding(16),
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E5E7EB",
    marginLeft: ResponsiveSize.padding(64),
  },
  iconContainer: {
    width: ResponsiveSize.width(40),
    height: ResponsiveSize.width(40),
    borderRadius: ResponsiveSize.width(20),
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
  subtitle: {
    fontSize: ResponsiveSize.font(13),
    marginTop: ResponsiveSize.padding(2),
  },
  valueText: {
    marginRight: ResponsiveSize.padding(8),
    fontSize: ResponsiveSize.font(14),
  },
  emptyStateContainer: {
    padding: ResponsiveSize.padding(16),
    paddingVertical: ResponsiveSize.padding(32),
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    fontSize: ResponsiveSize.font(14),
    opacity: 0.7,
    textAlign: "center",
  },
});

export default PrivacyScreen;
