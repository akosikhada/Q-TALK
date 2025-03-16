import React from "react";
import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
} from "react-native";
import {
  View,
  Text,
  TouchableOpacity,
  DarkModeText,
  DarkModeSecondaryText,
  ResponsiveSize,
} from "../StyledComponents";
import { Feather } from "@expo/vector-icons";

const { height } = Dimensions.get("window");

interface ThemePreferencesModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectTheme: (theme: "light" | "dark" | "system") => void;
  currentTheme: "light" | "dark" | "system";
  isDarkMode: boolean;
}

const ThemePreferencesModal: React.FC<ThemePreferencesModalProps> = ({
  visible,
  onClose,
  onSelectTheme,
  currentTheme,
  isDarkMode,
}) => {
  const [animation] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
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

  const themeOptions = [
    {
      id: "light",
      label: "Light Mode",
      icon: "sun",
      description: "Light background with dark text",
    },
    {
      id: "dark",
      label: "Dark Mode",
      icon: "moon",
      description: "Dark background with light text",
    },
    {
      id: "system",
      label: "System Default",
      icon: "smartphone",
      description: "Follow your device's theme setting",
    },
  ];

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  backgroundColor: isDarkMode ? "#1E293B" : "#FFFFFF",
                  transform: [{ translateY }],
                },
              ]}
            >
              <View style={styles.header}>
                <DarkModeText style={styles.title}>
                  Theme Preferences
                </DarkModeText>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                  activeOpacity={0.7}
                >
                  <Feather
                    name="x"
                    size={ResponsiveSize.font(24)}
                    color={isDarkMode ? "#9AA5B4" : "#64748B"}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.content}>
                {themeOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.optionItem,
                      currentTheme === option.id && {
                        backgroundColor: isDarkMode
                          ? "rgba(37, 190, 128, 0.1)"
                          : "rgba(26, 141, 96, 0.05)",
                      },
                    ]}
                    onPress={() => {
                      onSelectTheme(option.id as "light" | "dark" | "system");
                      onClose();
                    }}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.iconContainer,
                        {
                          backgroundColor: isDarkMode ? "#2D3748" : "#F3F4F6",
                        },
                      ]}
                    >
                      <Feather
                        name={option.icon as any}
                        size={ResponsiveSize.font(20)}
                        color={
                          currentTheme === option.id
                            ? isDarkMode
                              ? "#25BE80"
                              : "#1A8D60"
                            : isDarkMode
                            ? "#9AA5B4"
                            : "#64748B"
                        }
                      />
                    </View>
                    <View style={styles.optionTextContainer}>
                      <DarkModeText
                        style={[
                          styles.optionLabel,
                          currentTheme === option.id && {
                            color: isDarkMode ? "#25BE80" : "#1A8D60",
                            fontWeight: "600",
                          },
                        ]}
                      >
                        {option.label}
                      </DarkModeText>
                      <DarkModeSecondaryText style={styles.optionDescription}>
                        {option.description}
                      </DarkModeSecondaryText>
                    </View>
                    {currentTheme === option.id && (
                      <Feather
                        name="check"
                        size={ResponsiveSize.font(20)}
                        color={isDarkMode ? "#25BE80" : "#1A8D60"}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    borderTopLeftRadius: ResponsiveSize.width(20),
    borderTopRightRadius: ResponsiveSize.width(20),
    paddingTop: ResponsiveSize.padding(16),
    paddingBottom: ResponsiveSize.padding(32),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: ResponsiveSize.padding(16),
    marginBottom: ResponsiveSize.padding(16),
    position: "relative",
  },
  title: {
    fontSize: ResponsiveSize.font(18),
    fontWeight: "600",
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    right: ResponsiveSize.padding(16),
    padding: ResponsiveSize.padding(4),
  },
  content: {
    paddingHorizontal: ResponsiveSize.padding(16),
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: ResponsiveSize.padding(12),
    paddingHorizontal: ResponsiveSize.padding(16),
    marginBottom: ResponsiveSize.padding(8),
    borderRadius: ResponsiveSize.width(12),
  },
  iconContainer: {
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
  optionLabel: {
    fontSize: ResponsiveSize.font(16),
    fontWeight: "500",
    marginBottom: ResponsiveSize.padding(2),
  },
  optionDescription: {
    fontSize: ResponsiveSize.font(14),
  },
});

export default ThemePreferencesModal;
