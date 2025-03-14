import React, { useState, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
} from "../components/StyledComponents";
import { FlatList, Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { DarkModeWrapper } from "../components/StyledComponents";
import { Message } from "../types/chat";
import { useChat } from "../hooks/useChat";
import { MOCK_MESSAGES, EMOJI_CATEGORIES } from "../utils/mockData";
import {
  AttachmentOptionsModal,
  EmojiPickerModal,
  HeaderMenuModal,
} from "../components/chat";

type ChatScreenProps = {
  conversationId: string;
  contactName: string;
  onBack: () => void;
  navigation?: any;
};

type EmojiCategory = {
  title: string;
  emojis: string[];
};

const ChatScreen: React.FC<ChatScreenProps> = ({
  conversationId,
  contactName,
  onBack,
  navigation,
}) => {
  const {
    messages,
    replyingTo,
    showReactions,
    swipeAnim,
    handleSend,
    toggleReactions,
    addReaction,
    handleReply,
    cancelReply,
    createPanResponder,
  } = useChat(MOCK_MESSAGES);

  const [newMessage, setNewMessage] = useState("");
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();

  const handleSendMessage = () => {
    handleSend(newMessage);
    setNewMessage("");
  };

  const handleInsertEmoji = (emoji: string) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View className="mb-3">
      {item.replyTo && (
        <View
          className={`p-2 rounded-lg max-w-[75%] mb-1 ${
            item.isSent
              ? "self-end mr-2 bg-opacity-10 " +
                (isDarkMode ? "bg-gray-600" : "bg-gray-300")
              : "self-start ml-2 bg-opacity-10 " +
                (isDarkMode ? "bg-gray-600" : "bg-gray-300")
          }`}
        >
          <View className="flex-row items-center mb-1">
            <View className="w-0.5 h-3 bg-primary rounded-full mr-2" />
            <Text
              className={`text-xs font-medium ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {item.replyTo.isSent ? "You" : contactName}
            </Text>
          </View>
          <Text
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
            numberOfLines={1}
          >
            {item.replyTo.text}
          </Text>
        </View>
      )}

      <Animated.View
        {...createPanResponder(item).panHandlers}
        style={{
          transform: [
            { translateX: swipeAnim[item.id] || new Animated.Value(0) },
          ],
          alignSelf: item.isSent ? "flex-end" : "flex-start",
          maxWidth: "75%",
          width: "auto",
          flexDirection: item.isSent ? "row-reverse" : "row",
        }}
      >
        <View
          className={`p-3 rounded-2xl flex-1 shadow-sm ${
            item.isSent
              ? isDarkMode
                ? "bg-primary rounded-tr-none"
                : "bg-primary rounded-tr-none"
              : isDarkMode
              ? "bg-gray-800 rounded-tl-none"
              : "bg-white rounded-tl-none"
          }`}
        >
          <TouchableOpacity
            onLongPress={() => toggleReactions(item.id)}
            activeOpacity={1}
            delayLongPress={200}
          >
            <Text
              className={`text-[15px] leading-[20px] ${
                item.isSent
                  ? "text-white"
                  : isDarkMode
                  ? "text-gray-100"
                  : "text-gray-800"
              }`}
            >
              {item.text}
            </Text>
            <Text
              className={`text-xs mt-1 ${
                item.isSent
                  ? "text-white/70"
                  : isDarkMode
                  ? "text-gray-400"
                  : "text-gray-500"
              } self-end`}
            >
              {item.time}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {showReactions === item.id && (
        <View
          className={`flex-row items-center ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } rounded-full py-1.5 px-2 shadow-lg mt-2 ${
            item.isSent ? "self-end" : "self-start"
          }`}
        >
          {["❤️", "👍", "😂", "😮", "😢"].map((reaction: string) => (
            <TouchableOpacity
              key={reaction}
              className="px-2.5 py-1"
              onPress={() => addReaction(item.id, reaction)}
              activeOpacity={0.7}
            >
              <Text className="text-lg">{reaction}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {item.reactions && item.reactions.length > 0 && (
        <View
          className={`flex-row items-center ${
            isDarkMode ? "bg-gray-800/80" : "bg-white/90"
          } rounded-full px-2 py-1 shadow-sm mt-1 ${
            item.isSent ? "self-end" : "self-start"
          }`}
        >
          {item.reactions.map((reaction: string, index: number) => (
            <Text key={index} className="mr-0.5 text-sm">
              {reaction}
            </Text>
          ))}
          <Text
            className={`text-xs ml-1 ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {item.reactions.length}
          </Text>
        </View>
      )}
    </View>
  );

  const renderEmojiCategory = (category: EmojiCategory, index: number) => (
    <View key={index} className="mb-4">
      <Text
        className={
          isDarkMode
            ? "text-text-dark-secondary font-medium mb-2"
            : "text-text-secondary font-medium mb-2"
        }
      >
        {category.title}
      </Text>
      <View className="flex-row flex-wrap">
        {category.emojis.map((emoji: string, emojiIndex: number) => (
          <TouchableOpacity
            key={emojiIndex}
            className="p-2"
            onPress={() => handleInsertEmoji(emoji)}
          >
            <Text className="text-2xl">{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <DarkModeWrapper>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      {/* Header */}
      <View
        className={`bg-primary shadow-md px-4 pb-3 flex-row items-center ${
          isDarkMode ? "" : "shadow-black/5"
        }`}
        style={{ paddingTop: insets.top + 10 }}
      >
        <TouchableOpacity
          onPress={onBack}
          activeOpacity={0.7}
          className="mr-3 p-1"
        >
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>

        <View className="flex-1 flex-row items-center">
          <View className="relative mr-3">
            <View className="w-10 h-10 bg-white/10 rounded-full items-center justify-center">
              <Text className="text-white font-semibold text-lg">
                {contactName.charAt(0)}
              </Text>
            </View>
            <View className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-primary" />
          </View>

          <View className="flex-1">
            <Text className="text-white font-semibold text-base">
              {contactName}
            </Text>
            <Text className="text-white/70 text-xs font-medium">Online</Text>
          </View>
        </View>

        <View className="flex-row items-center">
          <TouchableOpacity className="p-2" activeOpacity={0.7}>
            <Feather name="phone" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity className="p-2 mx-1" activeOpacity={0.7}>
            <Feather name="video" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            className="p-2"
            activeOpacity={0.7}
            onPress={() => setShowHeaderMenu(true)}
          >
            <Feather name="more-vertical" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + 80,
        }}
        inverted={false}
        showsVerticalScrollIndicator={false}
      />

      {/* Reply Preview */}
      {replyingTo && (
        <View
          className={`flex-row items-center justify-between ${
            isDarkMode ? "bg-gray-800/95" : "bg-gray-50/95"
          } px-4 py-3 border-t ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.05,
            shadowRadius: 3,
            elevation: 3,
          }}
        >
          <View className="flex-row items-center flex-1 mr-3">
            <View className="w-1 h-4 bg-primary rounded-full mr-2" />
            <View className="flex-1">
              <Text
                className={`text-xs font-medium mb-0.5 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {replyingTo.isSent ? "You" : contactName}
              </Text>
              <Text
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
                numberOfLines={1}
              >
                {replyingTo.text}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={cancelReply}
            activeOpacity={0.7}
            className="p-2 -mr-2"
          >
            <Feather
              name="x"
              size={20}
              color={isDarkMode ? "#9AA5B4" : "#64748B"}
            />
          </TouchableOpacity>
        </View>
      )}

      {/* Message Input */}
      <View
        className={`flex-row items-end border-t ${
          isDarkMode
            ? "border-gray-800 bg-gray-900"
            : "border-gray-100 bg-white"
        } px-4 py-2`}
        style={{
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 3,
        }}
      >
        <TouchableOpacity
          className="mr-2 p-2"
          activeOpacity={0.7}
          onPress={() => setShowAttachmentOptions(true)}
        >
          <Feather
            name="plus-circle"
            size={24}
            color={isDarkMode ? "#9AA5B4" : "#64748B"}
          />
        </TouchableOpacity>

        <View
          className={`flex-1 flex-row items-end ${
            isDarkMode ? "bg-gray-800" : "bg-gray-100"
          } rounded-2xl px-3 py-2 mr-2 min-h-[40px] max-h-[120px]`}
        >
          <TextInput
            className={`flex-1 mr-2 ${
              isDarkMode ? "text-white" : "text-gray-800"
            } text-base leading-[22px]`}
            placeholder="Type a message..."
            placeholderTextColor={isDarkMode ? "#9AA5B4" : "#94A3B8"}
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            style={{ paddingTop: 0, paddingBottom: 0 }}
          />
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowEmojiPicker(true)}
            className="pb-0.5"
          >
            <Feather
              name="smile"
              size={22}
              color={isDarkMode ? "#9AA5B4" : "#64748B"}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className={`w-10 h-10 rounded-full items-center justify-center ${
            newMessage.trim()
              ? "bg-primary"
              : isDarkMode
              ? "bg-gray-700"
              : "bg-gray-200"
          }`}
          onPress={handleSendMessage}
          disabled={!newMessage.trim()}
          activeOpacity={0.7}
        >
          <Feather
            name="send"
            size={18}
            color={
              newMessage.trim() ? "white" : isDarkMode ? "#9AA5B4" : "#94A3B8"
            }
          />
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <AttachmentOptionsModal
        visible={showAttachmentOptions}
        onClose={() => setShowAttachmentOptions(false)}
        isDarkMode={isDarkMode}
      />

      <EmojiPickerModal
        visible={showEmojiPicker}
        onClose={() => setShowEmojiPicker(false)}
        onEmojiSelect={handleInsertEmoji}
        isDarkMode={isDarkMode}
        categories={EMOJI_CATEGORIES}
      />

      <HeaderMenuModal
        visible={showHeaderMenu}
        onClose={() => setShowHeaderMenu(false)}
        isDarkMode={isDarkMode}
        onViewContact={() => {
          setShowHeaderMenu(false);
          // Handle view contact
        }}
        onViewMedia={() => {
          setShowHeaderMenu(false);
          // Handle media, links, docs
        }}
        onSearch={() => {
          setShowHeaderMenu(false);
          // Handle search
        }}
        onMuteNotifications={() => {
          setShowHeaderMenu(false);
          // Handle mute notifications
        }}
        onBlock={() => {
          setShowHeaderMenu(false);
          // Handle block
        }}
      />
    </DarkModeWrapper>
  );
};

export default ChatScreen;
