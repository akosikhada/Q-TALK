import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import React from "react";
import Images from "@/constants/Images";
import Colors from "@/constants/Colors";
import { Link } from "expo-router";

const Page = () => {
  const openLink = () => {
    Linking.openURL("https://miguelenriquedasalla.vercel.app");
  };

  return (
    <View style={styles.container}>
      <Image
        source={Images.welcomeDoodle}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.headline}>Welcome to Q-Talk</Text>
      <Text style={styles.description}>
        Read our{" "}
        <Text style={styles.link} onPress={openLink}>
          Privacy Policy
        </Text>
        . {"Tap 'Agree and Continue' to accept the "}
        <Text style={styles.link} onPress={openLink}>
          Terms of Service
        </Text>
        .
      </Text>
      <Link href={"/otp"} replace asChild>
        <TouchableOpacity style={styles.button} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Agree and Continue</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 300,
    marginBottom: 80,
    borderRadius: 24,
  },
  headline: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginVertical: 20,
  },
  description: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: "center",
    marginBottom: 20,
  },
  link: {
    color: Colors.primary,
  },
  button: {
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 24,
    color: Colors.primary,
    fontWeight: "bold",
  },
});
