import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
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
} from "../components";

import OTPInput from "../components/OTPInput";
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

import { getDatabase, ref, get, set, remove } from "firebase/database";
import { getAuth } from "firebase/auth";

type OTPScreenProps = {
  phoneOrEmail: string;
  onVerify: (otp: string) => void;
  onResendOTP: () => void;
  navigation?: any;
};

const EnhancedOTPInput = forwardRef((props: any, ref) => {
  const [otp, setOtp] = useState("");
  const otpInputRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    reset: () => {
      setOtp("");
      // Clear the underlying OTPInput
      if (otpInputRef.current && otpInputRef.current.clear) {
        otpInputRef.current.clear();
      }
    },
    getValue: () => otp,
  }));

  const handleOtpChange = (value: string) => {
    setOtp(value);
    if (props.onChangeText) {
      props.onChangeText(value);
    }
  };

  const handleComplete = (value: string) => {
    if (props.onComplete) {
      props.onComplete(value);
    }
  };

  return (
    <OTPInput
      ref={otpInputRef}
      {...props}
      value={otp}
      onChangeText={handleOtpChange}
      onComplete={handleComplete}
    />
  );
});

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
  const otpInputRef = useRef<any>(null);
  const [otpValue, setOtpValue] = useState("");

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

  const resetOtpInput = useCallback(() => {
    setOtpValue("");
    if (otpInputRef.current && otpInputRef.current.reset) {
      otpInputRef.current.reset();
    }
  }, []);

  const handleVerify = useCallback(
    async (otpValue: string) => {
      if (otpValue.length === 6 && /^\d+$/.test(otpValue)) {
        setIsVerifying(true);
        try {
          const auth = getAuth();
          const user = auth.currentUser;

          if (!user) {
            resetOtpInput(); // Reset OTP first
            setIsVerifying(false);
            showWarningAlert("Error", "User not found, please sign in again");
            return;
          }

          const db = getDatabase();
          const userRef = ref(db, `users/${user.uid}`);
          const userSnapshot = await get(userRef);

          if (!userSnapshot.exists()) {
            resetOtpInput(); // Reset OTP first
            setIsVerifying(false);
            showWarningAlert("Error", "User data not found");
            return;
          }

          const userData = userSnapshot.val();
          const response = await fetch(
            "http://192.168.254.103:5000/verify-otp",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: userData.email, otp: otpValue }),
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to verify OTP");
          }

          await set(ref(db, `users/${user.uid}/emailVerified`), true);

          setVerificationSuccess(true);
          animateVerification();
          setTimeout(() => {
            Animated.timing(opacityAnim, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
              easing: Easing.ease,
            }).start(() => {
              onVerify(otpValue);
            });
          }, 2000);
        } catch (error: any) {
          resetOtpInput(); // Ensure OTP is cleared before showing error
          setIsVerifying(false);
          showWarningAlert("Verification Error", error.message);
        }
      } else {
        resetOtpInput(); // Ensure OTP is cleared first
        showWarningAlert("Invalid Code", "Please enter a valid 6-digit code");
      }
    },
    [
      animateVerification,
      opacityAnim,
      onVerify,
      showWarningAlert,
      resetOtpInput,
    ]
  );

  const handleResend = useCallback(async () => {
    try {
      setIsVerifying(true);
      const auth = getAuth();
      const db = getDatabase();
      const user = auth.currentUser;

      if (!user) {
        showWarningAlert("Error", "User not found, please sign in again");
        setIsVerifying(false);
        return;
      }

      // Get the user email
      const userRef = ref(db, `users/${user.uid}`);
      const userSnapshot = await get(userRef);

      if (!userSnapshot.exists()) {
        showWarningAlert("Error", "User data not found");
        setIsVerifying(false);
        return;
      }

      const userData = userSnapshot.val();

      // Call backend to generate and send new OTP
      const response = await fetch("http://192.168.254.103:5000/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userData.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to resend OTP");
      }

      setMinutes(2);
      setSeconds(0);

      resetOtpInput();

      // Show success message
      showWarningAlert(
        "OTP Sent",
        "A new verification code has been sent to your email"
      );
      setIsVerifying(false);
    } catch (error: any) {
      showWarningAlert("Error", error.message);
      setIsVerifying(false);
    }
  }, [showWarningAlert, resetOtpInput]);

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
                <EnhancedOTPInput
                  ref={otpInputRef}
                  length={6}
                  isDarkMode={isDarkMode}
                  value={otpValue}
                  onChangeText={setOtpValue}
                  onComplete={(value: string) => handleVerify(value)}
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
                onPress={() => {
                  if (!isVerifying && otpInputRef.current) {
                    // Check isVerifying state
                    const currentOtp = otpInputRef.current.getValue();
                    if (currentOtp && currentOtp.length === 6) {
                      handleVerify(currentOtp);
                    } else {
                      showWarningAlert(
                        "Invalid Code",
                        "Please enter a valid 6-digit code"
                      );
                    }
                  }
                }}
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
