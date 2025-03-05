import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import React from "react";
import ImagePath from "@/src/constants/ImagePath";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const MessageCard = ({
  profileImage,
  userName,
  messageContent,
  messageTime,
  messageCount,
  LogoComponent,
  IconComponent,
  ArrowIconComponent,
}: any) => {
  return (
    <TouchableOpacity style={styles.messageCardContainer} activeOpacity={0.8}>
      <View style={styles.leftContainer}>
        <View>
          <Image source={profileImage} style={styles.profileImage} />
          {LogoComponent}
        </View>
        <View>
          <Text style={styles.userName}>{userName}</Text>
          <View style={styles.messageContentContainer}>
            {ArrowIconComponent}
            <Text style={styles.messageContent}>{messageContent}</Text>
          </View>
        </View>
      </View>
      <View style={styles.rightContainer}>
        {messageTime && <Text style={styles.messageTime}>{messageTime}</Text>}
        {!!messageCount && (
          <View style={styles.messageCountContainer}>
            <Text style={styles.messageCount}>{messageCount}</Text>
          </View>
        )}
        {IconComponent}
      </View>
    </TouchableOpacity>
  );
};

export default MessageCard;

const styles = StyleSheet.create({
  messageCardContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(15),
  },
  profileImage: {
    height: moderateScale(53),
    width: moderateScale(53),
    borderRadius: moderateScale(53),
  },
  userName: {
    fontSize: moderateScale(14),
    color: "#000000",
    fontWeight: "bold",
  },
  messageContent: {
    fontSize: moderateScale(13),
    color: "#889095",
    fontWeight: "500",
  },
  messageTime: {
    color: "#998e8e",
    fontWeight: "bold",
  },
  messageCountContainer: {
    backgroundColor: "#00a884",
    width: moderateScale(22),
    height: moderateScale(22),
    borderRadius: moderateScale(22),
    alignItems: "center",
    justifyContent: "center",
  },
  messageCount: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: moderateScale(12),
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(10),
  },
  rightContainer: {
    alignItems: "flex-end",
    gap: verticalScale(7),
  },
  messageContentContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(7),
  },
});
