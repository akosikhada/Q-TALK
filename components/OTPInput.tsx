import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Keyboard,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from "react-native";
import { ResponsiveSize } from "./StyledComponents";

interface OTPInputProps {
  length: number;
  onComplete: (otp: string) => void;
  autoFocus?: boolean;
  isDarkMode: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  onComplete,
  autoFocus = true,
  isDarkMode,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    // Initialize refs array
    inputRefs.current = inputRefs.current.slice(0, length);

    // Auto focus on first input
    if (autoFocus && inputRefs.current[0]) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [length, autoFocus]);

  useEffect(() => {
    const otpValue = otp.join("");
    if (otpValue.length === length) {
      onComplete(otpValue);
      Keyboard.dismiss();
    }
  }, [otp, length, onComplete]);

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) {
      // Handle paste
      const pastedText = text.split("");
      const newOtp = [...otp];

      for (let i = 0; i < length && i < pastedText.length; i++) {
        const targetIndex = index + i;
        if (targetIndex < length) {
          newOtp[targetIndex] = pastedText[i];
        }
      }

      setOtp(newOtp);

      // Focus on the next empty input or the last one
      const nextEmptyIndex = newOtp.findIndex((val) => val === "");
      if (nextEmptyIndex !== -1 && nextEmptyIndex < length) {
        inputRefs.current[nextEmptyIndex]?.focus();
      } else {
        inputRefs.current[length - 1]?.focus();
      }
    } else {
      // Handle single character input
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      // Move to next input if available
      if (text !== "" && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === "Backspace" && index > 0 && otp[index] === "") {
      // Move to previous input on backspace if current is empty
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {Array(length)
        .fill(0)
        .map((_, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={[
              styles.input,
              {
                backgroundColor: isDarkMode ? "#2D3748" : "#F3F4F6",
                color: isDarkMode ? "#FFFFFF" : "#1F2937",
                borderColor: otp[index]
                  ? "#25BE80"
                  : isDarkMode
                  ? "#3D4A5C"
                  : "#E5E7EB",
              },
            ]}
            maxLength={1}
            keyboardType="number-pad"
            value={otp[index]}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            selectionColor="#25BE80"
          />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  input: {
    width: ResponsiveSize.width(45),
    height: ResponsiveSize.width(45),
    borderRadius: ResponsiveSize.width(8),
    borderWidth: 1,
    textAlign: "center",
    fontSize: ResponsiveSize.font(18),
    fontWeight: "bold",
  },
});

export default OTPInput;
