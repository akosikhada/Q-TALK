import React, { useState } from "react";
import { Modal, Animated, StyleSheet, TouchableOpacity } from "react-native";
import {
  View,
  Text,
  DarkModeText,
  DarkModeSecondaryText,
  DarkModeHeading,
  ResponsiveSize,
} from "../StyledComponents";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

interface BlockedContactActionModalProps {
  visible: boolean;
  onClose: () => void;
  onUnblock: () => void;
  onDelete: () => void;
  contactName: string;
  isDarkMode: boolean;
}

const BlockedContactActionModal: React.FC<BlockedContactActionModalProps> = ({
  visible,
  onClose,
  onUnblock,
  onDelete,
  contactName,
  isDarkMode,
}) => {
  const insets = useSafeAreaInsets();
  const [animation] = useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
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
  }, [visible]);

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const handleUnblock = () => {
    onUnblock();
    onClose();
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  const options = [
    {
      value: "unblock",
      title: "Unblock Contact",
      description: "Allow this contact to call and message you again",
      icon: "user-check",
      color: isDarkMode ? "#25BE80" : "#1A8D60",
      onPress: handleUnblock,
    },
    {
      value: "delete",
      title: "Delete Contact",
      description: "Remove this contact permanently",
      icon: "trash-2",
      color: isDarkMode ? "#EF5350" : "#F44336",
      onPress: handleDelete,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPress={onClose}
        >
          <Animated.View
            style={[
              styles.modalContent,
              {
                backgroundColor: isDarkMode ? "#1E293B" : "#FFFFFF",
                transform: [{ translateY }],
                opacity,
                paddingBottom: insets.bottom,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <DarkModeHeading level={3} style={styles.modalTitle}>
                Blocked Contact
              </DarkModeHeading>
              <TouchableOpacity onPress={onClose}>
                <Feather
                  name="x"
                  size={24}
                  color={isDarkMode ? "#CBD5E0" : "#4A5568"}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.contactInfoContainer}>
              <View
                style={[
                  styles.contactAvatarContainer,
                  { backgroundColor: isDarkMode ? "#2D3748" : "#F3F4F6" },
                ]}
              >
                <Feather
                  name="user-x"
                  size={32}
                  color={isDarkMode ? "#EF5350" : "#F44336"}
                />
              </View>
              <DarkModeText style={styles.contactName}>
                {contactName}
              </DarkModeText>
              <DarkModeSecondaryText style={styles.blockedStatus}>
                Currently blocked
              </DarkModeSecondaryText>
            </View>

            <View style={styles.optionsContainer}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionItem,
                    {
                      backgroundColor: isDarkMode ? "#2D3748" : "#F3F4F6",
                    },
                  ]}
                  onPress={option.onPress}
                >
                  <View
                    style={[
                      styles.optionIconContainer,
                      {
                        backgroundColor: isDarkMode ? "#3D4A5C" : "#E2E8F0",
                      },
                    ]}
                  >
                    <Feather
                      name={option.icon as any}
                      size={20}
                      color={option.color}
                    />
                  </View>
                  <View style={styles.optionTextContainer}>
                    <DarkModeText
                      style={[styles.optionTitle, { color: option.color }]}
                    >
                      {option.title}
                    </DarkModeText>
                    <DarkModeSecondaryText style={styles.optionDescription}>
                      {option.description}
                    </DarkModeSecondaryText>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View
              style={[
                styles.modalFooter,
                { borderTopColor: isDarkMode ? "#2D3748" : "#E5E7EB" },
              ]}
            >
              <DarkModeSecondaryText style={styles.modalFooterText}>
                Unblocking will allow this contact to call you and send you
                messages again.
              </DarkModeSecondaryText>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: ResponsiveSize.padding(24),
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: ResponsiveSize.padding(24),
  },
  modalTitle: {
    fontSize: ResponsiveSize.font(20),
    fontWeight: "600",
  },
  contactInfoContainer: {
    alignItems: "center",
    marginVertical: ResponsiveSize.padding(20),
  },
  contactAvatarContainer: {
    width: ResponsiveSize.width(80),
    height: ResponsiveSize.width(80),
    borderRadius: ResponsiveSize.width(40),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: ResponsiveSize.padding(16),
  },
  contactName: {
    fontSize: ResponsiveSize.font(20),
    fontWeight: "600",
    marginBottom: ResponsiveSize.padding(4),
  },
  blockedStatus: {
    fontSize: ResponsiveSize.font(14),
    opacity: 0.7,
  },
  optionsContainer: {
    marginTop: ResponsiveSize.padding(16),
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: ResponsiveSize.padding(16),
    borderRadius: 12,
    marginBottom: ResponsiveSize.padding(8),
  },
  optionIconContainer: {
    width: ResponsiveSize.width(40),
    height: ResponsiveSize.width(40),
    borderRadius: ResponsiveSize.width(20),
    alignItems: "center",
    justifyContent: "center",
    marginRight: ResponsiveSize.padding(16),
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: ResponsiveSize.font(16),
    fontWeight: "600",
    marginBottom: ResponsiveSize.padding(4),
  },
  optionDescription: {
    fontSize: ResponsiveSize.font(14),
  },
  modalFooter: {
    marginTop: ResponsiveSize.padding(24),
    paddingTop: ResponsiveSize.padding(16),
    borderTopWidth: 1,
  },
  modalFooterText: {
    fontSize: ResponsiveSize.font(14),
    textAlign: "center",
  },
});

export default BlockedContactActionModal;
