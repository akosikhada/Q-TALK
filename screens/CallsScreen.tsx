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
import { CallContactModal } from "../components/modals";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { Call, CallsScreenProps } from "../types/calls";
import { MOCK_CALLS } from "../utils/mockCalls";

/**
 * CallsScreen Component
 *
 * Displays a list of call history organized by date sections
 * with functionality to search calls and initiate new calls.
 */
const CallsScreen: React.FC<CallsScreenProps> = ({ navigation }) => {
  // =========================================================================
  // State and Hooks
  // =========================================================================
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewCallModal, setShowNewCallModal] = useState(false);
  const { isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();

  // =========================================================================
  // Helper Functions
  // =========================================================================
  const formatTime = (date: Date) => {
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });
  };

  const getGroupTitle = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return formatDate(date);
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

  const handleVoiceCall = (contact: any) => {
    setShowNewCallModal(false);
    // Handle initiating a voice call
    console.log("Voice calling:", contact.name);
  };

  const handleVideoCall = (contact: any) => {
    setShowNewCallModal(false);
    // Handle initiating a video call
    console.log("Video calling:", contact.name);
  };

  // Handle call item press - for the entire contact card
  const handleCallItemPress = (item: Call) => {
    console.log("Call item pressed:", item.name);
    // You could show call details or call history for this contact
  };

  // Handle direct voice call button press
  const handleDirectVoiceCall = (item: Call, event: any) => {
    // Stop propagation to prevent the parent TouchableOpacity from triggering
    event.stopPropagation();
    console.log("Direct voice call to:", item.name);
  };

  // Handle direct video call button press
  const handleDirectVideoCall = (item: Call, event: any) => {
    // Stop propagation to prevent the parent TouchableOpacity from triggering
    event.stopPropagation();
    console.log("Direct video call to:", item.name);
  };

  // =========================================================================
  // Data Processing
  // =========================================================================
  // Filter calls based on search query
  const filteredCalls = MOCK_CALLS.filter((call) =>
    call.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group calls by date for section list
  const groupedCalls = filteredCalls.reduce((groups, call) => {
    const title = getGroupTitle(call.timestamp);
    const group = groups.find((g) => g.title === title);
    if (group) {
      group.data.push(call);
    } else {
      groups.push({ title, data: [call] });
    }
    return groups;
  }, [] as { title: string; data: Call[] }[]);

  // =========================================================================
  // UI Helper Components
  // =========================================================================
  /**
   * Renders the appropriate icon for different call types
   */
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

  // =========================================================================
  // Render Functions
  // =========================================================================
  /**
   * Renders an individual call item
   */
  const renderItem = ({ item }: { item: Call }) => (
    <TouchableOpacity
      style={[
        styles.callItem,
        {
          backgroundColor: isDarkMode ? "#1E293B" : "#FFFFFF",
        },
      ]}
      activeOpacity={0.7}
      onPress={() => handleCallItemPress(item)}
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
            <View>
              <DarkModeSecondaryText style={styles.callTime}>
                {formatTime(item.timestamp)}
              </DarkModeSecondaryText>
              <DarkModeSecondaryText style={styles.callDate}>
                {formatDate(item.timestamp)}
              </DarkModeSecondaryText>
            </View>
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
          onPress={(event) => handleDirectVoiceCall(item, event)}
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
          onPress={(event) => handleDirectVideoCall(item, event)}
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

  /**
   * Renders the section header for each date group
   */
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

  /**
   * Renders the empty state when no calls are found
   */
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

  /**
   * Renders the header with title and new call button
   */
  const renderHeader = () => (
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
        <TouchableOpacity
          style={styles.newCallButton}
          activeOpacity={0.7}
          onPress={() => setShowNewCallModal(true)}
        >
          <Feather
            name="phone-call"
            size={ResponsiveSize.font(22)}
            color="white"
          />
        </TouchableOpacity>
      </View>

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
  );

  // =========================================================================
  // Main Render
  // =========================================================================
  return (
    <DarkModeWrapper>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      {/* Header */}
      {renderHeader()}

      {/* Call List */}
      <SectionList
        sections={groupedCalls}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={{
          paddingBottom: insets.bottom + ResponsiveSize.padding(100),
          flexGrow: 1,
        }}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={renderEmptyList}
      />

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab="calls"
        onTabPress={navigateToTab}
        isDarkMode={isDarkMode}
      />

      {/* New Call Modal - Using the enhanced SaaS-style modal */}
      <CallContactModal
        visible={showNewCallModal}
        onClose={() => setShowNewCallModal(false)}
        isDarkMode={isDarkMode}
        contacts={MOCK_CALLS}
        onVoiceCall={handleVoiceCall}
        onVideoCall={handleVideoCall}
        recentContacts={MOCK_CALLS.slice(0, 3)} // Just showing a few recent contacts for demo
      />
    </DarkModeWrapper>
  );
};

// =========================================================================
// Styles
// =========================================================================
const styles = StyleSheet.create({
  // Header Styles
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

  // Search Styles
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

  // List Styles
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

  // Call Item Styles
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
  callDate: {
    fontSize: ResponsiveSize.font(14),
    opacity: 0.7,
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

  // Empty State Styles
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
