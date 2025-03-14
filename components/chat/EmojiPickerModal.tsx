import React from "react";
import { Modal, ScrollView } from "react-native";
import { View, Text, TouchableOpacity } from "../StyledComponents";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type EmojiCategory = {
  title: string;
  emojis: string[];
};

type EmojiPickerModalProps = {
  visible: boolean;
  onClose: () => void;
  onEmojiSelect: (emoji: string) => void;
  isDarkMode: boolean;
  categories: EmojiCategory[];
};

export const EmojiPickerModal: React.FC<EmojiPickerModalProps> = ({
  visible,
  onClose,
  onEmojiSelect,
  isDarkMode,
  categories,
}) => {
  const insets = useSafeAreaInsets();

  const renderEmojiCategory = (category: EmojiCategory, index: number) => (
    <View key={index} className="mb-4">
      <Text
        className={`font-medium mb-2 ${
          isDarkMode ? "text-gray-400" : "text-gray-600"
        }`}
      >
        {category.title}
      </Text>
      <View className="flex-row flex-wrap">
        {category.emojis.map((emoji: string, emojiIndex: number) => (
          <TouchableOpacity
            key={emojiIndex}
            className="p-2"
            onPress={() => onEmojiSelect(emoji)}
          >
            <Text className="text-2xl">{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

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
          } rounded-t-3xl absolute bottom-0 left-0 right-0 p-4`}
          style={{ height: "50%", paddingBottom: insets.bottom + 20 }}
        >
          <View className="w-16 h-1 bg-gray-300 rounded-full self-center mb-4" />

          <Text
            className={`text-lg font-semibold mb-2 ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Emojis
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {categories.map(renderEmojiCategory)}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
