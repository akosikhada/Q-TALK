import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ImagePath from "@/src/constants/ImagePath";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { router } from "expo-router";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  let NavigateToWelcomeScreen = () => {
    router.push("/(auth)/terms_agreement");
  };
  let LoadingTimeOutFunction = () => {
    setIsLoading(true);
    setTimeout(NavigateToWelcomeScreen, 3000);
  };

  useEffect(() => {
    const timeout = setTimeout(LoadingTimeOutFunction, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}></View>
      <View style={styles.body}>
        <Image
          source={ImagePath.q_talk_logo}
          style={styles.logo_style}
          resizeMode="contain"
        />
        <Text style={styles.q_talk_text}>Q-Talk</Text>
      </View>
      <View style={styles.footer}>
        {isLoading ? (
          <>
            <ActivityIndicator size={moderateScale(48)} color={"#0CCC83"} />
            <Text style={styles.loading_text}>Loading...</Text>
          </>
        ) : (
          <>
            <Text style={styles.from_text}>From</Text>
            <Text style={styles.quantum_text}>
              Q-Talk. All Rights Reserved.
            </Text>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Auth;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: verticalScale(50),
  },
  header: {},
  body: { alignItems: "center", gap: verticalScale(10) },
  footer: {
    alignItems: "center",
    height: verticalScale(80),
    justifyContent: "flex-end",
  },
  from_text: { fontSize: moderateScale(12), color: "#867373" },
  quantum_text: { fontSize: moderateScale(15), color: "#000000" },
  logo_style: {
    width: moderateScale(70),
    height: moderateScale(70),
    borderRadius: moderateScale(10),
  },
  q_talk_text: {
    fontSize: moderateScale(35),
    color: "#000000",
    fontWeight: "900",
  },
  loading_text: {
    fontSize: moderateScale(20),
    color: "#00A884",
    fontWeight: "bold",
    marginTop: verticalScale(15),
  },
});
