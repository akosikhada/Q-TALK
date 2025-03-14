import React from "react";
import { Modal } from "react-native";
import { View, Text, TouchableOpacity } from "../StyledComponents";
import { Feather } from "@expo/vector-icons";

type HeaderMenuModalProps = {
  visible: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onViewContact: () => void;
  onViewMedia: () => void;
  onSearch: () => void;
  onMuteNotifications: () => void;
  onBlock: () => void;
};

type MenuItem = {
  id: string;
  icon: string;
  label: string;
  color: string;
  onPress: () => void;
  isDestructive?: boolean;
};

export const HeaderMenuModal: React.FC<HeaderMenuModalProps> = ({
  visible,
  onClose,
  isDarkMode,
  onViewContact,
  onViewMedia,
  onSearch,
  onMuteNotifications,
  onBlock,
}) => {
  const menuItems: MenuItem[] = [
    {
      id: "view_contact",
      icon: "user",
      label: "View Contact",
      color: "#1A8D60",
      onPress: onViewContact,
    },
    {
      id: "media",
      icon: "image",
      label: "Media, Links, Docs",
      color: "#1A8D60",
      onPress: onViewMedia,
    },
    {
      id: "search",
      icon: "search",
      label: "Search",
      color: "#1A8D60",
      onPress: onSearch,
    },
    {
      id: "mute",
      icon: "bell-off",
      label: "Mute Notifications",
      color: "#1A8D60",
      onPress: onMuteNotifications,
    },
    {
      id: "block",
      icon: "slash",
      label: "Block",
      color: "#E53935",
      onPress: onBlock,
      isDestructive: true,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          className={`${
            isDarkMode ? "bg-gray-900" : "bg-white"
          } rounded-lg absolute top-20 right-4 shadow-lg`}
          style={{ width: 200 }}
        >
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              className={`flex-row items-center px-4 py-3 ${
                index !== menuItems.length - 1
                  ? `border-b ${
                      isDarkMode ? "border-gray-700" : "border-gray-200"
                    }`
                  : ""
              }`}
              onPress={() => {
                item.onPress();
                onClose();
              }}
            >
              <Feather
                name={item.icon as any}
                size={18}
                color={item.color}
                style={{ marginRight: 12 }}
              />
              <Text
                className={
                  item.isDestructive
                    ? "text-red-500"
                    : isDarkMode
                    ? "text-gray-300"
                    : "text-gray-700"
                }
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
