import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SectionList, StyleSheet } from "react-native";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
} from "../components/StyledComponents";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import {
  DarkModeWrapper,
  DarkModeText,
  ResponsiveSize,
  BottomNavBar,
} from "../components";

// Define the contact type
type Contact = {
  id: string;
  name: string;
  avatar: string;
  isOnline?: boolean;
};

// Mock data for contacts
const CONTACTS: { title: string; data: Contact[] }[] = [
  {
    title: "A",
    data: [
      {
        id: "1",
        name: "Alex Johnson",
        avatar: "https://randomuser.me/api/portraits/men/91.jpg",
        isOnline: false,
      },
      {
        id: "2",
        name: "Amanda White",
        avatar: "https://randomuser.me/api/portraits/women/90.jpg",
        isOnline: true,
      },
    ],
  },
  {
    title: "D",
    data: [
      {
        id: "3",
        name: "David Wilson",
        avatar: "https://randomuser.me/api/portraits/men/54.jpg",
        isOnline: true,
      },
    ],
  },
  {
    title: "E",
    data: [
      {
        id: "4",
        name: "Emma Thompson",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        isOnline: true,
      },
    ],
  },
  {
    title: "J",
    data: [
      {
        id: "5",
        name: "James Rodriguez",
        avatar: "https://randomuser.me/api/portraits/men/29.jpg",
        isOnline: false,
      },
    ],
  },
  {
    title: "L",
    data: [
      {
        id: "6",
        name: "Lisa Anderson",
        avatar: "https://randomuser.me/api/portraits/women/63.jpg",
        isOnline: false,
      },
    ],
  },
  {
    title: "M",
    data: [
      {
        id: "7",
        name: "Michael Chen",
        avatar: "https://randomuser.me/api/portraits/men/42.jpg",
        isOnline: false,
      },
    ],
  },
  {
    title: "S",
    data: [
      {
        id: "8",
        name: "Sarah Parker",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
        isOnline: true,
      },
      {
        id: "9",
        name: "Sophie Turner",
        avatar: "https://randomuser.me/api/portraits/women/33.jpg",
        isOnline: true,
      },
    ],
  },
];

type ContactsScreenProps = {
  onSelectContact: (contactId: string) => void;
  navigation?: any;
};

const ContactsScreen: React.FC<ContactsScreenProps> = ({
  onSelectContact,
  navigation,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();

  const renderItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={[
        styles.contactItem,
        { borderBottomColor: isDarkMode ? "#2D3748" : "#F5F7FA" },
      ]}
      onPress={() => onSelectContact(item.id)}
      activeOpacity={0.7}
    >
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {item.avatar ? (
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
        ) : (
          <View
            style={[
              styles.defaultAvatar,
              { backgroundColor: isDarkMode ? "#3D4A5C" : "#E8E8E8" },
            ]}
          >
            <Text
              style={[
                styles.avatarText,
                { color: isDarkMode ? "#FFFFFF" : "#616161" },
              ]}
            >
              {item.name.charAt(0)}
            </Text>
          </View>
        )}
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>

      {/* Contact Name */}
      <DarkModeText style={styles.nameText}>{item.name}</DarkModeText>

      {/* Call Buttons */}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => onSelectContact(item.id)}
        activeOpacity={0.7}
      >
        <Feather
          name="message-circle"
          size={ResponsiveSize.font(20)}
          color="#9AA5B4"
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => onSelectContact(item.id)}
        activeOpacity={0.7}
      >
        <Feather name="phone" size={ResponsiveSize.font(20)} color="#9AA5B4" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({
    section: { title },
  }: {
    section: { title: string };
  }) => (
    <View
      style={[
        styles.sectionHeader,
        { backgroundColor: isDarkMode ? "#1E293B" : "#F5F7FA" },
      ]}
    >
      <Text
        style={[
          styles.sectionTitle,
          { color: isDarkMode ? "#A0A0A0" : "#9AA5B4" },
        ]}
      >
        {title}
      </Text>
    </View>
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
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Contacts</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Feather
              name="user-plus"
              size={ResponsiveSize.font(22)}
              color="white"
            />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Feather
            name="search"
            size={ResponsiveSize.font(18)}
            color="rgba(255, 255, 255, 0.6)"
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search contacts"
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Contacts List */}
      <SectionList
        sections={CONTACTS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled={true}
        contentContainerStyle={{
          paddingBottom: insets.bottom + ResponsiveSize.padding(80),
        }}
      />

      {/* Bottom Navigation */}
      <BottomNavBar
        activeTab="Contacts"
        navigation={navigation}
        isDarkMode={isDarkMode}
        badges={{
          Messages: 5, // Example badge for unread messages
          Calls: 2, // Example badge for missed calls
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 100,
    paddingHorizontal: ResponsiveSize.padding(16),
    paddingVertical: ResponsiveSize.padding(8),
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: ResponsiveSize.font(16),
    marginLeft: ResponsiveSize.padding(8),
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: ResponsiveSize.padding(16),
    paddingVertical: ResponsiveSize.padding(12),
    borderBottomWidth: 1,
  },
  avatarContainer: {
    position: "relative",
    marginRight: ResponsiveSize.padding(12),
  },
  avatar: {
    width: ResponsiveSize.width(56),
    height: ResponsiveSize.width(56),
    borderRadius: ResponsiveSize.width(28),
  },
  defaultAvatar: {
    width: ResponsiveSize.width(56),
    height: ResponsiveSize.width(56),
    borderRadius: ResponsiveSize.width(28),
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: ResponsiveSize.font(20),
    fontWeight: "600",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: ResponsiveSize.width(14),
    height: ResponsiveSize.width(14),
    backgroundColor: "#4CAF50",
    borderRadius: ResponsiveSize.width(7),
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  nameText: {
    flex: 1,
    fontWeight: "500",
    fontSize: ResponsiveSize.font(16),
  },
  actionButton: {
    padding: ResponsiveSize.padding(8),
    marginLeft: ResponsiveSize.padding(4),
  },
  sectionHeader: {
    paddingHorizontal: ResponsiveSize.padding(16),
    paddingVertical: ResponsiveSize.padding(4),
  },
  sectionTitle: {
    fontSize: ResponsiveSize.font(14),
    fontWeight: "600",
  },
});

export default ContactsScreen;
