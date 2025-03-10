import React, { useState, useRef, useEffect } from "react";
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
} from "../components/StyledComponents";
import {
  TextInput,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  ActivityIndicator,
  Animated,
  Easing,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import LottieView from "lottie-react-native";

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
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [minutes, setMinutes] = useState(2);
  const [seconds, setSeconds] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const screenWidth = Dimensions.get("window").width;

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

  const handleOtpChange = (text: string, index: number) => {
    if (text.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      // Auto focus to next input
      if (text.length === 1 && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const animateVerification = () => {
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
  };

  const handleVerify = () => {
    const otpString = otp.join("");
    if (otpString.length === 6) {
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
            onVerify(otpString);
          });
        }, 2000);
      }, 1500);
    } else {
      alert("Please enter a valid 6-digit code");
    }
  };

  const handleResend = () => {
    onResendOTP();
    setMinutes(2);
    setSeconds(0);
  };

  const formatTime = (min: number, sec: number) => {
    return `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

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
    successAnimation: {
      width: ResponsiveSize.width(200),
      height: ResponsiveSize.width(200),
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
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: ResponsiveSize.padding(32),
      width: "100%",
      maxWidth: ResponsiveSize.width(360),
    },
    otpInput: {
      width: ResponsiveSize.width(50),
      height: ResponsiveSize.height(60),
      borderWidth: 1,
      borderRadius: 8,
      textAlign: "center",
      fontSize: ResponsiveSize.font(24),
      fontWeight: "bold",
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
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    style={[
                      styles.otpInput,
                      {
                        backgroundColor: isDarkMode ? "#2D3748" : "#F5F7FA",
                        color: isDarkMode ? "#FFFFFF" : "#212121",
                        borderColor: isDarkMode ? "#3D4A5C" : "#D8DEE6",
                      },
                    ]}
                    maxLength={1}
                    keyboardType="number-pad"
                    value={digit}
                    onChangeText={(text) => handleOtpChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                  />
                ))}
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
                onPress={handleVerify}
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
