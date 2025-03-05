import { View, Text, FlatList, StyleSheet } from "react-native";
import React from "react";
import MessageCard from "./MessageCard";
import ImagePath from "@/src/constants/ImagePath";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import Ionicons from "@expo/vector-icons/Ionicons";

const Status = () => {
  const mockMessages = [
    {
      profileImage: ImagePath.qTalkLogo,
      userName: "Franz Jeremy Señora",
      messageContent: "5 minutes ago",
    },
    {
      profileImage: ImagePath.qTalkLogo,
      userName: "Miguel Enrique Dasalla",
      messageContent: "20 minutes ago",
    },
  ];

  return (
    <View style={{ flex: 1, gap: 5 }}>
      <MessageCard
        userName="Mark Angelo Gulpe"
        messageContent={"Tap to add status update"}
        profileImage={ImagePath.qTalkLogo}
        LogoComponent={
          <View style={styles.logoComponentContainer}>
            <Ionicons
              name="add-outline"
              size={moderateScale(20)}
              color="#000000"
            />
          </View>
        }
      />
      <FlatList
        data={mockMessages}
        renderItem={({ item }) => {
          return (
            <MessageCard
              profileImage={item?.profileImage}
              userName={item?.userName}
              messageContent={item?.messageContent}
            />
          );
        }}
      />
    </View>
  );
};

export default Status;

const styles = StyleSheet.create({
  logoComponentContainer: {
    width: moderateScale(25),
    height: moderateScale(25),
    borderRadius: moderateScale(50),
    backgroundColor: "#008069",
    position: "absolute",
    bottom: verticalScale(-5),
    right: scale(-5),
    borderWidth: 2,
    borderColor: "#000000",
  },
});
