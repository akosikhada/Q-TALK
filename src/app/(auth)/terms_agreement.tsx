import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import ImagePath from "@/src/constants/ImagePath";
import ButtonComponent from "@/src/components/atoms/ButtonComponent";
import { router } from "expo-router";

const TermsAgreement = () => {
  const OnAgreeAndContinue = () => {
    router.push("/(auth)/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome_text}>Welcome to Q-TALK</Text>
        <Image
          source={ImagePath.q_talk_welcome}
          style={styles.welcome_image}
          resizeMode="contain"
        />
        <Text style={styles.welcome_description}>
          Read our <Text style={styles.welcome_link_text}>Privacy Policy</Text>.
          Tap "Agree and Continue" to accept the Q-TALK{" "}
          <Text style={styles.welcome_link_text}>Terms of Service.</Text>
        </Text>
        <View style={{ width: moderateScale(300) }}>
          <ButtonComponent
            title="AGREE AND CONTINUE"
            onPress={OnAgreeAndContinue}
          />
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.from_text}>From</Text>
        <Text style={styles.quantum_text}>Q-TALK</Text>
      </View>
    </SafeAreaView>
  );
};

export default TermsAgreement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: verticalScale(85),
    paddingHorizontal: scale(30),
  },
  header: {
    alignItems: "center",
    gap: verticalScale(30),
  },
  footer: {
    alignItems: "center",
  },
  from_text: {
    fontSize: moderateScale(12),
    color: "#867373",
  },
  quantum_text: {
    fontSize: moderateScale(15),
    color: "#000000",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  welcome_text: {
    fontSize: moderateScale(30),
    fontWeight: "bold",
    color: "#000000",
    marginBottom: verticalScale(10),
  },
  welcome_image: {
    width: moderateScale(250),
    height: verticalScale(250),
  },
  welcome_description: {
    textAlign: "center",
    fontSize: moderateScale(12),
    color: "#000000",
  },
  welcome_link_text: {
    color: "#0c42cc",
  },
});
