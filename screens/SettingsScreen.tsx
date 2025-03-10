import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { ScrollView, Switch } from "react-native";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  DarkModeWrapper,
  DarkModeText,
  DarkModeSecondaryText,
} from "../components/StyledComponents";
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
  const [readReceipts, setReadReceipts] = useState(true);
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
      className={`flex-row items-center py-4 px-4 border-b ${
        isDarkMode ? "border-gray-700" : "border-gray-200"
      }`}
      onPress={onPress}
      activeOpacity={hasToggle ? 1 : 0.7}
    >
      <View
        className={`w-8 h-8 rounded-full ${
          isDarkMode ? "bg-gray-800" : "bg-gray-100"
        } items-center justify-center mr-3`}
      >
        <Feather
          name={icon as any}
          size={18}
          color={iconColor || (isDarkMode ? "#A0A0A0" : "#9AA5B4")}
        />
      </View>
      <View className="flex-1">
        <DarkModeText className="font-medium">{title}</DarkModeText>
      </View>
      {typeof value === "string" && (
        <DarkModeSecondaryText className="mr-2">{value}</DarkModeSecondaryText>
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
          size={20}
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
        className="bg-primary px-4 pb-3"
        style={{ paddingTop: insets.top + 10 }}
      >
        <Text className="text-2xl font-bold text-text-light mb-4">
          Settings
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom + 80,
        }}
      >
        {/* Profile Section */}
        <TouchableOpacity
          className={`flex-row items-center p-4 mb-4 ${
            isDarkMode ? "bg-gray-900" : "bg-background-light"
          }`}
          activeOpacity={0.7}
        >
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
            className="w-16 h-16 rounded-full mr-4"
          />
          <View className="flex-1">
            <DarkModeText className="text-lg font-semibold">
              Michael Chen
            </DarkModeText>
            <DarkModeSecondaryText>Available</DarkModeSecondaryText>
          </View>
          <Feather
            name="edit-2"
            size={20}
            color={isDarkMode ? "#A0A0A0" : "#9AA5B4"}
          />
        </TouchableOpacity>

        {/* Account Settings */}
        <View className="mb-4">
          <DarkModeSecondaryText className="px-4 py-2 font-semibold text-xs uppercase">
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
            onPress={() => {}}
          />
          <SettingItem
            icon="bell"
            iconColor={isDarkMode ? "#FFD54F" : "#FFC107"}
            title="Notifications"
            hasToggle={true}
            value={notifications}
            onPress={() => setNotifications(!notifications)}
          />
          <SettingItem
            icon="check-square"
            iconColor={isDarkMode ? "#81C784" : "#4CAF50"}
            title="Read Receipts"
            hasToggle={true}
            value={readReceipts}
            onPress={() => setReadReceipts(!readReceipts)}
          />
        </View>

        {/* Appearance Settings */}
        <View className="mb-4">
          <DarkModeSecondaryText className="px-4 py-2 font-semibold text-xs uppercase">
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
        <View className="mb-4">
          <DarkModeSecondaryText className="px-4 py-2 font-semibold text-xs uppercase">
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
          className={`mx-4 my-6 py-3 rounded-full ${
            isDarkMode ? "bg-gray-800" : "bg-gray-100"
          }`}
          onPress={onLogout}
          activeOpacity={0.7}
        >
          <View className="flex-row items-center justify-center">
            <Feather
              name="log-out"
              size={18}
              color={isDarkMode ? "#FF5252" : "#E53935"}
              className="mr-2"
            />
            <Text
              className={
                isDarkMode
                  ? "text-red-dark font-semibold"
                  : "text-red-500 font-semibold"
              }
            >
              Log Out
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <View
        className={`absolute bottom-0 left-0 right-0 flex-row ${
          isDarkMode
            ? "bg-gray-900 border-gray-800"
            : "bg-background-light border-gray-200"
        } border-t pt-2 pb-1 px-2`}
        style={{ paddingBottom: insets.bottom > 0 ? insets.bottom : 8 }}
      >
        <TouchableOpacity
          className="flex-1 items-center"
          onPress={() => navigateToTab("Messages")}
          activeOpacity={0.7}
        >
          <Feather
            name="message-square"
            size={22}
            color={isDarkMode ? "#A0A0A0" : "#9AA5B4"}
          />
          <Text
            className={`text-xs ${
              isDarkMode ? "text-text-dark-muted" : "text-text-muted"
            } mt-1`}
          >
            Chats
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 items-center"
          onPress={() => navigateToTab("Calls")}
          activeOpacity={0.7}
        >
          <Feather
            name="phone"
            size={22}
            color={isDarkMode ? "#A0A0A0" : "#9AA5B4"}
          />
          <Text
            className={`text-xs ${
              isDarkMode ? "text-text-dark-muted" : "text-text-muted"
            } mt-1`}
          >
            Calls
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 items-center"
          onPress={() => navigateToTab("Contacts")}
          activeOpacity={0.7}
        >
          <Feather
            name="users"
            size={22}
            color={isDarkMode ? "#A0A0A0" : "#9AA5B4"}
          />
          <Text
            className={`text-xs ${
              isDarkMode ? "text-text-dark-muted" : "text-text-muted"
            } mt-1`}
          >
            Contacts
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-1 items-center" activeOpacity={0.7}>
          <Feather
            name="settings"
            size={22}
            color={isDarkMode ? "#25BE80" : "#1A8D60"}
          />
          <Text
            className={`text-xs ${
              isDarkMode ? "text-primaryDark" : "text-primary"
            } mt-1`}
          >
            Settings
          </Text>
        </TouchableOpacity>
      </View>
    </DarkModeWrapper>
  );
};

export default SettingsScreen;
