import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Chats from "@/src/components/molecules/Chats";
import Status from "@/src/components/molecules/Status";
import Calls from "@/src/components/molecules/Calls";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { StatusBar } from "expo-status-bar";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";

const Main = () => {
  const [currentPage, setCurrentPage] = useState("chat");

  const ActivePage = () => {
    switch (currentPage) {
      case "chat":
        return <Chats />;
      case "status":
        return <Status />;
      case "calls":
        return <Calls />;
      default:
        return <Chats />;
    }
  };

  const QTalkHeaderTitle = () => {
    return (
      <View style={styles.header_title_container}>
        <Text style={styles.header_title}>Q-Talk</Text>
        <View style={styles.header_icons_container}>
          <AntDesign name="search1" style={styles.header_icons} />
          <Entypo name="dots-three-vertical" style={styles.header_icons} />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#008069" style="light" />
      <QTalkHeaderTitle />
      <View style={styles.top_bar_container}>
        {["chat", "status", "calls"].map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => setCurrentPage(item)}
              style={[
                styles.top_bar_buttons,
                item == currentPage && { borderColor: "#ffffff" },
              ]}
              activeOpacity={0.8}
            >
              <Text style={styles.top_bar_titles}>{item}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {ActivePage()}
    </SafeAreaView>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  top_bar_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: scale(12),
    backgroundColor: "#008069",
    gap: scale(10),
  },
  top_bar_buttons: {
    flex: 1,
    alignItems: "center",
    borderBottomWidth: 3,
    paddingVertical: verticalScale(10),
    borderColor: "#008069",
  },
  top_bar_titles: {
    fontSize: moderateScale(14),
    fontWeight: "bold",
    color: "#ffffff",
    textTransform: "uppercase",
  },
  header_icons: {
    fontSize: moderateScale(24),
    color: "#ffffff",
  },
  header_title_container: {
    backgroundColor: "#008069",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(15),
    paddingBottom: verticalScale(17),
    paddingTop: verticalScale(10),
  },
  header_icons_container: {
    flexDirection: "row",
    gap: scale(10),
  },
  header_title: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
    color: "#ffffff",
  },
});
