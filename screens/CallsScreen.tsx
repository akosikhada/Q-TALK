import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { FlatList } from "react-native";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
} from "../components/StyledComponents";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { DarkModeWrapper, DarkModeText } from "../components/StyledComponents";

// Define the call type
type Call = {
  id: string;
  name: string;
  avatar: string;
  type: "incoming" | "outgoing" | "missed" | "video";
  time: string;
  date: string;
};

// Mock data for calls
const MOCK_CALLS: Call[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    type: "incoming",
    time: "10:30 AM",
    date: "Today",
  },
  {
    id: "2",
    name: "Michael Chen",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    type: "outgoing",
    time: "Yesterday",
    date: "9:15 PM",
  },
  {
    id: "3",
    name: "Emma Wilson",
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
    type: "missed",
    time: "Yesterday",
    date: "3:45 PM",
  },
  {
    id: "4",
    name: "James Rodriguez",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    type: "video",
    time: "Monday",
    date: "5:20 PM",
  },
  {
    id: "5",
    name: "Olivia Taylor",
    avatar: "https://randomuser.me/api/portraits/women/17.jpg",
    type: "incoming",
    time: "Monday",
    date: "11:05 AM",
  },
  {
    id: "6",
    name: "William Brown",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    type: "outgoing",
    time: "Sunday",
    date: "8:30 PM",
  },
  {
    id: "7",
    name: "Sophia Martinez",
    avatar: "https://randomuser.me/api/portraits/women/28.jpg",
    type: "missed",
    time: "Sunday",
    date: "2:15 PM",
  },
  {
    id: "8",
    name: "Benjamin Lee",
    avatar: "https://randomuser.me/api/portraits/men/91.jpg",
    type: "video",
    time: "Saturday",
    date: "4:50 PM",
  },
  {
    id: "9",
    name: "Isabella Garcia",
    avatar: "https://randomuser.me/api/portraits/women/63.jpg",
    type: "incoming",
    time: "Saturday",
    date: "10:10 AM",
  },
  {
    id: "10",
    name: "Ethan Wilson",
    avatar: "https://randomuser.me/api/portraits/men/40.jpg",
    type: "outgoing",
    time: "Friday",
    date: "7:25 PM",
  },
];

type CallsScreenProps = {
  onMakeCall: (contactId: string, isVideo: boolean) => void;
  navigation?: any;
};

const CallsScreen: React.FC<CallsScreenProps> = ({
  onMakeCall,
  navigation,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();

  const getCallIcon = (type: Call["type"]) => {
    switch (type) {
      case "incoming":
        return <Feather name="phone-incoming" size={16} color="#4CAF50" />;
      case "outgoing":
        return <Feather name="phone-outgoing" size={16} color="#2196F3" />;
      case "missed":
        return <Feather name="phone-missed" size={16} color="#E53935" />;
      case "video":
        return <Feather name="video" size={16} color="#9AA5B4" />;
      default:
        return null;
    }
  };

  const getCallDescription = (call: Call) => {
    switch (call.type) {
      case "incoming":
        return "Incoming call";
      case "outgoing":
        return "Outgoing call";
      case "missed":
        return "Missed call";
      case "video":
        return "Video call";
      default:
        return "";
    }
  };

  const renderItem = ({ item }: { item: Call }) => (
    <TouchableOpacity
      className={`flex-row items-center px-4 py-3 border-b ${
        isDarkMode ? "border-gray-800" : "border-gray-200"
      }`}
      onPress={() => onMakeCall(item.id, item.type === "video")}
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
      </View>

      {/* Call Info */}
      <View className="flex-1">
        <DarkModeText className="font-semibold">{item.name}</DarkModeText>
        <View className="flex-row items-center mt-1">
          {getCallIcon(item.type)}
          <Text
            className={
              isDarkMode
                ? "text-text-dark-secondary text-xs ml-1"
                : "text-text-secondary text-xs ml-1"
            }
          >
            {getCallDescription(item)} • {item.date} • {item.time}
          </Text>
        </View>
      </View>

      {/* Call Buttons */}
      <View className="flex-row">
        <TouchableOpacity
          className="p-2 mr-2"
          onPress={() => onMakeCall(item.id, false)}
          activeOpacity={0.7}
        >
          <Feather name="phone" size={20} color="#1A8D60" />
        </TouchableOpacity>
        <TouchableOpacity
          className="p-2"
          onPress={() => onMakeCall(item.id, true)}
          activeOpacity={0.7}
        >
          <Feather name="video" size={20} color="#1A8D60" />
        </TouchableOpacity>
      </View>
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
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-text-light">Calls</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Feather name="phone-call" size={22} color="white" />
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
            placeholder="Search calls"
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Calls List */}
      <FlatList
        data={MOCK_CALLS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
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

        <TouchableOpacity className="flex-1 items-center" activeOpacity={0.7}>
          <Feather name="phone" size={22} color="#1A8D60" />
          <Text className="text-xs text-primary mt-1">Calls</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 items-center"
          onPress={() => navigateToTab("Contacts")}
          activeOpacity={0.7}
        >
          <Feather name="users" size={22} color="#9AA5B4" />
          <Text className="text-xs text-text-muted mt-1">Contacts</Text>
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

export default CallsScreen;
