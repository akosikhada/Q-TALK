import { View, Text, FlatList, StyleSheet } from "react-native";
import React from "react";
import MessageCard from "./MessageCard";
import ImagePath from "@/src/constants/ImagePath";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { moderateScale } from "react-native-size-matters";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";

const Calls = () => {
  const mockMessages = [
    {
      profileImage: ImagePath.qTalkLogo,
      userName: "Franz Jeremy Señora",
      messageContent: "07 June, 12:00 AM",
      IconComponent: (
        <FontAwesome name="video-camera" style={styles.iconComponent} />
      ),
      ArrowIconComponent: (
        <Feather
          name="arrow-down-left"
          style={(styles.arrowIconComponent, { color: "#FF0000" })}
        />
      ),
    },
    {
      profileImage: ImagePath.qTalkLogo,
      userName: "Miguel Enrique Dasalla",
      messageContent: "23 December, 12:00 AM",
      IconComponent: <Ionicons name="call" style={styles.iconComponent} />,
      ArrowIconComponent: (
        <Feather name="arrow-up-right" style={styles.arrowIconComponent} />
      ),
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={mockMessages}
        renderItem={({ item }) => {
          return (
            <MessageCard
              profileImage={item?.profileImage}
              userName={item?.userName}
              messageContent={item?.messageContent}
              IconComponent={item?.IconComponent}
              ArrowIconComponent={item?.ArrowIconComponent}
            />
          );
        }}
      />
    </View>
  );
};

export default Calls;

const styles = StyleSheet.create({
  iconComponent: {
    color: "#008069",
    fontSize: moderateScale(25),
  },
  arrowIconComponent: {
    fontSize: moderateScale(15),
    color: "#008069",
  },
});
