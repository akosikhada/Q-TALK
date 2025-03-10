import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Feather, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { ResponsiveSize } from "./StyledComponents";

type MessageActionModalProps = {
  visible: boolean;
  onClose: () => void;
  onArchive: () => void;
  onMute: () => void;
  onMarkAsUnread: () => void;
  onBlock: () => void;
  onDelete: () => void;
  conversationName: string;
};

const MessageActionModal: React.FC<MessageActionModalProps> = ({
  visible,
  onClose,
  onArchive,
  onMute,
  onMarkAsUnread,
  onBlock,
  onDelete,
  conversationName,
}) => {
  const { isDarkMode } = useTheme();
  const screenHeight = Dimensions.get("window").height;

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    modalContainer: {
      backgroundColor: isDarkMode ? "#1A202C" : "#FFFFFF",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingTop: ResponsiveSize.padding(20),
      paddingBottom: ResponsiveSize.padding(30),
      maxHeight: screenHeight * 0.7,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: ResponsiveSize.padding(20),
      marginBottom: ResponsiveSize.padding(15),
    },
    title: {
      fontSize: ResponsiveSize.font(18),
      fontWeight: "600",
      color: isDarkMode ? "#FFFFFF" : "#212121",
    },
    conversationName: {
      fontSize: ResponsiveSize.font(16),
      fontWeight: "400",
      color: isDarkMode ? "#A0A0A0" : "#616161",
      marginTop: ResponsiveSize.padding(4),
    },
    closeButton: {
      padding: ResponsiveSize.padding(8),
    },
    actionItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: ResponsiveSize.padding(16),
      paddingHorizontal: ResponsiveSize.padding(20),
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? "#2D3748" : "#F5F7FA",
    },
    actionText: {
      fontSize: ResponsiveSize.font(16),
      marginLeft: ResponsiveSize.padding(16),
      color: isDarkMode ? "#FFFFFF" : "#212121",
    },
    deleteText: {
      color: "#E53935",
    },
    blockText: {
      color: "#FF9800",
    },
  });

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Conversation Options</Text>
              <Text style={styles.conversationName}>{conversationName}</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Feather
                name="x"
                size={ResponsiveSize.font(24)}
                color={isDarkMode ? "#FFFFFF" : "#212121"}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => {
              onArchive();
              onClose();
            }}
          >
            <Feather
              name="archive"
              size={ResponsiveSize.font(22)}
              color={isDarkMode ? "#A0A0A0" : "#616161"}
            />
            <Text style={styles.actionText}>Archive Conversation</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => {
              onMute();
              onClose();
            }}
          >
            <Feather
              name="bell-off"
              size={ResponsiveSize.font(22)}
              color={isDarkMode ? "#A0A0A0" : "#616161"}
            />
            <Text style={styles.actionText}>Mute Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => {
              onMarkAsUnread();
              onClose();
            }}
          >
            <MaterialIcons
              name="mark-email-unread"
              size={ResponsiveSize.font(22)}
              color={isDarkMode ? "#A0A0A0" : "#616161"}
            />
            <Text style={styles.actionText}>Mark as Unread</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => {
              onBlock();
              onClose();
            }}
          >
            <Feather
              name="slash"
              size={ResponsiveSize.font(22)}
              color="#FF9800"
            />
            <Text style={[styles.actionText, styles.blockText]}>
              Block Contact
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => {
              onDelete();
              onClose();
            }}
          >
            <Feather
              name="trash-2"
              size={ResponsiveSize.font(22)}
              color="#E53935"
            />
            <Text style={[styles.actionText, styles.deleteText]}>
              Delete Conversation
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default MessageActionModal;
