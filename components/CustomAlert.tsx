import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import { Feather, AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { ResponsiveSize } from "./StyledComponents";

type AlertType = "success" | "error" | "warning" | "info";

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  type?: AlertType;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onDismiss: () => void;
}

const { width } = Dimensions.get("window");

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  type = "info",
  confirmText = "OK",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  onDismiss,
}) => {
  const { isDarkMode } = useTheme();
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
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

  const getIconName = () => {
    switch (type) {
      case "success":
        return "check-circle";
      case "error":
        return "x-circle";
      case "warning":
        return "alert-triangle";
      case "info":
        return "info";
      default:
        return "info";
    }
  };

  const getIconColor = () => {
    switch (type) {
      case "success":
        return "#25BE80";
      case "error":
        return "#F56565";
      case "warning":
        return "#F6AD55";
      case "info":
        return "#4299E1";
      default:
        return "#4299E1";
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onDismiss();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onDismiss();
  };

  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.alertContainer,
            {
              backgroundColor: isDarkMode ? "#1E293B" : "#FFFFFF",
              transform: [{ scale }],
              opacity,
            },
          ]}
        >
          <View style={styles.iconContainer}>
            <Feather
              name={getIconName()}
              size={ResponsiveSize.font(50)}
              color={getIconColor()}
            />
          </View>

          <Text
            style={[
              styles.title,
              { color: isDarkMode ? "#FFFFFF" : "#1E293B" },
            ]}
          >
            {title}
          </Text>

          <Text
            style={[
              styles.message,
              { color: isDarkMode ? "#CBD5E0" : "#4A5568" },
            ]}
          >
            {message}
          </Text>

          <View style={styles.buttonContainer}>
            {onCancel && (
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.cancelButton,
                  {
                    backgroundColor: isDarkMode ? "#2D3748" : "#EDF2F7",
                    marginRight: 8,
                  },
                ]}
                onPress={handleCancel}
              >
                <Text
                  style={[
                    styles.buttonText,
                    { color: isDarkMode ? "#CBD5E0" : "#4A5568" },
                  ]}
                >
                  {cancelText}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.button,
                styles.confirmButton,
                {
                  backgroundColor: getIconColor(),
                  flex: onCancel ? 1 : 2,
                },
              ]}
              onPress={handleConfirm}
            >
              <Text style={[styles.buttonText, { color: "#FFFFFF" }]}>
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: ResponsiveSize.padding(20),
  },
  alertContainer: {
    width: width * 0.85,
    maxWidth: 400,
    borderRadius: 16,
    padding: ResponsiveSize.padding(24),
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  iconContainer: {
    marginBottom: ResponsiveSize.padding(16),
  },
  title: {
    fontSize: ResponsiveSize.font(20),
    fontWeight: "700",
    marginBottom: ResponsiveSize.padding(8),
    textAlign: "center",
  },
  message: {
    fontSize: ResponsiveSize.font(16),
    marginBottom: ResponsiveSize.padding(24),
    textAlign: "center",
    lineHeight: ResponsiveSize.font(24),
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: ResponsiveSize.padding(12),
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButton: {
    backgroundColor: "#4299E1",
  },
  cancelButton: {
    backgroundColor: "#EDF2F7",
  },
  buttonText: {
    fontSize: ResponsiveSize.font(16),
    fontWeight: "600",
  },
});

export default CustomAlert;
