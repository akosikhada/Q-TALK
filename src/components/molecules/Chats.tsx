import { View, Text, FlatList } from "react-native";
import React from "react";
import MessageCard from "./MessageCard";
import ImagePath from "@/src/constants/ImagePath";

const Chats = () => {
  const messages_data_mock_up = [
    {
      profile_images: ImagePath.q_talk_logo,
      users_name: "Mark Angelo Gulpe",
      message_content: "Hello, World!",
      message_time: "10:01 AM",
      message_count: "1",
    },
    {
      profile_images: ImagePath.q_talk_logo,
      users_name: "Miguel Enrique Dasalla",
      message_content: "Hello, Motherfucker!",
      message_time: "10:01 AM",
      message_count: "2",
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={messages_data_mock_up}
        renderItem={({ item }) => {
          return (
            <MessageCard
              profile_images={item.profile_images}
              users_name={item.users_name}
              message_content={item.message_content}
              message_time={item.message_time}
              message_count={item.message_count}
            />
          );
        }}
      />
    </View>
  );
};

export default Chats;
