import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { FlatList, ListRenderItemInfo, StyleSheet } from "react-native";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
} from "../components/StyledComponents";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import {
  DarkModeWrapper,
  DarkModeText,
  DarkModeSecondaryText,
  ResponsiveSize,
  BottomNavBar,
  MessageActionModal,
} from "../components";
import { useAlert } from "../contexts/AlertContext";

// Define the conversation type
type Conversation = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string | null;
  isOnline?: boolean;
  isMuted?: boolean;
};

// Mock data for conversations
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    name: "Sarah Parker",
    lastMessage: "Hey! How's your project coming along?",
    time: "9:41 AM",
    unread: 2,
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    isOnline: true,
  },
  {
    id: "2",
    name: "David Wilson",
    lastMessage: "The meeting is scheduled for tomorrow at 10.",
    time: "Yesterday",
    unread: 0,
    avatar: "https://randomuser.me/api/portraits/men/54.jpg",
    isOnline: true,
  },
  {
    id: "3",
    name: "Emma Thompson",
    lastMessage: "Thanks for your help with the presentation",
    time: "Yesterday",
    unread: 1,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    isOnline: true,
  },
  {
    id: "4",
    name: "Michael Chen",
    lastMessage: "Let's catch up soon!",
    time: "Monday",
    unread: 0,
    avatar: "https://randomuser.me/api/portraits/men/42.jpg",
    isOnline: false,
  },
  {
    id: "5",
    name: "Lisa Anderson",
    lastMessage: "The documents have been sent to your email",
    time: "Monday",
    unread: 0,
    avatar: "https://randomuser.me/api/portraits/women/63.jpg",
    isOnline: false,
  },
  {
    id: "6",
    name: "James Rodriguez",
    lastMessage: "Great idea! Let's discuss it further",
    time: "Sunday",
    unread: 0,
    avatar: "https://randomuser.me/api/portraits/men/29.jpg",
    isOnline: false,
  },
  {
    id: "7",
    name: "Sophie Turner",
    lastMessage: "Looking forward to our meeting next week",
    time: "Sunday",
    unread: 0,
    avatar: "https://randomuser.me/api/portraits/women/33.jpg",
    isOnline: true,
  },
  {
    id: "8",
    name: "Alex Johnson",
    lastMessage: "The project files are ready for review",
    time: "Last week",
    unread: 0,
    avatar: "https://randomuser.me/api/portraits/men/91.jpg",
    isOnline: false,
  },
];

type MessagesScreenProps = {
  onSelectConversation: (conversationId: string) => void;
  onNewMessage: () => void;
  navigation?: any;
};

const MessagesScreen: React.FC<MessagesScreenProps> = ({
  onSelectConversation,
  onNewMessage,
  navigation,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] =
    useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const { showSuccessAlert, showInfoAlert, showConfirmAlert } = useAlert();

  const filteredConversations = conversations.filter((conversation) =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      // Use confirm alert with callbacks
      showConfirmAlert(
        "Delete Conversation",
        `Are you sure you want to delete your conversation with ${selectedConversation.name}?`,
        () => {
          // Remove the conversation from the list
          const updatedConversations = conversations.filter(
            (conv) => conv.id !== selectedConversation.id
          );
          setConversations(updatedConversations);

          showSuccessAlert(
            "Deleted",
            `Conversation with ${selectedConversation.name} has been deleted.`
          );
        }
      );
    }
  };

  const renderItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={[
        styles.conversationItem,
        { borderBottomColor: isDarkMode ? "#2D3748" : "#F5F7FA" },
      ]}
      onPress={() => onSelectConversation(item.id)}
      onLongPress={() => handleLongPress(item)}
      activeOpacity={0.7}
      delayLongPress={300}
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

      {/* Message Content */}
      <View style={styles.contentContainer}>
        <View style={styles.nameTimeContainer}>
          <DarkModeText style={styles.nameText}>{item.name}</DarkModeText>
          <View style={styles.timeContainer}>
            {item.isMuted && (
              <Feather
                name="bell-off"
                size={ResponsiveSize.font(14)}
                color={isDarkMode ? "#A0A0A0" : "#9AA5B4"}
                style={styles.mutedIcon}
              />
            )}
            <DarkModeSecondaryText style={styles.timeText}>
              {item.time}
            </DarkModeSecondaryText>
          </View>
        </View>
        <Text
          style={[
            styles.messageText,
            { color: isDarkMode ? "#CCCCCC" : "#616161" },
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.lastMessage}
        </Text>
      </View>

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
    </TouchableOpacity>
  );

  const navigateToTab = (tabName: string) => {
    if (navigation) {
      navigation.navigate(tabName);
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
      borderColor: isDarkMode ? "#1A202C" : "#FFFFFF",
    },
    contentContainer: {
      flex: 1,
      paddingRight: ResponsiveSize.padding(8),
    },
    nameTimeContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: ResponsiveSize.padding(4),
    },
    nameText: {
      fontWeight: "600",
      fontSize: ResponsiveSize.font(16),
    },
    timeContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    timeText: {
      fontSize: ResponsiveSize.font(12),
    },
    mutedIcon: {
      marginRight: ResponsiveSize.padding(4),
    },
    messageText: {
      fontSize: ResponsiveSize.font(14),
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
          <TouchableOpacity onPress={onNewMessage} activeOpacity={0.7}>
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
        </View>
      </View>

      {/* Conversations List */}
      <FlatList
        data={filteredConversations}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingBottom: insets.bottom + ResponsiveSize.padding(80),
        }}
      />

      {/* Bottom Navigation */}
      <BottomNavBar
        activeTab="Messages"
        navigation={navigation}
        isDarkMode={isDarkMode}
        badges={{
          Messages: conversations.reduce(
            (total, conv) => total + conv.unread,
            0
          ),
          Calls: 2, // Example badge for missed calls
        }}
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
    </DarkModeWrapper>
  );
};

export default MessagesScreen;
