import React, { useState, useRef } from "react";
import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { View, Text, TextInput, ResponsiveSize } from "../StyledComponents";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { height, width } = Dimensions.get("window");

export interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  profilePicture?: string;
}

/**
 * NewContactModal - A specialized modal component for creating new contacts
 *
 * This component provides a form for entering contact details with a consistent UI.
 */
export interface NewContactModalProps {
  visible: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onSave?: (contactData: ContactFormData) => void;
}

const NewContactModal: React.FC<NewContactModalProps> = ({
  visible,
  onClose,
  isDarkMode,
  onSave,
}) => {
  const [animation] = useState(new Animated.Value(0));
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    email?: string;
  }>({});

  const phoneInputRef = useRef<any>(null);
  const emailInputRef = useRef<any>(null);

  // Animate modal when visibility changes
  React.useEffect(() => {
    if (visible) {
      // Reset form fields when opening
      setName("");
      setPhone("");
      setEmail("");
      setProfileImage(null);
      setErrors({});

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

  const validateForm = () => {
    const newErrors: { name?: string; phone?: string; email?: string } = {};
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (
      phone.trim() &&
      !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im.test(
        phone.trim()
      )
    ) {
      newErrors.phone = "Please enter a valid phone number";
      isValid = false;
    }

    if (email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = () => {
    // Validate form
    if (!validateForm()) {
      return;
    }

    // Create new contact object
    const contactData: ContactFormData = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      profilePicture: profileImage || undefined,
    };

    // Call the onSave callback if provided
    if (onSave) {
      onSave(contactData);
    } else {
      console.log("Saving new contact:", contactData);
    }

    // Close modal
    onClose();
  };

  const handleAddPhoto = () => {
    // In a real app, this would open the image picker
    console.log("Opening image picker");
    // For demo purposes, set a placeholder image
    setProfileImage("https://randomuser.me/api/portraits/lego/1.jpg");
  };

  const getRandomAvatarColor = () => {
    const colorPairs = [
      { start: "#4158D0", end: "#C850C0" },
      { start: "#0093E9", end: "#80D0C7" },
      { start: "#8EC5FC", end: "#E0C3FC" },
      { start: "#FBAB7E", end: "#F7CE68" },
      { start: "#85FFBD", end: "#FFFB7D" },
    ];
    return colorPairs[Math.floor(Math.random() * colorPairs.length)];
  };

  const avatarColors = getRandomAvatarColor();

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
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
            <View style={styles.backdropTouchable} />
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
          <View style={styles.handleBarContainer}>
            <View
              style={[
                styles.handleBar,
                { backgroundColor: isDarkMode ? "#4A5568" : "#CBD5E0" },
              ]}
            />
          </View>

          {/* Header */}
          <LinearGradient
            colors={
              isDarkMode ? ["#1E293B", "#0F172A"] : ["#F9FAFB", "#F3F4F6"]
            }
            start={[0, 0]}
            end={[1, 0]}
            style={[
              styles.header,
              { borderBottomColor: isDarkMode ? "#2D3748" : "#E2E8F0" },
            ]}
          >
            <Text
              style={[
                styles.title,
                { color: isDarkMode ? "#FFFFFF" : "#1A202C" },
              ]}
            >
              New Contact
            </Text>

            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Feather
                name="x"
                size={ResponsiveSize.font(24)}
                color={isDarkMode ? "#9AA5B4" : "#64748B"}
              />
            </TouchableOpacity>
          </LinearGradient>

          <ScrollView
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Form Content */}
            <View style={styles.formContainer}>
              {/* Profile Picture */}
              <TouchableOpacity
                style={styles.profileImageContainer}
                onPress={handleAddPhoto}
              >
                {profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    style={styles.profileImage}
                  />
                ) : (
                  <LinearGradient
                    colors={[avatarColors.start, avatarColors.end]}
                    style={styles.profileImagePlaceholder}
                  >
                    <Feather
                      name="user"
                      size={ResponsiveSize.font(40)}
                      color="#FFFFFF"
                    />
                    <View style={styles.addPhotoIconContainer}>
                      <Feather
                        name="camera"
                        size={ResponsiveSize.font(28)}
                        color="#FFFFFF"
                        style={styles.addPhotoIcon}
                      />
                    </View>
                  </LinearGradient>
                )}
              </TouchableOpacity>

              {/* Form Fields */}
              <View style={styles.formFields}>
                {/* Name Field */}
                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <Feather
                      name="user"
                      size={ResponsiveSize.font(16)}
                      color={isDarkMode ? "#A0AEC0" : "#718096"}
                      style={styles.inputIcon}
                    />
                    <Text
                      style={[
                        styles.inputLabel,
                        { color: isDarkMode ? "#A0AEC0" : "#718096" },
                      ]}
                    >
                      Name
                    </Text>
                  </View>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: isDarkMode ? "#2D3748" : "#F7FAFC",
                        borderColor: errors.name
                          ? "#F56565"
                          : isDarkMode
                          ? "#4A5568"
                          : "#E2E8F0",
                        color: isDarkMode ? "#FFFFFF" : "#1A202C",
                      },
                    ]}
                    placeholder="Enter full name"
                    placeholderTextColor={isDarkMode ? "#718096" : "#A0AEC0"}
                    value={name}
                    onChangeText={(text) => {
                      setName(text);
                      if (errors.name) {
                        setErrors({ ...errors, name: undefined });
                      }
                    }}
                    returnKeyType="next"
                    onSubmitEditing={() => phoneInputRef.current?.focus()}
                  />
                  {errors.name && (
                    <Text style={styles.errorText}>{errors.name}</Text>
                  )}
                </View>

                {/* Phone Field */}
                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <Feather
                      name="phone"
                      size={ResponsiveSize.font(16)}
                      color={isDarkMode ? "#A0AEC0" : "#718096"}
                      style={styles.inputIcon}
                    />
                    <Text
                      style={[
                        styles.inputLabel,
                        { color: isDarkMode ? "#A0AEC0" : "#718096" },
                      ]}
                    >
                      Phone
                    </Text>
                  </View>
                  <TextInput
                    ref={phoneInputRef}
                    style={[
                      styles.input,
                      {
                        backgroundColor: isDarkMode ? "#2D3748" : "#F7FAFC",
                        borderColor: errors.phone
                          ? "#F56565"
                          : isDarkMode
                          ? "#4A5568"
                          : "#E2E8F0",
                        color: isDarkMode ? "#FFFFFF" : "#1A202C",
                      },
                    ]}
                    placeholder="Enter phone number"
                    placeholderTextColor={isDarkMode ? "#718096" : "#A0AEC0"}
                    value={phone}
                    onChangeText={(text) => {
                      setPhone(text);
                      if (errors.phone) {
                        setErrors({ ...errors, phone: undefined });
                      }
                    }}
                    keyboardType="phone-pad"
                    returnKeyType="next"
                    onSubmitEditing={() => emailInputRef.current?.focus()}
                  />
                  {errors.phone && (
                    <Text style={styles.errorText}>{errors.phone}</Text>
                  )}
                </View>

                {/* Email Field */}
                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <Feather
                      name="mail"
                      size={ResponsiveSize.font(16)}
                      color={isDarkMode ? "#A0AEC0" : "#718096"}
                      style={styles.inputIcon}
                    />
                    <Text
                      style={[
                        styles.inputLabel,
                        { color: isDarkMode ? "#A0AEC0" : "#718096" },
                      ]}
                    >
                      Email
                    </Text>
                  </View>
                  <TextInput
                    ref={emailInputRef}
                    style={[
                      styles.input,
                      {
                        backgroundColor: isDarkMode ? "#2D3748" : "#F7FAFC",
                        borderColor: errors.email
                          ? "#F56565"
                          : isDarkMode
                          ? "#4A5568"
                          : "#E2E8F0",
                        color: isDarkMode ? "#FFFFFF" : "#1A202C",
                      },
                    ]}
                    placeholder="Enter email address"
                    placeholderTextColor={isDarkMode ? "#718096" : "#A0AEC0"}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (errors.email) {
                        setErrors({ ...errors, email: undefined });
                      }
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View
            style={[
              styles.actionButtons,
              {
                backgroundColor: isDarkMode ? "#1A202C" : "#FFFFFF",
                borderTopColor: isDarkMode ? "#2D3748" : "#E2E8F0",
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.saveButton,
                {
                  backgroundColor: isDarkMode ? "#25BE80" : "#1A8D60",
                },
              ]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Save Contact</Text>
              <Feather
                name="check"
                size={ResponsiveSize.font(18)}
                color="#FFFFFF"
                style={styles.saveButtonIcon}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
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
    borderBottomWidth: 1,
  },
  title: {
    fontSize: ResponsiveSize.font(20),
    fontWeight: "700",
  },
  closeButton: {
    padding: 4,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: ResponsiveSize.padding(20),
  },
  formContainer: {
    padding: ResponsiveSize.padding(20),
  },
  profileImageContainer: {
    alignSelf: "center",
    marginBottom: ResponsiveSize.padding(24),
  },
  profileImage: {
    width: ResponsiveSize.width(120),
    height: ResponsiveSize.width(120),
    borderRadius: ResponsiveSize.width(60),
  },
  profileImagePlaceholder: {
    width: ResponsiveSize.width(120),
    height: ResponsiveSize.width(120),
    borderRadius: ResponsiveSize.width(60),
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  addPhotoIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: ResponsiveSize.width(20),
    padding: 6,
  },
  addPhotoIcon: {
    marginBottom: -2,
  },
  formFields: {
    marginBottom: ResponsiveSize.padding(20),
  },
  inputGroup: {
    marginBottom: ResponsiveSize.padding(16),
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: ResponsiveSize.padding(8),
  },
  inputIcon: {
    marginRight: ResponsiveSize.padding(8),
  },
  inputLabel: {
    fontSize: ResponsiveSize.font(16),
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: ResponsiveSize.padding(16),
    paddingVertical: ResponsiveSize.padding(12),
    fontSize: ResponsiveSize.font(16),
  },
  errorText: {
    color: "#F56565",
    fontSize: ResponsiveSize.font(12),
    marginTop: ResponsiveSize.padding(4),
    marginLeft: ResponsiveSize.padding(4),
  },
  actionButtons: {
    padding: ResponsiveSize.padding(20),
    borderTopWidth: 1,
  },
  saveButton: {
    paddingVertical: ResponsiveSize.padding(16),
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    fontSize: ResponsiveSize.font(18),
    fontWeight: "600",
    color: "#FFFFFF",
  },
  saveButtonIcon: {
    marginLeft: ResponsiveSize.padding(8),
  },
});

export default NewContactModal;
