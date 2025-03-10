import React, { useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  DarkModeWrapper,
  DarkModeText,
  DarkModeSecondaryText,
  DarkModeHeading,
  ResponsiveSize,
} from "../components/StyledComponents";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Dimensions, Animated, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { useTheme } from "../contexts/ThemeContext";

type SplashScreenProps = {
  onGetStarted: () => void;
  navigation?: any;
};

const SplashScreen: React.FC<SplashScreenProps> = ({
  onGetStarted,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const { isDarkMode } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  // Animation values
  const buttonScale = useRef(new Animated.Value(1)).current;
  const buttonOpacity = useRef(new Animated.Value(1)).current;

  const handleGetStarted = () => {
    // Start button animation
    setIsAnimating(true);

    Animated.sequence([
      // First scale down and up the button
      Animated.timing(buttonScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      // Then fade out the button
      Animated.timing(buttonOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // After animation completes, navigate to the next screen
      setTimeout(() => {
        onGetStarted();
      }, 500);
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: insets.top + ResponsiveSize.padding(20),
      paddingHorizontal: ResponsiveSize.padding(24),
      alignItems: "center",
      justifyContent: "center",
    },
    logoContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginBottom: ResponsiveSize.padding(24),
    },
    logo: {
      width: ResponsiveSize.width(160),
      height: ResponsiveSize.width(160),
      maxWidth: 180,
      maxHeight: 180,
    },
    titleContainer: {
      alignItems: "center",
      marginBottom: ResponsiveSize.padding(40),
    },
    appName: {
      marginBottom: ResponsiveSize.padding(12),
    },
    tagline: {
      textAlign: "center",
      maxWidth: ResponsiveSize.width(280),
      marginBottom: ResponsiveSize.padding(12),
    },
    animatedContainer: {
      width: "100%",
      maxWidth: ResponsiveSize.width(320),
      marginBottom: insets.bottom + ResponsiveSize.padding(20),
    },
    buttonContainer: {
      paddingVertical: ResponsiveSize.padding(16),
      paddingHorizontal: ResponsiveSize.padding(24),
      borderRadius: 100,
      width: "100%",
    },
    buttonContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      color: "white",
      fontWeight: "600",
      fontSize: ResponsiveSize.font(18),
      marginRight: ResponsiveSize.padding(8),
    },
    loadingContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginBottom: insets.bottom + ResponsiveSize.padding(20),
    },
    lottieAnimation: {
      width: ResponsiveSize.width(100),
      height: ResponsiveSize.width(100),
    },
    backgroundCircleTop: {
      position: "absolute",
      top: -ResponsiveSize.height(80),
      right: -ResponsiveSize.width(80),
      width: ResponsiveSize.width(screenWidth * 0.6),
      height: ResponsiveSize.width(screenWidth * 0.6),
      borderRadius: 999,
    },
    backgroundCircleBottom: {
      position: "absolute",
      bottom: -ResponsiveSize.height(60),
      left: -ResponsiveSize.width(60),
      width: ResponsiveSize.width(screenWidth * 0.5),
      height: ResponsiveSize.width(screenWidth * 0.5),
      borderRadius: 999,
    },
  });

  return (
    <DarkModeWrapper>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      {/* Top right circular background */}
      <View
        style={[
          styles.backgroundCircleTop,
          { backgroundColor: isDarkMode ? "#2D3748" : "#E8FFF4" },
        ]}
      />

      {/* Bottom left circular background */}
      <View
        style={[
          styles.backgroundCircleBottom,
          { backgroundColor: isDarkMode ? "#2D3748" : "#E8FFF4" },
        ]}
      />

      <View style={styles.container}>
        {/* App Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/SimpleLogo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* App Name and Tagline */}
        <View style={styles.titleContainer}>
          <DarkModeHeading level={1} style={styles.appName}>
            Q-TALK
          </DarkModeHeading>
          <DarkModeSecondaryText style={styles.tagline}>
            Communicate with confidence. Privacy by design.
          </DarkModeSecondaryText>
        </View>

        {/* Get Started Button */}
        {!isAnimating ? (
          <Animated.View
            style={[
              styles.animatedContainer,
              {
                transform: [{ scale: buttonScale }],
                opacity: buttonOpacity,
              },
            ]}
          >
            <TouchableOpacity
              onPress={handleGetStarted}
              style={[
                styles.buttonContainer,
                { backgroundColor: isDarkMode ? "#25BE80" : "#1A8D60" },
              ]}
              activeOpacity={0.8}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Get Started</Text>
                <Feather
                  name="arrow-right"
                  size={ResponsiveSize.font(20)}
                  color="white"
                />
              </View>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <View style={styles.loadingContainer}>
            <LottieView
              source={require("../assets/animations/loading.json")}
              autoPlay
              loop
              style={styles.lottieAnimation}
              colorFilters={[
                {
                  keypath: "Circle",
                  color: isDarkMode ? "#25BE80" : "#1A8D60",
                },
              ]}
            />
          </View>
        )}
      </View>
    </DarkModeWrapper>
  );
};

export default SplashScreen;
