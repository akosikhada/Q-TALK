import React from "react";
import { Modal } from "react-native";
import { View, Text, TouchableOpacity } from "../StyledComponents";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type AttachmentOptionsModalProps = {
  visible: boolean;
  onClose: () => void;
  isDarkMode: boolean;
};

const ATTACHMENT_OPTIONS = [
  { id: "camera", icon: "camera", label: "Camera", color: "bg-blue-500" },
  { id: "gallery", icon: "image", label: "Gallery", color: "bg-green-500" },
  { id: "document", icon: "file", label: "Document", color: "bg-purple-500" },
  { id: "location", icon: "map-pin", label: "Location", color: "bg-red-500" },
  { id: "contact", icon: "user", label: "Contact", color: "bg-yellow-500" },
  { id: "audio", icon: "music", label: "Audio", color: "bg-orange-500" },
  { id: "gif", icon: "gift", label: "GIF", color: "bg-pink-500" },
  { id: "voice", icon: "mic", label: "Voice", color: "bg-teal-500" },
];

export const AttachmentOptionsModal: React.FC<AttachmentOptionsModalProps> = ({
  visible,
  onClose,
  isDarkMode,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
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
          } rounded-t-3xl absolute bottom-0 left-0 right-0 p-6`}
          style={{ paddingBottom: insets.bottom + 20 }}
        >
          <View className="w-16 h-1 bg-gray-300 rounded-full self-center mb-6" />

          <Text
            className={`text-lg font-semibold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Share Content
          </Text>

          <View className="flex-row flex-wrap justify-between">
            {ATTACHMENT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                className="items-center w-1/4 mb-6"
                onPress={onClose}
              >
                <View
                  className={`w-12 h-12 rounded-full ${option.color} items-center justify-center mb-2`}
                >
                  <Feather name={option.icon as any} size={24} color="white" />
                </View>
                <Text
                  className={`text-xs ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
