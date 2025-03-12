import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { FlatList, StyleSheet } from "react-native";
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
import {
  DarkModeWrapper,
  DarkModeText,
  ResponsiveSize,
  BottomNavBar,
} from "../components";

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
        return (
          <Feather
            name="phone-incoming"
            size={ResponsiveSize.font(16)}
            color="#4CAF50"
          />
        );
      case "outgoing":
        return (
          <Feather
            name="phone-outgoing"
            size={ResponsiveSize.font(16)}
            color="#2196F3"
          />
        );
      case "missed":
        return (
          <Feather
            name="phone-missed"
            size={ResponsiveSize.font(16)}
            color="#E53935"
          />
        );
      case "video":
        return (
          <Feather
            name="video"
            size={ResponsiveSize.font(16)}
            color="#9AA5B4"
          />
        );
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
      style={[
        styles.callItem,
        { borderBottomColor: isDarkMode ? "#2D3748" : "#F5F7FA" },
      ]}
      onPress={() => onMakeCall(item.id, item.type === "video")}
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
      </View>

      {/* Call Info */}
      <View style={styles.contentContainer}>
        <DarkModeText style={styles.nameText}>{item.name}</DarkModeText>
        <View style={styles.callInfoContainer}>
          {getCallIcon(item.type)}
          <Text
            style={[
              styles.callDescription,
              { color: isDarkMode ? "#A0A0A0" : "#9AA5B4" },
            ]}
          >
            {getCallDescription(item)} • {item.date} • {item.time}
          </Text>
        </View>
      </View>

      {/* Call Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => onMakeCall(item.id, false)}
          activeOpacity={0.7}
        >
          <Feather
            name="phone"
            size={ResponsiveSize.font(20)}
            color="#1A8D60"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => onMakeCall(item.id, true)}
          activeOpacity={0.7}
        >
          <Feather
            name="video"
            size={ResponsiveSize.font(20)}
            color="#1A8D60"
          />
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
        style={[
          styles.header,
          {
            backgroundColor: isDarkMode ? "#25BE80" : "#1A8D60",
            paddingTop: insets.top + ResponsiveSize.padding(10),
          },
        ]}
      >
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Calls</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Feather
              name="phone-call"
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
        contentContainerStyle={{
          paddingBottom: insets.bottom + ResponsiveSize.padding(80),
        }}
      />

      {/* Bottom Navigation */}
      <BottomNavBar
        activeTab="Calls"
        navigation={navigation}
        isDarkMode={isDarkMode}
        badges={{
          Calls: MOCK_CALLS.filter((call) => call.type === "missed").length,
          Messages: 3, // Example badge for unread messages
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
  callItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: ResponsiveSize.padding(16),
    paddingVertical: ResponsiveSize.padding(12),
    borderBottomWidth: 1,
  },
  avatarContainer: {
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
  contentContainer: {
    flex: 1,
  },
  nameText: {
    fontWeight: "600",
    fontSize: ResponsiveSize.font(16),
    marginBottom: ResponsiveSize.padding(4),
  },
  callInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  callDescription: {
    fontSize: ResponsiveSize.font(12),
    marginLeft: ResponsiveSize.padding(4),
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  callButton: {
    padding: ResponsiveSize.padding(8),
    marginLeft: ResponsiveSize.padding(8),
  },
});

export default CallsScreen;
