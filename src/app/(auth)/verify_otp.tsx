import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import ButtonComponent from "@/src/components/atoms/ButtonComponent";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import OTPInput from "@codsod/react-native-otp-input";
import { storage } from "@/src/utils/storage";

const VerifyOTP = () => {
  const [otp, setOTP] = useState("");
  const onClickVerifyButton = () => {
    console.log(otp);
    storage.set("access_token", "happy_anniversary_qcu");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <AntDesign name="arrowleft" style={styles.back_button} />
        <Text style={styles.header_title}>Verify OTP Code</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.otp_send_text}>
          Code has been sent to +63 *** **** 890
        </Text>
        <OTPInput
          length={4}
          onOtpComplete={(txt: string) => setOTP(txt)}
          style={styles.otp_input_container}
          inputStyle={styles.otp_input}
        />
        <Text style={styles.otp_resend_text}>
          Resend OTP Code in <Text style={styles.otp_timer_text}>59</Text> s
        </Text>
      </View>
      <View style={styles.footer}>
        <ButtonComponent
          title="Verify"
          opacity={0.8}
          onPress={onClickVerifyButton}
          style={styles.verify_button}
        />
      </View>
    </SafeAreaView>
  );
};

export default VerifyOTP;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateScale(20),
    justifyContent: "space-between",
    paddingTop: verticalScale(30),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(10),
  },
  back_button: {
    fontSize: moderateScale(24),
    color: "#000000",
    fontWeight: "bold",
  },
  header_title: {
    fontSize: moderateScale(20),
    color: "#000000",
    fontWeight: "bold",
  },
  body: {
    alignItems: "center",
    gap: verticalScale(25),
  },
  otp_send_text: {
    fontSize: moderateScale(16),
    fontWeight: "400",
  },
  otp_resend_text: {},
  otp_timer_text: {
    color: "#00a884",
  },
  footer: {},
  verify_button: {
    padding: moderateScale(15),
  },
  otp_input: {
    borderColor: "#000000",
    borderRadius: moderateScale(15),
    height: verticalScale(50),
    width: scale(50),
  },
  otp_input_container: {
    gap: scale(10),
  },
});
