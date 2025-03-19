import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { FlatList, ListRenderItemInfo, StyleSheet } from "react-native";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from "../components/StyledComponents";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import {
  DarkModeWrapper,
  DarkModeText,
  DarkModeSecondaryText,
  ResponsiveSize,
  BottomNavigation,
  MessageActionModal,
  Avatar,
} from "../components";
import { MessageContactModal } from "../components/modals";
import { useAlert } from "../contexts/AlertContext";
import { Conversation, MessagesScreenProps } from "../types/messages";
import { MOCK_CONVERSATIONS } from "../utils/mockMessages";

import { ref, onValue, set, remove  } from "firebase/database";
import { db } from "../services/config";  

const MessagesScreen: React.FC<MessagesScreenProps> = ({
  onSelectConversation,
  onNewMessage,
  navigation,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const { showSuccessAlert, showInfoAlert, showConfirmAlert } = useAlert();

  const formatMessageTime = (timestamp: any) => {
    if (!timestamp) return "Unknown time"; 
    
    let numericTimestamp = Number(timestamp); 

    if (numericTimestamp < 1e12) {
        numericTimestamp *= 1000;
    }

    const date = new Date(numericTimestamp);

    if (isNaN(date.getTime())) return "Unknown time"; 

    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) {
        return date.toLocaleDateString("en-US", { weekday: "long" });
    }
    return date.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "2-digit",
    });
};

  const filteredConversations = conversations.filter((conversation) =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const conversationsRef = ref(db, "conversations");
    const unsubscribe = onValue(conversationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const fetchedConversations = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setConversations(fetchedConversations);
      } else {
        setConversations([]);
      }
    });
  
    return () => unsubscribe();
  }, []); // ✅ Keep an empty dependency array

  const handleLongPress = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setModalVisible(true);
  };

  const handleArchive = () => {
    if (selectedConversation) {
      // In a real app, you would implement actual archiving logic
      showSuccessAlert(
        "Archived",
        `Conversation with ${selectedConversation.name} has been archived.`
      );
      setModalVisible(false);
    }
  };

  const handleMute = () => {
    if (selectedConversation) {
      // Toggle mute status
      const updatedConversations = conversations.map((conv) =>
        conv.id === selectedConversation.id
          ? { ...conv, isMuted: !conv.isMuted }
          : conv
      );
      setConversations(updatedConversations);

      const isMuted = !selectedConversation.isMuted;
      showInfoAlert(
        isMuted ? "Muted" : "Unmuted",
        `Notifications for ${selectedConversation.name} have been ${
          isMuted ? "muted" : "unmuted"
        }.`
      );
      setModalVisible(false);
    }
  };

  const handleMarkAsUnread = () => {
    if (selectedConversation) {
      // Mark as unread by setting unread count to 1 if it's currently 0
      const updatedConversations = conversations.map((conv) =>
        conv.id === selectedConversation.id && conv.unread === 0
          ? { ...conv, unread: 1 }
          : conv
      );
      setConversations(updatedConversations);

      showInfoAlert(
        "Marked as Unread",
        `Conversation with ${selectedConversation.name} has been marked as unread.`
      );
      setModalVisible(false);
    }
  };

  const handleBlock = () => {
    if (selectedConversation) {
      setModalVisible(false);

      // Use confirm alert with callbacks
      showConfirmAlert(
        "Block Contact",
        `Are you sure you want to block ${selectedConversation.name}?`,
        () => {
          // Remove the conversation from the list
          const updatedConversations = conversations.filter(
            (conv) => conv.id !== selectedConversation.id
          );
          setConversations(updatedConversations);

          showSuccessAlert(
            "Blocked",
            `${selectedConversation.name} has been blocked.`
          );
        }
      );
    }
  };

  const handleDelete = () => {
    if (selectedConversation) {
      setModalVisible(false);
  
      // Show confirmation alert before deleting
      showConfirmAlert(
        "Delete Conversation",
        `Are you sure you want to delete your conversation with ${selectedConversation.name}?`,
        () => {
          const conversationRef = ref(db, `conversations/${selectedConversation.id}`);
  
          // ✅ Remove conversation from Firebase
          remove(conversationRef)
            .then(() => {
              console.log("Conversation deleted successfully");
  
              // ✅ Update UI by filtering out the deleted conversation
              setConversations((prev) =>
                prev.filter((conv) => conv.id !== selectedConversation.id)
              );
  
              showSuccessAlert(
                "Deleted",
                `Conversation with ${selectedConversation.name} has been deleted.`
              );
            })
            .catch((error) => {
              console.error("Error deleting conversation:", error);
            });
        }
      );
    }
  };

  const  handleSelectContact = (contact: any) => {
    // In a real app, you would create a new conversation or navigate to an existing one
    showSuccessAlert(
      "New Conversation",
      `Starting a new conversation with ${
        Array.isArray(contact) ? `${contact.length} contacts` : contact.name
      }`
    );

    // If this is a single contact, find if we already have a conversation
    if (!Array.isArray(contact)) {
      const existingConversation = conversations.find(
        (conv) => conv.name === contact.name
      );

      if (existingConversation) {
        onSelectConversation(existingConversation.id, existingConversation.name);
      } else {
        // In a real app, you would create a new conversation here
        console.log("Would create new conversation with", contact.name);
      }
    } else {
      // In a real app, you would create a new group conversation
      console.log(
        "Would create new group with",
        contact.map((c) => c.name).join(", ")
      );
    }
  };

  const renderItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={[
        styles.conversationItem,
        { borderBottomColor: isDarkMode ? "#2D3748" : "#F5F7FA" },
      ]}
      onPress={() => onSelectConversation(item.id, item.name)}
      onLongPress={() => handleLongPress(item)}
      activeOpacity={0.7}
      delayLongPress={300}
    >
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Avatar
          uri={item.avatar || undefined}
          name={item.name}
          size={56}
          backgroundColor={isDarkMode ? "#3D4A5C" : "#E8E8E8"}
          showStatus={true}
          isOnline={item.isOnline}
          statusSize={14}
        />
      </View>

      {/* Message Content */}
      <View style={styles.contentContainer}>
        <View style={styles.nameTimeContainer}>
          <DarkModeText
            style={[styles.nameText, item.unread > 0 && styles.unreadNameText]}
          >
            {item.name}
          </DarkModeText>
          <View style={styles.timeContainer}>
            {item.isMuted && (
              <Feather
                name="bell-off"
                size={ResponsiveSize.font(14)}
                color={isDarkMode ? "#A0A0A0" : "#9AA5B4"}
                style={styles.mutedIcon}
              />
            )}
            <DarkModeSecondaryText
              style={[
                styles.timeText,
                item.unread > 0 && styles.unreadTimeText,
              ]}
            >
              {formatMessageTime(item.timestamp)}
            </DarkModeSecondaryText>
          </View>
        </View>
        <View style={styles.messageContainer}>
          <Text
            style={[
              styles.messageText,
              { color: isDarkMode ? "#CCCCCC" : "#616161" },
              item.unread > 0 && styles.unreadMessageText,
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.lastMessage}
          </Text>

          {/* Unread Count */}
          {item.unread > 0 && (
            <View
              style={[
                styles.unreadBadge,
                { backgroundColor: isDarkMode ? "#25BE80" : "#1A8D60" },
              ]}
            >
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const navigateToTab = (tabName: string) => {
    if (navigation) {
      // Navigate to the tab screen using the parent navigator
      const rootNavigation = navigation.getParent();
      if (rootNavigation) {
        rootNavigation.navigate("TabNavigator", { screen: tabName });
      }
    }
  };

  const styles = StyleSheet.create({
    conversationItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: ResponsiveSize.padding(16),
      paddingVertical: ResponsiveSize.padding(12),
      borderBottomWidth: 1,
    },
    avatarContainer: {
      marginRight: ResponsiveSize.padding(16),
    },
    contentContainer: {
      flex: 1,
      paddingRight: ResponsiveSize.padding(8),
    },
    nameTimeContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: ResponsiveSize.padding(6),
    },
    nameText: {
      fontWeight: "500",
      fontSize: ResponsiveSize.font(16),
      flex: 1,
    },
    unreadNameText: {
      fontWeight: "700",
    },
    timeContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    timeText: {
      fontSize: ResponsiveSize.font(12),
    },
    unreadTimeText: {
      fontWeight: "600",
      color: isDarkMode ? "#25BE80" : "#1A8D60",
    },
    mutedIcon: {
      marginRight: ResponsiveSize.padding(4),
    },
    messageContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    messageText: {
      fontSize: ResponsiveSize.font(14),
      flex: 1,
      paddingRight: ResponsiveSize.padding(8),
    },
    unreadMessageText: {
      fontWeight: "500",
      color: isDarkMode ? "#FFFFFF" : "#000000",
    },
    unreadBadge: {
      height: ResponsiveSize.width(22),
      minWidth: ResponsiveSize.width(22),
      borderRadius: ResponsiveSize.width(11),
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: ResponsiveSize.padding(4),
    },
    unreadText: {
      color: "#FFFFFF",
      fontSize: ResponsiveSize.font(12),
      fontWeight: "700",
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
    bottomNav: {
      flexDirection: "row",
      borderTopWidth: 1,
      paddingTop: ResponsiveSize.padding(8),
      paddingBottom: ResponsiveSize.padding(4),
      paddingHorizontal: ResponsiveSize.padding(8),
    },
    navItem: {
      flex: 1,
      alignItems: "center",
    },
    headerActions: {
      flexDirection: "row",
      alignItems: "center",
    },
    headerButton: {
      marginLeft: ResponsiveSize.padding(16),
    },
    newMessageButton: {
      marginLeft: ResponsiveSize.padding(16),
    },
    hintContainer: {
      paddingHorizontal: ResponsiveSize.padding(16),
      paddingVertical: ResponsiveSize.padding(8),
      backgroundColor: isDarkMode ? "#1E293B" : "#F9FAFB",
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: isDarkMode ? "#2D3748" : "#E5E7EB",
    },
    hintText: {
      fontSize: ResponsiveSize.font(12),
      textAlign: "center",
      fontStyle: "italic",
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingTop: ResponsiveSize.padding(100),
      paddingHorizontal: ResponsiveSize.padding(32),
    },
    emptyText: {
      fontSize: ResponsiveSize.font(16),
      marginTop: ResponsiveSize.padding(16),
      textAlign: "center",
      marginBottom: ResponsiveSize.padding(24),
    },
    emptyButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: ResponsiveSize.padding(12),
      paddingHorizontal: ResponsiveSize.padding(20),
      borderRadius: ResponsiveSize.width(100),
      marginTop: ResponsiveSize.padding(8),
    },
    emptyButtonText: {
      color: "#FFFFFF",
      fontSize: ResponsiveSize.font(14),
      fontWeight: "600",
    },
    emptyButtonIcon: {
      marginRight: ResponsiveSize.padding(8),
    },
  });

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
          <Text style={styles.headerTitle}>Messages</Text>
          <TouchableOpacity
            style={styles.newCallButton}
            activeOpacity={0.7}
            onPress={() =>
              onNewMessage ? onNewMessage() : setShowNewMessageModal(true)
            }
          >
            <Feather name="edit" size={ResponsiveSize.font(22)} color="white" />
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
            placeholder="Search messages"
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Feather
                name="x"
                size={ResponsiveSize.font(18)}
                color="rgba(255, 255, 255, 0.6)"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Hint Text */}
      {conversations.length > 0 && (
        <View style={styles.hintContainer}>
          <DarkModeSecondaryText style={styles.hintText}>
            Long press on a conversation for more options
          </DarkModeSecondaryText>
        </View>
      )}

      {/* Conversations List */}
      <FlatList
        data={filteredConversations}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingBottom: insets.bottom + ResponsiveSize.padding(100),
          flexGrow: filteredConversations.length === 0 ? 1 : undefined,
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather
              name="message-square"
              size={ResponsiveSize.font(50)}
              color={isDarkMode ? "#3D4A5C" : "#E5E7EB"}
            />
            <DarkModeText style={styles.emptyText}>
              {searchQuery
                ? "No conversations found matching your search"
                : "No conversations yet"}
            </DarkModeText>
            {!searchQuery && (
              <TouchableOpacity
                style={[
                  styles.emptyButton,
                  { backgroundColor: isDarkMode ? "#25BE80" : "#1A8D60" },
                ]}
                onPress={() => setShowNewMessageModal(true)}
              >
                <Feather
                  name="edit"
                  size={ResponsiveSize.font(16)}
                  color="#FFFFFF"
                  style={styles.emptyButtonIcon}
                />
                <Text style={styles.emptyButtonText}>
                  Start a new conversation
                </Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab="messages"
        onTabPress={navigateToTab}
        isDarkMode={isDarkMode}
      />

      {/* Message Action Modal */}
      {selectedConversation && (
        <MessageActionModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onArchive={handleArchive}
          onMute={handleMute}
          onMarkAsUnread={handleMarkAsUnread}
          onBlock={handleBlock}
          onDelete={handleDelete}
          conversationName={selectedConversation.name}
        />
      )}

      {/* New Message Modal - Using our modern SaaS-style modal */}
      <MessageContactModal
        visible={showNewMessageModal}
        onClose={() => setShowNewMessageModal(false)}
        isDarkMode={isDarkMode}
        contacts={MOCK_CONVERSATIONS}
        onSelectContact={handleSelectContact}
        recentContacts={MOCK_CONVERSATIONS.slice(0, 3)} // Just showing a few recent contacts for demo
        frequentContacts={MOCK_CONVERSATIONS.filter((c) => c.isFavorite)} // Using favorites as frequent contacts for demo
      />
    </DarkModeWrapper>
  );
};

export default MessagesScreen;
