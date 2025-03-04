import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import React from "react";
import ImagePath from "@/src/constants/ImagePath";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const MessageCard = ({
  profile_images,
  users_name,
  message_content,
  message_time,
  message_count,
}: any) => {
  return (
    <TouchableOpacity style={styles.message_card_container} activeOpacity={0.8}>
      <View style={styles.left_container}>
        <Image source={profile_images} style={styles.profile_images} />
        <View>
          <Text style={styles.users_name}>{users_name}</Text>
          <Text style={styles.message_content}>{message_content}</Text>
        </View>
      </View>
      <View style={styles.right_container}>
        <Text style={styles.message_time}>{message_time}</Text>
        {!!message_count && (
          <View style={styles.message_count_container}>
            <Text style={styles.message_count}>{message_count}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default MessageCard;

const styles = StyleSheet.create({
  message_card_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(15),
  },
  profile_images: {
    height: moderateScale(53),
    width: moderateScale(53),
    borderRadius: moderateScale(53),
  },
  users_name: {
    fontSize: moderateScale(14),
    color: "#000000",
    fontWeight: "bold",
  },
  message_content: {
    fontSize: moderateScale(13),
    color: "#889095",
    fontWeight: "500",
  },
  message_time: {
    color: "#998e8e",
    fontWeight: "bold",
  },
  message_count_container: {
    backgroundColor: "#00a884",
    width: moderateScale(22),
    height: moderateScale(22),
    borderRadius: moderateScale(22),
    alignItems: "center",
    justifyContent: "center",
  },
  message_count: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: moderateScale(12),
  },
  left_container: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(10),
  },
  right_container: {
    alignItems: "flex-end",
    gap: verticalScale(7),
  },
});
