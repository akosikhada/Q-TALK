import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SectionList } from "react-native";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
} from "../components/StyledComponents";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { DarkModeWrapper, DarkModeText } from "../components/StyledComponents";

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
      className={`flex-row items-center px-4 py-3 ${
        isDarkMode ? "border-gray-800" : "border-gray-200"
      }`}
      onPress={() => onSelectContact(item.id)}
      activeOpacity={0.7}
    >
      {/* Avatar */}
      <View className="relative mr-3">
        {item.avatar ? (
          <Image
            source={{ uri: item.avatar }}
            className="w-12 h-12 rounded-full"
          />
        ) : (
          <View className="w-12 h-12 bg-gray-200 rounded-full items-center justify-center">
            <Text className="text-gray-500 text-lg font-semibold">
              {item.name.charAt(0)}
            </Text>
          </View>
        )}
        {item.isOnline && (
          <View className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        )}
      </View>

      {/* Contact Name */}
      <DarkModeText className="flex-1 font-medium">{item.name}</DarkModeText>

      {/* Call Buttons */}
      <TouchableOpacity
        className="p-2 mr-1"
        onPress={() => onSelectContact(item.id)}
        activeOpacity={0.7}
      >
        <Feather name="message-circle" size={20} color="#9AA5B4" />
      </TouchableOpacity>
      <TouchableOpacity
        className="p-2"
        onPress={() => onSelectContact(item.id)}
        activeOpacity={0.7}
      >
        <Feather name="phone" size={20} color="#9AA5B4" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({
    section: { title },
  }: {
    section: { title: string };
  }) => (
    <View className={`${isDarkMode ? "bg-gray-800" : "bg-gray-100"} px-4 py-1`}>
      <Text
        className={
          isDarkMode
            ? "text-text-dark-secondary font-semibold"
            : "text-text-secondary font-semibold"
        }
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
        className="bg-primary px-4 pb-3"
        style={{ paddingTop: insets.top + 10 }}
      >
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-text-light">Contacts</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Feather name="user-plus" size={22} color="white" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white/20 rounded-full px-4 py-2">
          <Feather
            name="search"
            size={18}
            color="rgba(255, 255, 255, 0.6)"
            className="mr-2"
          />
          <TextInput
            className="flex-1 text-text-light"
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
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
      />

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
          <Feather name="message-square" size={22} color="#9AA5B4" />
          <Text className="text-xs text-text-muted mt-1">Chats</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 items-center"
          onPress={() => navigateToTab("Calls")}
          activeOpacity={0.7}
        >
          <Feather name="phone" size={22} color="#9AA5B4" />
          <Text className="text-xs text-text-muted mt-1">Calls</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-1 items-center" activeOpacity={0.7}>
          <Feather name="users" size={22} color="#1A8D60" />
          <Text className="text-xs text-primary mt-1">Contacts</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 items-center"
          onPress={() => navigateToTab("Settings")}
          activeOpacity={0.7}
        >
          <Feather name="settings" size={22} color="#9AA5B4" />
          <Text className="text-xs text-text-muted mt-1">Settings</Text>
        </TouchableOpacity>
      </View>
    </DarkModeWrapper>
  );
};

export default ContactsScreen;
