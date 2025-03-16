import React, { useState, useEffect } from "react";
import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  FlatList,
  TouchableOpacity,
  View as RNView,
  Platform,
  StatusBar,
} from "react-native";
import { View, Text, TextInput, ResponsiveSize } from "../StyledComponents";
import { Feather, MaterialIcons, Ionicons } from "@expo/vector-icons";
import Avatar from "../Avatar";
import { LinearGradient } from "expo-linear-gradient";

const { height, width } = Dimensions.get("window");

/**
 * CallContactModal - A specialized modal component for initiating calls
 *
 * This component provides a modern SaaS-like interface for selecting contacts to call
 */
interface CallContactModalProps {
  visible: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  contacts: any[];
  onVoiceCall: (contact: any) => void;
  onVideoCall: (contact: any) => void;
  recentContacts?: any[];
}

const CallContactModal: React.FC<CallContactModalProps> = ({
  visible,
  onClose,
  isDarkMode,
  contacts,
  onVoiceCall,
  onVideoCall,
  recentContacts = [],
}) => {
  const [animation] = useState(new Animated.Value(0));
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredContacts, setFilteredContacts] = useState(contacts);
  const [activeTab, setActiveTab] = useState<"all" | "recent" | "favorites">(
    "all"
  );

  // Filter contacts based on search query
  useEffect(() => {
    let filtered = [...contacts];

    // Apply tab filter
    if (activeTab === "recent") {
      filtered = recentContacts;
    } else if (activeTab === "favorites") {
      filtered = contacts.filter((contact) => contact.isFavorite);
    }

    // Apply search filter
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((contact) =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredContacts(filtered);
  }, [searchQuery, contacts, activeTab, recentContacts]);

  // Animate modal when visibility changes
  useEffect(() => {
    if (visible) {
      setSearchQuery("");
      setActiveTab("all");
      Animated.spring(animation, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, animation]);

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [height, 0],
  });

  const backdropOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.7],
  });

  const renderContactItem = ({ item }: { item: any }) => (
    <RNView style={styles.contactItemWrapper}>
      <TouchableOpacity
        style={[
          styles.contactItem,
          { backgroundColor: isDarkMode ? "#1E293B" : "#FFFFFF" },
        ]}
        activeOpacity={0.7}
      >
        <RNView style={styles.contactInfo}>
          <Avatar
            uri={item.avatar}
            name={item.name}
            size={56}
            backgroundColor={isDarkMode ? "#3D4A5C" : "#E8E8E8"}
            showStatus={true}
            isOnline={item.isOnline}
          />
          <RNView style={styles.contactDetails}>
            <Text
              style={[
                styles.contactName,
                { color: isDarkMode ? "#FFFFFF" : "#1A202C" },
              ]}
            >
              {item.name}
            </Text>
            {item.phone && (
              <Text
                style={[
                  styles.contactSubtitle,
                  { color: isDarkMode ? "#A0AEC0" : "#718096" },
                ]}
              >
                {item.phone}
              </Text>
            )}
          </RNView>
        </RNView>

        <RNView style={styles.callActions}>
          <TouchableOpacity
            style={[
              styles.callButton,
              {
                backgroundColor: isDarkMode ? "#25BE80" : "#1A8D60",
              },
            ]}
            activeOpacity={0.7}
            onPress={() => onVoiceCall(item)}
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
                backgroundColor: isDarkMode ? "#4299E1" : "#3182CE",
              },
            ]}
            activeOpacity={0.7}
            onPress={() => onVideoCall(item)}
          >
            <Feather
              name="video"
              size={ResponsiveSize.font(18)}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </RNView>
      </TouchableOpacity>
    </RNView>
  );

  const renderEmptyState = () => (
    <RNView style={styles.emptyContainer}>
      <RNView
        style={[
          styles.emptyIconContainer,
          { backgroundColor: isDarkMode ? "#2D3748" : "#F7FAFC" },
        ]}
      >
        <Feather
          name="users"
          size={ResponsiveSize.font(40)}
          color={isDarkMode ? "#4A5568" : "#A0AEC0"}
        />
      </RNView>
      <Text
        style={[
          styles.emptyTitle,
          { color: isDarkMode ? "#FFFFFF" : "#1A202C" },
        ]}
      >
        {searchQuery
          ? "No contacts match your search"
          : activeTab === "favorites"
          ? "No favorite contacts"
          : activeTab === "recent"
          ? "No recent contacts"
          : "No contacts found"}
      </Text>
      <Text
        style={[
          styles.emptySubtitle,
          { color: isDarkMode ? "#A0AEC0" : "#718096" },
        ]}
      >
        {searchQuery
          ? "Try a different search term"
          : "Add contacts to see them here"}
      </Text>
    </RNView>
  );

  const renderTabButton = (
    tabId: "all" | "recent" | "favorites",
    label: string,
    icon: string
  ) => {
    const isActive = activeTab === tabId;
    return (
      <TouchableOpacity
        style={[
          styles.tabButton,
          isActive && styles.activeTabButton,
          {
            backgroundColor: isActive
              ? isDarkMode
                ? "#25BE80"
                : "#1A8D60"
              : isDarkMode
              ? "#2D3748"
              : "#F7FAFC",
          },
        ]}
        onPress={() => setActiveTab(tabId)}
        activeOpacity={0.7}
      >
        <Feather
          name={icon as any}
          size={ResponsiveSize.font(16)}
          color={isActive ? "#FFFFFF" : isDarkMode ? "#A0AEC0" : "#718096"}
          style={styles.tabIcon}
        />
        <Text
          style={[
            styles.tabLabel,
            {
              color: isActive ? "#FFFFFF" : isDarkMode ? "#A0AEC0" : "#718096",
            },
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <RNView style={styles.container}>
        {/* Backdrop */}
        <Animated.View
          style={[
            styles.backdrop,
            {
              backgroundColor: isDarkMode
                ? "rgba(0,0,0,0.85)"
                : "rgba(0,0,0,0.7)",
              opacity: backdropOpacity,
            },
          ]}
        >
          <TouchableWithoutFeedback onPress={onClose}>
            <RNView style={styles.backdropTouchable} />
          </TouchableWithoutFeedback>
        </Animated.View>

        {/* Modal Content */}
        <Animated.View
          style={[
            styles.modalContent,
            {
              backgroundColor: isDarkMode ? "#1A202C" : "#FFFFFF",
              transform: [{ translateY }],
            },
          ]}
        >
          {/* Handle Bar */}
          <RNView style={styles.handleBarContainer}>
            <RNView
              style={[
                styles.handleBar,
                { backgroundColor: isDarkMode ? "#4A5568" : "#CBD5E0" },
              ]}
            />
          </RNView>

          {/* Header */}
          <LinearGradient
            colors={
              isDarkMode ? ["#1E293B", "#0F172A"] : ["#F9FAFB", "#F3F4F6"]
            }
            start={[0, 0]}
            end={[1, 0]}
            style={styles.header}
          >
            <Text
              style={[
                styles.title,
                { color: isDarkMode ? "#FFFFFF" : "#1A202C" },
              ]}
            >
              New Call
            </Text>

            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Feather
                name="x"
                size={ResponsiveSize.font(24)}
                color={isDarkMode ? "#A0AEC0" : "#718096"}
              />
            </TouchableOpacity>
          </LinearGradient>

          {/* Search Bar */}
          <RNView
            style={[
              styles.searchContainer,
              {
                backgroundColor: isDarkMode ? "#2D3748" : "#F7FAFC",
                borderColor: isDarkMode ? "#4A5568" : "#E2E8F0",
              },
            ]}
          >
            <Feather
              name="search"
              size={ResponsiveSize.font(18)}
              color={isDarkMode ? "#A0AEC0" : "#718096"}
            />
            <TextInput
              style={[
                styles.searchInput,
                { color: isDarkMode ? "#FFFFFF" : "#1A202C" },
              ]}
              placeholder="Search contacts to call"
              placeholderTextColor={isDarkMode ? "#718096" : "#A0AEC0"}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery("")}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              >
                <Feather
                  name="x"
                  size={ResponsiveSize.font(16)}
                  color={isDarkMode ? "#A0AEC0" : "#718096"}
                />
              </TouchableOpacity>
            )}
          </RNView>

          {/* Tabs */}
          <RNView style={styles.tabsContainer}>
            {renderTabButton("all", "All", "users")}
            {renderTabButton("recent", "Recent", "clock")}
            {renderTabButton("favorites", "Favorites", "star")}
          </RNView>

          {/* Contact List */}
          <FlatList
            data={filteredContacts}
            keyExtractor={(item) => item.id}
            renderItem={renderContactItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyState}
          />
        </Animated.View>
      </RNView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    marginTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  backdropTouchable: {
    flex: 1,
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height * 0.85,
    overflow: "hidden",
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  handleBarContainer: {
    alignItems: "center",
    paddingVertical: 10,
  },
  handleBar: {
    width: 40,
    height: 5,
    borderRadius: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: ResponsiveSize.padding(20),
    paddingVertical: ResponsiveSize.padding(16),
  },
  title: {
    fontSize: ResponsiveSize.font(20),
    fontWeight: "700",
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: ResponsiveSize.padding(16),
    marginVertical: ResponsiveSize.padding(12),
    paddingHorizontal: ResponsiveSize.padding(12),
    paddingVertical: ResponsiveSize.padding(10),
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: ResponsiveSize.font(16),
    marginLeft: ResponsiveSize.padding(8),
    paddingVertical: ResponsiveSize.padding(4),
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: ResponsiveSize.padding(16),
    marginBottom: ResponsiveSize.padding(12),
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: ResponsiveSize.padding(8),
    paddingHorizontal: ResponsiveSize.padding(12),
    borderRadius: 12,
    marginRight: ResponsiveSize.padding(8),
  },
  activeTabButton: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tabIcon: {
    marginRight: ResponsiveSize.padding(6),
  },
  tabLabel: {
    fontSize: ResponsiveSize.font(14),
    fontWeight: "500",
  },
  listContent: {
    paddingHorizontal: ResponsiveSize.padding(16),
    paddingBottom: ResponsiveSize.padding(20),
  },
  contactItemWrapper: {
    marginBottom: ResponsiveSize.padding(12),
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: ResponsiveSize.padding(12),
    paddingHorizontal: ResponsiveSize.padding(16),
    borderRadius: 12,
  },
  contactInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  contactDetails: {
    marginLeft: ResponsiveSize.padding(12),
    flex: 1,
  },
  contactName: {
    fontSize: ResponsiveSize.font(16),
    fontWeight: "600",
    marginBottom: ResponsiveSize.padding(2),
  },
  contactSubtitle: {
    fontSize: ResponsiveSize.font(14),
  },
  callActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  callButton: {
    width: ResponsiveSize.width(40),
    height: ResponsiveSize.width(40),
    borderRadius: ResponsiveSize.width(20),
    alignItems: "center",
    justifyContent: "center",
    marginLeft: ResponsiveSize.padding(8),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: ResponsiveSize.padding(60),
    paddingHorizontal: ResponsiveSize.padding(20),
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
    fontSize: ResponsiveSize.font(18),
    fontWeight: "600",
    marginBottom: ResponsiveSize.padding(8),
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: ResponsiveSize.font(14),
    textAlign: "center",
    opacity: 0.7,
  },
});

export default CallContactModal;
