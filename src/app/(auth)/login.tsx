import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import ButtonComponent from "@/src/components/atoms/ButtonComponent";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import CountryPicker from "react-native-country-picker-modal";

const Login = () => {
  const [selectCountryVisible, setSelectCountryVisible] = useState(false);
  const [countryName, setCountryName] = useState("Philippines");
  const [countryCode, setCountryCode] = useState("+63");
  const OnContinueButton = () => {
    router.push("/(auth)/verify_otp");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.heading_container}>
          <Text style={styles.heading}>Enter Your Mobile Number</Text>
          <Text style={styles.description}>
            Q-Talk will send you a verification code via SMS.{" "}
            <Text style={styles.link_description}>What's your number?</Text>
          </Text>
        </View>
        <View style={styles.input_main_container}>
          <TouchableOpacity
            style={styles.dropdown_container}
            onPress={() => setSelectCountryVisible(true)}
            activeOpacity={0.8}
          >
            <View />
            <Text style={styles.dropdown_title}>{countryName}</Text>
            <AntDesign
              name="caretdown"
              size={moderateScale(14)}
              color="#000000"
            />
          </TouchableOpacity>
          <View style={styles.horizontal_line} />
          <View style={styles.input_container}>
            <View style={styles.country_code}>
              <Text style={styles.country_code_text}>{countryCode}</Text>
              <View style={styles.horizontal_line} />
            </View>
            <View
              style={{
                gap: verticalScale(10),
                flex: 1,
              }}
            >
              <TextInput
                style={styles.input}
                placeholder="Enter your mobile number"
              />
              <View style={styles.horizontal_line} />
            </View>
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <ButtonComponent
          title="CONTINUE"
          style={{ paddingHorizontal: scale(30) }}
          onPress={OnContinueButton}
        />
      </View>
      {selectCountryVisible && (
        <CountryPicker
          visible={true}
          countryCode="PH"
          onClose={() => setSelectCountryVisible(false)}
          withFilter
          onSelect={(country: any) => {
            setCountryCode(`+${country.callingCode[0]}`);
            setCountryName(country.name);
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: verticalScale(50),
    paddingHorizontal: scale(20),
    alignItems: "center",
  },
  header: {
    gap: verticalScale(50),
  },
  footer: {},
  heading_container: {
    gap: verticalScale(20),
  },
  input_main_container: {},
  input_container: {
    paddingVertical: verticalScale(12),
    flexDirection: "row",
    alignItems: "center",
    gap: scale(20),
  },
  heading: {
    fontSize: moderateScale(20),
    color: "#000000",
    fontWeight: "bold",
    textAlign: "center",
  },
  description: {
    textAlign: "center",
    fontSize: moderateScale(13),
    fontWeight: "400",
    color: "#000000",
  },
  link_description: {
    color: "#002ac0",
  },
  horizontal_line: {
    width: "100%",
    height: verticalScale(1),
    backgroundColor: "#05aa82",
  },
  dropdown_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(20),
  },
  dropdown_title: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    color: "#000000",
  },
  input: {
    fontSize: moderateScale(16),
    color: "#000000",
    fontWeight: "500",
  },
  country_code: {
    gap: verticalScale(10),
    fontWeight: "bold",
    color: "#000000",
  },
  country_code_text: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    color: "#000000",
  },
});
