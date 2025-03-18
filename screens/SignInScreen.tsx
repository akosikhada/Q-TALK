import React, { useState } from "react";
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
import { Feather, AntDesign } from "@expo/vector-icons";
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
import { useAlert } from "../contexts/AlertContext";

import { auth, db, ref, get, signInWithEmailAndPassword } from "../services/config";
import { signInWithEmail } from '../services/AuthService';

type SignInScreenProps = {
  navigation?: any;
};

const SignInScreen: React.FC<SignInScreenProps> = ({
  navigation
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const { showErrorAlert } = useAlert();

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      showErrorAlert("Missing Information", "Please enter your email");
      return;
    }
    if (!password.trim()) {
      showErrorAlert("Missing Information", "Please enter your password");
      return;
    }
    
    setIsLoading(true);
    try {
      // Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      if (user) {
        // Check if user exists in Firebase Realtime Database
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
  
        if (snapshot.exists()) {
          console.log("User exists in database:", snapshot.val());
        } else {
          showErrorAlert("Authentication Failed", "User not found in the database.");
        }
      }
    } catch (error:any) {
      console.error("Login error:", error.message);
      showErrorAlert("Login Failed", error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to handle Google Sign-In UI button press
  const handleGoogleButtonPress = () => {
    // This is just a placeholder for UI demonstration
    console.log("Google button pressed");
    // The actual implementation would be handled by the backend team
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
                marginBottom: ResponsiveSize.padding(16),
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

            {/* OR Divider */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: ResponsiveSize.padding(16),
              }}
            >
              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: isDarkMode ? "#3D4A5C" : "#D8DEE6",
                }}
              />
              <DarkModeSecondaryText
                style={{ marginHorizontal: ResponsiveSize.padding(10) }}
              >
                OR
              </DarkModeSecondaryText>
              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: isDarkMode ? "#3D4A5C" : "#D8DEE6",
                }}
              />
            </View>

            {/* Continue with Google Button */}
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isDarkMode ? "#2D3748" : "white",
                paddingVertical: ResponsiveSize.padding(16),
                borderRadius: 100,
                marginBottom: ResponsiveSize.padding(32),
                borderWidth: 1,
                borderColor: isDarkMode ? "#3D4A5C" : "#D8DEE6",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
              onPress={handleGoogleButtonPress}
              activeOpacity={0.8}
            >
              <AntDesign
                name="google"
                size={ResponsiveSize.font(20)}
                color="#DB4437"
                style={{ marginRight: ResponsiveSize.padding(10) }}
              />
              <Text
                style={{
                  color: isDarkMode ? "#FFFFFF" : "#212121",
                  fontSize: ResponsiveSize.font(16),
                  fontWeight: "600",
                }}
              >
                Continue with Google
              </Text>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <DarkModeSecondaryText>
                Don't have an account?{" "}
              </DarkModeSecondaryText>
              <TouchableOpacity
                onPress={() => navigation.navigate("SignUp")}
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
        </ScrollView>
      </KeyboardAvoidingView>
    </DarkModeWrapper>
  );
};

export default SignInScreen;
