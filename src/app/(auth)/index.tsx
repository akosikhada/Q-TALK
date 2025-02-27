import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Auth = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}></View>
      <View style={styles.body}></View>
      <View style={styles.footer}>
        <Text style={styles.from_text}>From</Text>
        <Text style={styles.all_rights_reserved_text}>
          Q-Talk. All rights reserved.
        </Text>
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
    paddingVertical: 70,
  },
  header: {},
  body: {},
  footer: { alignItems: "center" },
  from_text: { fontSize: 12, color: "#867373" },
  all_rights_reserved_text: { fontSize: 15, color: "#000000" },
});
