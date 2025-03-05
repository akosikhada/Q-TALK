import { View, Text, FlatList } from "react-native";
import React from "react";
import MessageCard from "./MessageCard";
import ImagePath from "@/src/constants/ImagePath";

const Chats = () => {
  const mockMessages = [
    {
      profileImage: ImagePath.qTalkLogo,
      userName: "Mark Angelo Gulpe",
      messageContent: "Hello, World!",
      messageTime: "10:01 AM",
      messageCount: "1",
    },
    {
      profileImage: ImagePath.qTalkLogo,
      userName: "Miguel Enrique Dasalla",
      messageContent: "Hello, Motherfucker!",
      messageTime: "10:01 AM",
      messageCount: "2",
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
              messageTime={item?.messageTime}
              messageCount={item?.messageCount}
            />
          );
        }}
      />
    </View>
  );
};

export default Chats;
