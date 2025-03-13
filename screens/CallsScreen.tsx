import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { FlatList, StyleSheet, SectionList } from "react-native";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  DarkModeWrapper,
  DarkModeText,
  DarkModeSecondaryText,
  ResponsiveSize,
  Avatar,
  BottomNavigation,
} from "../components";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

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
  navigation?: any;
};

const CallsScreen: React.FC<CallsScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();

  const filteredCalls = MOCK_CALLS.filter((call) =>
    call.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group calls by date for section list
  const groupedCalls = filteredCalls.reduce((groups, call) => {
    const group = groups.find((g) => g.title === call.date);
    if (group) {
      group.data.push(call);
    } else {
      groups.push({ title: call.date, data: [call] });
    }
    return groups;
  }, [] as { title: string; data: Call[] }[]);

  const getCallIcon = (type: string) => {
    switch (type) {
      case "incoming":
        return (
          <View
            style={[
              styles.callTypeIconContainer,
              {
                backgroundColor: isDarkMode
                  ? "rgba(37, 190, 128, 0.15)"
                  : "rgba(26, 141, 96, 0.1)",
              },
            ]}
          >
            <Feather
              name="phone-incoming"
              size={ResponsiveSize.font(14)}
              color="#25BE80"
            />
          </View>
        );
      case "outgoing":
        return (
          <View
            style={[
              styles.callTypeIconContainer,
              {
                backgroundColor: isDarkMode
                  ? "rgba(100, 181, 246, 0.15)"
                  : "rgba(33, 150, 243, 0.1)",
              },
            ]}
          >
            <Feather
              name="phone-outgoing"
              size={ResponsiveSize.font(14)}
              color="#64B5F6"
            />
          </View>
        );
      case "missed":
        return (
          <View
            style={[
              styles.callTypeIconContainer,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255, 82, 82, 0.15)"
                  : "rgba(255, 82, 82, 0.1)",
              },
            ]}
          >
            <Feather
              name="phone-missed"
              size={ResponsiveSize.font(14)}
              color="#FF5252"
            />
          </View>
        );
      case "video":
        return (
          <View
            style={[
              styles.callTypeIconContainer,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255, 213, 79, 0.15)"
                  : "rgba(255, 213, 79, 0.1)",
              },
            ]}
          >
            <Feather
              name="video"
              size={ResponsiveSize.font(14)}
              color="#FFD54F"
            />
          </View>
        );
      default:
        return null;
    }
  };

  const navigateToTab = (tabName: string) => {
    if (navigation) {
      // Navigate to the tab screen using the parent navigator
      const rootNavigation = navigation.getParent();
      if (rootNavigation) {
        rootNavigation.navigate("TabNavigator", { screen: tabName });
      }
    }
  };

  const renderItem = ({ item }: { item: Call }) => (
    <TouchableOpacity
      style={[
        styles.callItem,
        {
          backgroundColor: isDarkMode ? "#1E293B" : "#FFFFFF",
        },
      ]}
      activeOpacity={0.7}
    >
      <View style={styles.callInfo}>
        <Avatar
          uri={item.avatar}
          name={item.name}
          size={50}
          backgroundColor={isDarkMode ? "#3D4A5C" : "#E8E8E8"}
          showStatus={true}
          isOnline={Math.random() > 0.5}
        />
        <View style={styles.callDetails}>
          <DarkModeText style={styles.callName}>{item.name}</DarkModeText>
          <View style={styles.callTimeContainer}>
            {getCallIcon(item.type)}
            <DarkModeSecondaryText style={styles.callTime}>
              {item.time}
            </DarkModeSecondaryText>
          </View>
        </View>
      </View>
      <View style={styles.callButtonsContainer}>
        <TouchableOpacity
          style={[
            styles.callButton,
            {
              backgroundColor: isDarkMode ? "#25BE80" : "#1A8D60",
              marginRight: ResponsiveSize.padding(8),
            },
          ]}
          activeOpacity={0.8}
        >
          <Feather
            name="phone"
            size={ResponsiveSize.font(18)}
            color="#FFFFFF"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.callButton,
            {
              backgroundColor: isDarkMode ? "#64B5F6" : "#2196F3",
            },
          ]}
          activeOpacity={0.8}
        >
          <Feather
            name="video"
            size={ResponsiveSize.font(18)}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>
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
        { backgroundColor: isDarkMode ? "#121A29" : "#F5F7FA" },
      ]}
    >
      <DarkModeSecondaryText style={styles.sectionHeaderText}>
        {title}
      </DarkModeSecondaryText>
    </View>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <View
        style={[
          styles.emptyIconContainer,
          { backgroundColor: isDarkMode ? "#2D3748" : "#F3F4F6" },
        ]}
      >
        <Feather
          name="phone-off"
          size={ResponsiveSize.font(32)}
          color={isDarkMode ? "#64B5F6" : "#2196F3"}
        />
      </View>
      <DarkModeText style={styles.emptyTitle}>No calls yet</DarkModeText>
      <DarkModeSecondaryText style={styles.emptySubtitle}>
        {searchQuery
          ? "No calls match your search"
          : "Your call history will appear here"}
      </DarkModeSecondaryText>
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
            backgroundColor: isDarkMode ? "#25BE80" : "#1A8D60",
            paddingTop: insets.top + ResponsiveSize.padding(10),
          },
        ]}
      >
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Calls</Text>
          <TouchableOpacity style={styles.newCallButton} activeOpacity={0.7}>
            <Feather name="phone-call" size={ResponsiveSize.font(22)} color="white" />
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
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={styles.clearButton}
            >
              <Feather
                name="x"
                size={ResponsiveSize.font(18)}
                color="rgba(255, 255, 255, 0.6)"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <SectionList
        sections={groupedCalls}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={{
          paddingBottom: insets.bottom + ResponsiveSize.padding(80),
          flexGrow: 1, // This ensures the empty component takes full height
        }}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={renderEmptyList}
      />

      <BottomNavigation
        activeTab="calls"
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
  newCallButton: {
    width: ResponsiveSize.width(40),
    height: ResponsiveSize.width(40),
    borderRadius: ResponsiveSize.width(20),
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
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
  clearButton: {
    padding: ResponsiveSize.padding(4),
  },
  list: {
    flex: 1,
  },
  sectionHeader: {
    paddingVertical: ResponsiveSize.padding(8),
    paddingHorizontal: ResponsiveSize.padding(16),
  },
  sectionHeaderText: {
    fontSize: ResponsiveSize.font(14),
    fontWeight: "600",
    textTransform: "uppercase",
  },
  callItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: ResponsiveSize.padding(12),
    paddingHorizontal: ResponsiveSize.padding(16),
    marginHorizontal: ResponsiveSize.padding(16),
    marginVertical: ResponsiveSize.padding(6),
    borderRadius: ResponsiveSize.width(12),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  callInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  callDetails: {
    marginLeft: ResponsiveSize.padding(12),
    flex: 1,
  },
  callName: {
    fontSize: ResponsiveSize.font(16),
    fontWeight: "600",
    marginBottom: ResponsiveSize.padding(4),
  },
  callTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  callTypeIconContainer: {
    width: ResponsiveSize.width(24),
    height: ResponsiveSize.width(24),
    borderRadius: ResponsiveSize.width(12),
    alignItems: "center",
    justifyContent: "center",
    marginRight: ResponsiveSize.padding(6),
  },
  callTime: {
    fontSize: ResponsiveSize.font(14),
  },
  callButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  callButton: {
    width: ResponsiveSize.width(40),
    height: ResponsiveSize.width(40),
    borderRadius: ResponsiveSize.width(20),
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: ResponsiveSize.padding(32),
    paddingTop: ResponsiveSize.padding(80),
  },
  emptyIconContainer: {
    width: ResponsiveSize.width(80),
    height: ResponsiveSize.width(80),
    borderRadius: ResponsiveSize.width(40),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: ResponsiveSize.padding(16),
  },
  emptyTitle: {
    fontSize: ResponsiveSize.font(20),
    fontWeight: "600",
    marginBottom: ResponsiveSize.padding(8),
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: ResponsiveSize.font(16),
    textAlign: "center",
    opacity: 0.7,
  },
});

export default CallsScreen;
