import React, { useState, useEffect, useCallback, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  TouchableOpacity,
  DarkModeWrapper,
  DarkModeText,
  DarkModeSecondaryText,
  DarkModeHeading,
  ResponsiveSize,
  OTPInput,
} from "../components";
import {
  ActivityIndicator,
  Animated,
  Easing,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { useAlert } from "../contexts/AlertContext";

type OTPScreenProps = {
  phoneOrEmail: string;
  onVerify: (otp: string) => void;
  onResendOTP: () => void;
  navigation?: any;
};

const OTPScreen: React.FC<OTPScreenProps> = ({
  phoneOrEmail,
  onVerify,
  onResendOTP,
  navigation,
}) => {
  const [minutes, setMinutes] = useState(2);
  const [seconds, setSeconds] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const { showWarningAlert } = useAlert();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59);
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [minutes, seconds]);

  const animateVerification = useCallback(() => {
    // Scale up animation
    Animated.sequence([
      // First scale up
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      // Then scale back to normal
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim]);

  const handleVerify = useCallback(
    (otpValue: string) => {
      if (otpValue.length === 6 && /^\d+$/.test(otpValue)) {
        setIsVerifying(true);

        // Simulate verification process
        setTimeout(() => {
          setIsVerifying(false);
          setVerificationSuccess(true);
          animateVerification();

          // Call onVerify after showing success animation for a moment
          setTimeout(() => {
            // Fade out animation
            Animated.timing(opacityAnim, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
              easing: Easing.ease,
            }).start(() => {
              // Call onVerify after animation completes
              onVerify(otpValue);
            });
          }, 2000);
        }, 1500);
      } else {
        showWarningAlert("Invalid Code", "Please enter a valid 6-digit code");
      }
    },
    [animateVerification, opacityAnim, onVerify, showWarningAlert]
  );

  const handleResend = useCallback(() => {
    onResendOTP();
    setMinutes(2);
    setSeconds(0);
  }, [onResendOTP]);

  const formatTime = useCallback((min: number, sec: number) => {
    return `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: insets.top + ResponsiveSize.padding(20),
      paddingHorizontal: ResponsiveSize.padding(24),
    },
    contentContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingBottom: insets.bottom + ResponsiveSize.padding(20),
    },
    backButton: {
      position: "absolute",
      top: insets.top,
      left: ResponsiveSize.padding(16),
      zIndex: 10,
      padding: ResponsiveSize.padding(12),
    },
    successContainer: {
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      maxWidth: ResponsiveSize.width(320),
    },
    successCircle: {
      width: ResponsiveSize.width(100),
      height: ResponsiveSize.width(100),
      borderRadius: ResponsiveSize.width(50),
      backgroundColor: isDarkMode ? "#25BE80" : "#1A8D60",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: ResponsiveSize.padding(24),
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 8,
    },
    successTitle: {
      marginBottom: ResponsiveSize.padding(16),
      textAlign: "center",
    },
    successMessage: {
      textAlign: "center",
      maxWidth: ResponsiveSize.width(280),
    },
    title: {
      textAlign: "center",
      marginBottom: ResponsiveSize.padding(12),
    },
    subtitle: {
      textAlign: "center",
      marginBottom: ResponsiveSize.padding(32),
    },
    otpContainer: {
      marginBottom: ResponsiveSize.padding(32),
      width: "100%",
      maxWidth: ResponsiveSize.width(360),
    },
    timerContainer: {
      alignItems: "center",
      marginBottom: ResponsiveSize.padding(32),
    },
    verifyButton: {
      paddingVertical: ResponsiveSize.padding(16),
      borderRadius: 100,
      alignItems: "center",
      width: "100%",
      maxWidth: ResponsiveSize.width(360),
      marginBottom: ResponsiveSize.padding(16),
    },
    buttonText: {
      color: "white",
      fontWeight: "600",
      fontSize: ResponsiveSize.font(18),
    },
    resendButton: {
      paddingVertical: ResponsiveSize.padding(12),
      alignItems: "center",
      width: "100%",
      maxWidth: ResponsiveSize.width(360),
    },
  });

  return (
    <DarkModeWrapper>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
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
        <View style={styles.contentContainer}>
          {verificationSuccess ? (
            <Animated.View
              style={[
                styles.successContainer,
                {
                  transform: [{ scale: scaleAnim }],
                  opacity: opacityAnim,
                },
              ]}
            >
              <View style={styles.successCircle}>
                <Feather
                  name="check"
                  size={ResponsiveSize.font(50)}
                  color="white"
                />
              </View>
              <DarkModeHeading level={2} style={styles.successTitle}>
                Verification Successful!
              </DarkModeHeading>
              <DarkModeSecondaryText style={styles.successMessage}>
                You will be redirected shortly...
              </DarkModeSecondaryText>
            </Animated.View>
          ) : (
            <>
              <DarkModeHeading level={2} style={styles.title}>
                Verification Code
              </DarkModeHeading>
              <DarkModeSecondaryText style={styles.subtitle}>
                We have sent a verification code to{" "}
                <Text style={{ fontWeight: "bold" }}>{phoneOrEmail}</Text>
              </DarkModeSecondaryText>

              {/* OTP Input */}
              <View style={styles.otpContainer}>
                <OTPInput
                  length={6}
                  onComplete={handleVerify}
                  isDarkMode={isDarkMode}
                />
              </View>

              {/* Timer */}
              <View style={styles.timerContainer}>
                <DarkModeSecondaryText>
                  Resend code in{" "}
                  <Text
                    style={{
                      color: isDarkMode ? "#25BE80" : "#1A8D60",
                      fontWeight: "600",
                    }}
                  >
                    {formatTime(minutes, seconds)}
                  </Text>
                </DarkModeSecondaryText>
              </View>

              {/* Verify Button */}
              <TouchableOpacity
                style={[
                  styles.verifyButton,
                  {
                    backgroundColor: isVerifying
                      ? "#9AA5B4"
                      : isDarkMode
                      ? "#25BE80"
                      : "#1A8D60",
                  },
                ]}
                onPress={() => {}}
                disabled={isVerifying}
                activeOpacity={0.8}
              >
                {isVerifying ? (
                  <ActivityIndicator
                    color="white"
                    size={ResponsiveSize.font(24)}
                  />
                ) : (
                  <Text style={styles.buttonText}>Verify</Text>
                )}
              </TouchableOpacity>

              {/* Resend Button */}
              <TouchableOpacity
                style={styles.resendButton}
                onPress={handleResend}
                disabled={minutes > 0 || seconds > 0}
                activeOpacity={0.8}
              >
                <Text
                  style={{
                    fontWeight: "600",
                    fontSize: ResponsiveSize.font(16),
                    color:
                      minutes > 0 || seconds > 0
                        ? "#9AA5B4"
                        : isDarkMode
                        ? "#25BE80"
                        : "#1A8D60",
                  }}
                >
                  Resend Code
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </DarkModeWrapper>
  );
};

export default OTPScreen;
