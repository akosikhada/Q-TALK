import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
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

type AuthScreenProps = {
  onSignIn: () => void;
  onSignUp: () => void;
  navigation?: any;
};

const AuthScreen: React.FC<AuthScreenProps> = ({
  onSignIn,
  onSignUp,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();

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

      <View style={styles.container}>
        {/* App Logo and Welcome Text */}
        <View style={styles.headerContainer}>
          <Image
            source={require("../assets/SimpleLogo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <DarkModeHeading level={1} style={styles.title}>
            Welcome to Q-TALK
          </DarkModeHeading>
          <DarkModeSecondaryText style={styles.subtitle}>
            Connect with friends and family securely
          </DarkModeSecondaryText>
        </View>

        {/* Auth Buttons */}
        <View style={styles.buttonContainer}>
          {/* Sign In Button */}
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: isDarkMode ? "#25BE80" : "#1A8D60",
              },
            ]}
            onPress={onSignIn}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: isDarkMode ? "transparent" : "white",
                borderWidth: 2,
                borderColor: isDarkMode ? "#25BE80" : "#1A8D60",
                marginTop: ResponsiveSize.padding(16),
              },
            ]}
            onPress={onSignUp}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color: isDarkMode ? "#25BE80" : "#1A8D60",
                  fontWeight: "700",
                },
              ]}
            >
              Create Account
            </Text>
          </TouchableOpacity>

          {/* OR Divider */}
          <View style={styles.divider}>
            <View
              style={[
                styles.dividerLine,
                { backgroundColor: isDarkMode ? "#3D4A5C" : "#D8DEE6" },
              ]}
            />
            <DarkModeSecondaryText style={styles.dividerText}>
              OR
            </DarkModeSecondaryText>
            <View
              style={[
                styles.dividerLine,
                { backgroundColor: isDarkMode ? "#3D4A5C" : "#D8DEE6" },
              ]}
            />
          </View>

          {/* Google Sign In Button */}
          <TouchableOpacity
            style={[
              styles.socialButton,
              {
                backgroundColor: isDarkMode ? "#2D3748" : "white",
                borderColor: isDarkMode ? "#3D4A5C" : "#D8DEE6",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              },
            ]}
            onPress={handleGoogleButtonPress}
            activeOpacity={0.8}
          >
            <AntDesign
              name="google"
              size={ResponsiveSize.font(20)}
              color="#DB4437"
              style={styles.socialIcon}
            />
            <DarkModeText style={styles.socialButtonText}>
              Continue with Google
            </DarkModeText>
          </TouchableOpacity>
        </View>

        {/* Terms and Privacy */}
        <View style={styles.termsContainer}>
          <DarkModeSecondaryText style={styles.termsText}>
            By continuing, you agree to our{" "}
            <Text style={{ color: isDarkMode ? "#25BE80" : "#1A8D60" }}>
              Terms of Service
            </Text>{" "}
            and{" "}
            <Text style={{ color: isDarkMode ? "#25BE80" : "#1A8D60" }}>
              Privacy Policy
            </Text>
          </DarkModeSecondaryText>
        </View>
      </View>
    </DarkModeWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: ResponsiveSize.padding(24),
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: ResponsiveSize.padding(48),
  },
  logo: {
    width: ResponsiveSize.width(120),
    height: ResponsiveSize.width(120),
    marginBottom: ResponsiveSize.padding(24),
  },
  title: {
    fontSize: ResponsiveSize.font(28),
    fontWeight: "700",
    marginBottom: ResponsiveSize.padding(8),
    textAlign: "center",
  },
  subtitle: {
    fontSize: ResponsiveSize.font(16),
    textAlign: "center",
    maxWidth: "80%",
  },
  buttonContainer: {
    width: "100%",
    marginBottom: ResponsiveSize.padding(32),
  },
  button: {
    paddingVertical: ResponsiveSize.padding(16),
    borderRadius: 100,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontSize: ResponsiveSize.font(18),
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: ResponsiveSize.padding(24),
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: ResponsiveSize.padding(16),
    fontSize: ResponsiveSize.font(14),
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: ResponsiveSize.padding(16),
    borderRadius: 100,
    borderWidth: 1,
  },
  socialIcon: {
    marginRight: ResponsiveSize.padding(12),
  },
  socialButtonText: {
    fontSize: ResponsiveSize.font(16),
    fontWeight: "500",
  },
  termsContainer: {
    alignItems: "center",
  },
  termsText: {
    fontSize: ResponsiveSize.font(12),
    textAlign: "center",
    lineHeight: ResponsiveSize.font(18),
  },
});

export default AuthScreen;
