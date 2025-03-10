import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "../components/StyledComponents";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../contexts/ThemeContext";
import {
  DarkModeWrapper,
  DarkModeText,
  DarkModeSecondaryText,
  DarkModeHeading,
  ResponsiveSize,
} from "../components/StyledComponents";
import { StyleSheet } from "react-native";

type AuthScreenProps = {
  onAuthenticate: (
    phoneOrEmail: string,
    password: string,
    isSignUp: boolean
  ) => void;
  navigation?: any;
};

const AuthScreen: React.FC<AuthScreenProps> = ({
  onAuthenticate,
  navigation,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<
    "weak" | "medium" | "strong" | "very-strong" | ""
  >("");
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();

  // Password validation and strength calculation
  useEffect(() => {
    if (!password) {
      setPasswordStrength("");
      return;
    }

    let strength = 0;

    // Length check
    if (password.length >= 8) strength += 1;

    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 1;

    // Contains number
    if (/[0-9]/.test(password)) strength += 1;

    // Contains special character
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    // Set strength level
    if (strength === 0) setPasswordStrength("weak");
    else if (strength === 1) setPasswordStrength("weak");
    else if (strength === 2) setPasswordStrength("medium");
    else if (strength === 3) setPasswordStrength("strong");
    else if (strength === 4) setPasswordStrength("very-strong");
  }, [password]);

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case "weak":
        return "#E53935"; // Red
      case "medium":
        return "#FFC107"; // Yellow
      case "strong":
        return "#4CAF50"; // Green
      case "very-strong":
        return "#1A8D60"; // Primary color
      default:
        return "#D8DEE6"; // Gray
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case "weak":
        return "Weak";
      case "medium":
        return "Medium";
      case "strong":
        return "Strong";
      case "very-strong":
        return "Very Strong";
      default:
        return "";
    }
  };

  const handleSubmit = () => {
    if (isSignUp) {
      if (
        !fullName ||
        !email ||
        !phoneNumber ||
        !password ||
        !confirmPassword
      ) {
        alert("Please fill in all required fields");
        return;
      }
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      if (!acceptedTerms) {
        alert("Please accept the terms of service");
        return;
      }
      if (passwordStrength === "weak") {
        alert("Please create a stronger password");
        return;
      }
    } else {
      if (!email || !password) {
        alert("Please fill in all required fields");
        return;
      }
    }

    onAuthenticate(email, password, isSignUp);
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const toggleTerms = () => setAcceptedTerms(!acceptedTerms);
  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    // Reset fields when switching modes
    setFullName("");
    setEmail("");
    setPhoneNumber("");
    setPassword("");
    setConfirmPassword("");
    setAcceptedTerms(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <DarkModeWrapper>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      {/* Back Button */}
      <TouchableOpacity
        style={{
          position: "absolute",
          top: insets.top,
          left: ResponsiveSize.padding(16),
          zIndex: 10,
          padding: ResponsiveSize.padding(12),
        }}
        onPress={() => navigation?.goBack()}
        activeOpacity={0.8}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Feather
          name="arrow-left"
          size={ResponsiveSize.font(24)}
          color={isDarkMode ? "#FFFFFF" : "#1E293B"}
        />
      </TouchableOpacity>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: insets.top + ResponsiveSize.padding(60),
            paddingBottom: insets.bottom + ResponsiveSize.padding(20),
          }}
          showsVerticalScrollIndicator={false}
        >
          {isSignUp ? renderSignUp() : renderSignIn()}
        </ScrollView>
      </KeyboardAvoidingView>
    </DarkModeWrapper>
  );

  function renderSignUp() {
    return (
      <View style={{ paddingHorizontal: ResponsiveSize.padding(24) }}>
        <DarkModeHeading
          style={{ marginBottom: ResponsiveSize.padding(12) }}
          level={2}
        >
          Create Account
        </DarkModeHeading>
        <DarkModeSecondaryText
          style={{ marginBottom: ResponsiveSize.padding(32) }}
        >
          Join us and start your journey
        </DarkModeSecondaryText>

        {/* Full Name Input */}
        <View style={{ marginBottom: ResponsiveSize.padding(20) }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: ResponsiveSize.padding(16),
              paddingVertical: ResponsiveSize.padding(14),
              borderColor: isDarkMode ? "#3D4A5C" : "#D8DEE6",
              backgroundColor: isDarkMode ? "#2D3748" : "#F5F7FA",
            }}
          >
            <Feather
              name="user"
              size={ResponsiveSize.font(20)}
              color={isDarkMode ? "#A0A0A0" : "#9AA5B4"}
              style={{ marginRight: ResponsiveSize.padding(12) }}
            />
            <TextInput
              style={{
                flex: 1,
                color: isDarkMode ? "#FFFFFF" : "#212121",
                fontSize: ResponsiveSize.font(16),
              }}
              placeholder="Enter your full name"
              placeholderTextColor={isDarkMode ? "#A0A0A0" : "#9AA5B4"}
              value={fullName}
              onChangeText={setFullName}
            />
          </View>
        </View>

        {/* Email Input */}
        <View style={{ marginBottom: ResponsiveSize.padding(20) }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: ResponsiveSize.padding(16),
              paddingVertical: ResponsiveSize.padding(14),
              borderColor: isDarkMode ? "#3D4A5C" : "#D8DEE6",
              backgroundColor: isDarkMode ? "#2D3748" : "#F5F7FA",
            }}
          >
            <Feather
              name="mail"
              size={ResponsiveSize.font(20)}
              color={isDarkMode ? "#A0A0A0" : "#9AA5B4"}
              style={{ marginRight: ResponsiveSize.padding(12) }}
            />
            <TextInput
              style={{
                flex: 1,
                color: isDarkMode ? "#FFFFFF" : "#212121",
                fontSize: ResponsiveSize.font(16),
              }}
              placeholder="Enter your email"
              placeholderTextColor={isDarkMode ? "#A0A0A0" : "#9AA5B4"}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Phone Number Input */}
        <View style={{ marginBottom: ResponsiveSize.padding(20) }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: ResponsiveSize.padding(16),
              paddingVertical: ResponsiveSize.padding(14),
              borderColor: isDarkMode ? "#3D4A5C" : "#D8DEE6",
              backgroundColor: isDarkMode ? "#2D3748" : "#F5F7FA",
            }}
          >
            <Feather
              name="phone"
              size={ResponsiveSize.font(20)}
              color={isDarkMode ? "#A0A0A0" : "#9AA5B4"}
              style={{ marginRight: ResponsiveSize.padding(12) }}
            />
            <TextInput
              style={{
                flex: 1,
                color: isDarkMode ? "#FFFFFF" : "#212121",
                fontSize: ResponsiveSize.font(16),
              }}
              placeholder="Enter your phone number"
              placeholderTextColor={isDarkMode ? "#A0A0A0" : "#9AA5B4"}
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>
        </View>

        {/* Password Input */}
        <View style={{ marginBottom: ResponsiveSize.padding(8) }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: ResponsiveSize.padding(16),
              paddingVertical: ResponsiveSize.padding(14),
              borderColor: isDarkMode ? "#3D4A5C" : "#D8DEE6",
              backgroundColor: isDarkMode ? "#2D3748" : "#F5F7FA",
            }}
          >
            <Feather
              name="lock"
              size={ResponsiveSize.font(20)}
              color={isDarkMode ? "#A0A0A0" : "#9AA5B4"}
              style={{ marginRight: ResponsiveSize.padding(12) }}
            />
            <TextInput
              style={{
                flex: 1,
                color: isDarkMode ? "#FFFFFF" : "#212121",
                fontSize: ResponsiveSize.font(16),
              }}
              placeholder="Create a password"
              placeholderTextColor={isDarkMode ? "#A0A0A0" : "#9AA5B4"}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={toggleShowPassword}
              activeOpacity={0.8}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather
                name={showPassword ? "eye-off" : "eye"}
                size={ResponsiveSize.font(20)}
                color={isDarkMode ? "#A0A0A0" : "#9AA5B4"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Password Strength Indicator */}
        {password.length > 0 && (
          <View
            style={{
              marginBottom: ResponsiveSize.padding(20),
              paddingHorizontal: ResponsiveSize.padding(8),
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  flex: 1,
                  height: ResponsiveSize.height(6),
                  backgroundColor: isDarkMode ? "#3D4A5C" : "#E8E8E8",
                  borderRadius: 999,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    height: "100%",
                    borderRadius: 999,
                    backgroundColor: getPasswordStrengthColor(),
                    width:
                      passwordStrength === "weak"
                        ? "25%"
                        : passwordStrength === "medium"
                        ? "50%"
                        : passwordStrength === "strong"
                        ? "75%"
                        : "100%",
                  }}
                />
              </View>
              <Text
                style={{
                  marginLeft: ResponsiveSize.padding(8),
                  fontSize: ResponsiveSize.font(12),
                  color: getPasswordStrengthColor(),
                }}
              >
                {getPasswordStrengthText()}
              </Text>
            </View>
          </View>
        )}

        {/* Confirm Password Input */}
        <View style={{ marginBottom: ResponsiveSize.padding(24) }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: ResponsiveSize.padding(16),
              paddingVertical: ResponsiveSize.padding(14),
              borderColor: isDarkMode ? "#3D4A5C" : "#D8DEE6",
              backgroundColor: isDarkMode ? "#2D3748" : "#F5F7FA",
            }}
          >
            <Feather
              name="lock"
              size={ResponsiveSize.font(20)}
              color={isDarkMode ? "#A0A0A0" : "#9AA5B4"}
              style={{ marginRight: ResponsiveSize.padding(12) }}
            />
            <TextInput
              style={{
                flex: 1,
                color: isDarkMode ? "#FFFFFF" : "#212121",
                fontSize: ResponsiveSize.font(16),
              }}
              placeholder="Confirm password"
              placeholderTextColor={isDarkMode ? "#A0A0A0" : "#9AA5B4"}
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={toggleShowConfirmPassword}
              activeOpacity={0.8}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={ResponsiveSize.font(20)}
                color={isDarkMode ? "#A0A0A0" : "#9AA5B4"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Terms and Conditions */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            marginBottom: ResponsiveSize.padding(32),
          }}
        >
          <TouchableOpacity
            onPress={toggleTerms}
            activeOpacity={0.8}
            style={{ paddingTop: ResponsiveSize.padding(1) }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View
              style={{
                width: ResponsiveSize.width(20),
                height: ResponsiveSize.width(20),
                borderRadius: 4,
                borderWidth: 1,
                borderColor: acceptedTerms
                  ? isDarkMode
                    ? "#25BE80"
                    : "#1A8D60"
                  : isDarkMode
                  ? "#3D4A5C"
                  : "#D8DEE6",
                backgroundColor: acceptedTerms
                  ? isDarkMode
                    ? "#25BE80"
                    : "#1A8D60"
                  : isDarkMode
                  ? "#2D3748"
                  : "#FFFFFF",
                alignItems: "center",
                justifyContent: "center",
                marginRight: ResponsiveSize.padding(12),
              }}
            >
              {acceptedTerms && (
                <MaterialIcons
                  name="check"
                  size={ResponsiveSize.font(14)}
                  color="white"
                />
              )}
            </View>
          </TouchableOpacity>
          <DarkModeSecondaryText style={{ flex: 1 }}>
            I agree to the{" "}
            <Text
              style={{
                color: isDarkMode ? "#25BE80" : "#1A8D60",
                fontWeight: "600",
              }}
            >
              Terms of Service
            </Text>{" "}
            and{" "}
            <Text
              style={{
                color: isDarkMode ? "#25BE80" : "#1A8D60",
                fontWeight: "600",
              }}
            >
              Privacy Policy
            </Text>
          </DarkModeSecondaryText>
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity
          style={{
            backgroundColor: isDarkMode ? "#25BE80" : "#1A8D60",
            paddingVertical: ResponsiveSize.padding(16),
            borderRadius: 100,
            alignItems: "center",
            marginBottom: ResponsiveSize.padding(32),
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <Text
            style={{
              color: "white",
              fontSize: ResponsiveSize.font(18),
              fontWeight: "600",
            }}
          >
            Sign Up
          </Text>
        </TouchableOpacity>

        {/* Sign In Link */}
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <DarkModeSecondaryText>
            Already have an account?{" "}
          </DarkModeSecondaryText>
          <TouchableOpacity
            onPress={toggleAuthMode}
            activeOpacity={0.8}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text
              style={{
                color: isDarkMode ? "#25BE80" : "#1A8D60",
                fontWeight: "600",
              }}
            >
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function renderSignIn() {
    return (
      <View style={{ paddingHorizontal: ResponsiveSize.padding(24) }}>
        <DarkModeHeading
          style={{ marginBottom: ResponsiveSize.padding(12) }}
          level={2}
        >
          Welcome Back
        </DarkModeHeading>
        <DarkModeSecondaryText
          style={{ marginBottom: ResponsiveSize.padding(32) }}
        >
          Sign in to continue
        </DarkModeSecondaryText>

        {/* Email Input */}
        <View style={{ marginBottom: ResponsiveSize.padding(20) }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: ResponsiveSize.padding(16),
              paddingVertical: ResponsiveSize.padding(14),
              borderColor: isDarkMode ? "#3D4A5C" : "#D8DEE6",
              backgroundColor: isDarkMode ? "#2D3748" : "#F5F7FA",
            }}
          >
            <Feather
              name="mail"
              size={ResponsiveSize.font(20)}
              color={isDarkMode ? "#A0A0A0" : "#9AA5B4"}
              style={{ marginRight: ResponsiveSize.padding(12) }}
            />
            <TextInput
              style={{
                flex: 1,
                color: isDarkMode ? "#FFFFFF" : "#212121",
                fontSize: ResponsiveSize.font(16),
              }}
              placeholder="Enter your email"
              placeholderTextColor={isDarkMode ? "#A0A0A0" : "#9AA5B4"}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Password Input */}
        <View style={{ marginBottom: ResponsiveSize.padding(16) }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: ResponsiveSize.padding(16),
              paddingVertical: ResponsiveSize.padding(14),
              borderColor: isDarkMode ? "#3D4A5C" : "#D8DEE6",
              backgroundColor: isDarkMode ? "#2D3748" : "#F5F7FA",
            }}
          >
            <Feather
              name="lock"
              size={ResponsiveSize.font(20)}
              color={isDarkMode ? "#A0A0A0" : "#9AA5B4"}
              style={{ marginRight: ResponsiveSize.padding(12) }}
            />
            <TextInput
              style={{
                flex: 1,
                color: isDarkMode ? "#FFFFFF" : "#212121",
                fontSize: ResponsiveSize.font(16),
              }}
              placeholder="Enter your password"
              placeholderTextColor={isDarkMode ? "#A0A0A0" : "#9AA5B4"}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={toggleShowPassword}
              activeOpacity={0.8}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather
                name={showPassword ? "eye-off" : "eye"}
                size={ResponsiveSize.font(20)}
                color={isDarkMode ? "#A0A0A0" : "#9AA5B4"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity
          style={{
            alignSelf: "flex-end",
            marginBottom: ResponsiveSize.padding(32),
          }}
          activeOpacity={0.8}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text
            style={{
              color: isDarkMode ? "#25BE80" : "#1A8D60",
              fontWeight: "600",
            }}
          >
            Forgot Password?
          </Text>
        </TouchableOpacity>

        {/* Sign In Button */}
        <TouchableOpacity
          style={{
            backgroundColor: isDarkMode ? "#25BE80" : "#1A8D60",
            paddingVertical: ResponsiveSize.padding(16),
            borderRadius: 100,
            alignItems: "center",
            marginBottom: ResponsiveSize.padding(32),
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <Text
            style={{
              color: "white",
              fontSize: ResponsiveSize.font(18),
              fontWeight: "600",
            }}
          >
            Sign In
          </Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <DarkModeSecondaryText>Don't have an account? </DarkModeSecondaryText>
          <TouchableOpacity
            onPress={toggleAuthMode}
            activeOpacity={0.8}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text
              style={{
                color: isDarkMode ? "#25BE80" : "#1A8D60",
                fontWeight: "600",
              }}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

export default AuthScreen;
