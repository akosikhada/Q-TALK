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

interface ProfilePhotoPrivacyModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
  currentValue: string;
  isDarkMode: boolean;
}

const ProfilePhotoPrivacyModal: React.FC<ProfilePhotoPrivacyModalProps> = ({
  visible,
  onClose,
  onSelect,
  currentValue,
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

  const options = [
    {
      value: "everyone",
      title: "Everyone",
      description: "All users can see your profile photo",
      icon: "globe",
    },
    {
      value: "contacts",
      title: "Contacts Only",
      description: "Only your contacts can see your profile photo",
      icon: "users",
    },
    {
      value: "nobody",
      title: "Nobody",
      description: "Hide your profile photo from everyone",
      icon: "eye-off",
    },
  ];

  const handleSelect = (value: string) => {
    onSelect(value);
    onClose();
  };

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
                Profile Photo Privacy
              </DarkModeHeading>
              <TouchableOpacity onPress={onClose}>
                <Feather
                  name="x"
                  size={24}
                  color={isDarkMode ? "#CBD5E0" : "#4A5568"}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.optionsContainer}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionItem,
                    {
                      backgroundColor:
                        currentValue === option.value
                          ? isDarkMode
                            ? "#2D3748"
                            : "#E8FFF4"
                          : "transparent",
                    },
                  ]}
                  onPress={() => handleSelect(option.value)}
                >
                  <View
                    style={[
                      styles.optionIconContainer,
                      {
                        backgroundColor:
                          currentValue === option.value
                            ? isDarkMode
                              ? "#25BE80"
                              : "#1A8D60"
                            : isDarkMode
                            ? "#3D4A5C"
                            : "#F3F4F6",
                      },
                    ]}
                  >
                    <Feather
                      name={option.icon as any}
                      size={20}
                      color={
                        currentValue === option.value
                          ? "#FFFFFF"
                          : isDarkMode
                          ? "#A0A0A0"
                          : "#9AA5B4"
                      }
                    />
                  </View>
                  <View style={styles.optionTextContainer}>
                    <DarkModeText style={styles.optionTitle}>
                      {option.title}
                    </DarkModeText>
                    <DarkModeSecondaryText style={styles.optionDescription}>
                      {option.description}
                    </DarkModeSecondaryText>
                  </View>
                  {currentValue === option.value && (
                    <Feather
                      name="check"
                      size={20}
                      color={isDarkMode ? "#25BE80" : "#1A8D60"}
                    />
                  )}
                </TouchableOpacity>
              ))}
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
});

export default ProfilePhotoPrivacyModal;
