import React, { useState, useRef, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
} from "../components/StyledComponents";
import {
  FlatList,
  PanResponder,
  Animated,
  GestureResponderEvent,
  PanResponderGestureState,
  Modal,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Feather,
  MaterialIcons,
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { DarkModeWrapper, DarkModeText } from "../components/StyledComponents";

// Define the message type
type Message = {
  id: string;
  text: string;
  time: string;
  isSent: boolean;
  reactions?: string[];
  replyTo?: {
    id: string;
    text: string;
    isSent: boolean;
  };
};

// Mock data for messages
const MOCK_MESSAGES: Message[] = [
  {
    id: "1",
    text: "Hey there! How's it going?",
    time: "10:30 AM",
    isSent: false,
  },
  {
    id: "2",
    text: "I'm doing well, thanks for asking! How about you?",
    time: "10:32 AM",
    isSent: true,
  },
  {
    id: "3",
    text: "Pretty good! Just working on some new features for the app.",
    time: "10:33 AM",
    isSent: false,
  },
  {
    id: "4",
    text: "That sounds interesting! What kind of features?",
    time: "10:35 AM",
    isSent: true,
  },
  {
    id: "5",
    text: "We're adding message reactions and reply functionality. Users have been requesting these for a while!",
    time: "10:36 AM",
    isSent: false,
  },
  {
    id: "6",
    text: "That's awesome! I can't wait to try them out.",
    time: "10:38 AM",
    isSent: true,
  },
  {
    id: "7",
    text: "You'll be able to soon! We're rolling out the update next week.",
    time: "10:40 AM",
    isSent: false,
  },
];

type ChatScreenProps = {
  conversationId: string;
  contactName: string;
  onBack: () => void;
  navigation?: any;
};

const ChatScreen: React.FC<ChatScreenProps> = ({
  conversationId,
  contactName,
  onBack,
  navigation,
}) => {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState("");
  const [showReactions, setShowReactions] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();

  // Animation values for swipe to reply
  const swipeAnim = useRef<{ [key: string]: Animated.Value }>({});

  // Initialize swipe animations for each message
  useEffect(() => {
    messages.forEach((message) => {
      if (!swipeAnim.current[message.id]) {
        swipeAnim.current[message.id] = new Animated.Value(0);
      }
    });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      text: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isSent: true,
      replyTo: replyingTo
        ? {
            id: replyingTo.id,
            text: replyingTo.text,
            isSent: replyingTo.isSent,
          }
        : undefined,
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");
    setReplyingTo(null);
  };

  const toggleReactions = (messageId: string) => {
    if (showReactions === messageId) {
      setShowReactions(null);
    } else {
      setShowReactions(messageId);
    }
  };

  const addReaction = (messageId: string, reaction: string) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              reactions: msg.reactions
                ? [...msg.reactions, reaction]
                : [reaction],
            }
          : msg
      )
    );
    setShowReactions(null);
  };

  const handleReply = (message: Message) => {
    setReplyingTo(message);
    // Scroll to input
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const createPanResponder = (message: Message) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to horizontal movements
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy * 3);
      },
      onPanResponderGrant: () => {
        // Reset animation when touch starts
        swipeAnim.current[message.id].setValue(0);
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow swiping right (positive dx)
        if (gestureState.dx > 0) {
          // Limit the swipe distance
          const swipeDistance = Math.min(gestureState.dx, 100);
          swipeAnim.current[message.id].setValue(swipeDistance);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // If swiped far enough to the right, trigger reply
        if (gestureState.dx > 80) {
          handleReply(message);
        }

        // Animate back to original position
        Animated.spring(swipeAnim.current[message.id], {
          toValue: 0,
          useNativeDriver: true,
          friction: 5,
        }).start();
      },
    });
  };

  // Emoji data for the emoji picker
  const emojiCategories = [
    {
      title: "Smileys & Emotion",
      emojis: [
        "😀",
        "😃",
        "😄",
        "😁",
        "😆",
        "😅",
        "😂",
        "🤣",
        "😊",
        "😇",
        "🙂",
        "🙃",
        "😉",
        "😌",
        "😍",
        "🥰",
        "😘",
      ],
    },
    {
      title: "People & Body",
      emojis: [
        "👍",
        "👎",
        "👌",
        "✌️",
        "🤞",
        "🤟",
        "🤘",
        "🤙",
        "👈",
        "👉",
        "👆",
        "👇",
        "👋",
        "🤚",
        "🖐️",
        "✋",
        "🖖",
      ],
    },
    {
      title: "Animals & Nature",
      emojis: [
        "🐶",
        "🐱",
        "🐭",
        "🐹",
        "🐰",
        "🦊",
        "🐻",
        "🐼",
        "🐨",
        "🐯",
        "🦁",
        "🐮",
        "🐷",
        "🐸",
        "🐵",
        "🐔",
        "🐧",
      ],
    },
    {
      title: "Food & Drink",
      emojis: [
        "🍎",
        "🍐",
        "🍊",
        "🍋",
        "🍌",
        "🍉",
        "🍇",
        "🍓",
        "🍈",
        "🍒",
        "🍑",
        "🥭",
        "🍍",
        "🥥",
        "🥝",
        "🍅",
        "🍆",
      ],
    },
    {
      title: "Travel & Places",
      emojis: [
        "🚗",
        "🚕",
        "🚙",
        "🚌",
        "🚎",
        "🏎️",
        "🚓",
        "🚑",
        "🚒",
        "🚐",
        "🚚",
        "🚛",
        "🚜",
        "🛴",
        "🚲",
        "🛵",
        "🏍️",
      ],
    },
  ];

  const handleInsertEmoji = (emoji: string) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    // Create pan responder for this message if it doesn't exist
    if (!swipeAnim.current[item.id]) {
      swipeAnim.current[item.id] = new Animated.Value(0);
    }

    const panResponder = createPanResponder(item);

    return (
      <View className="mb-4">
        {/* Reply preview if this message is a reply */}
        {item.replyTo && (
          <View
            className={`p-2 rounded-lg max-w-[80%] mb-1 ${
              item.isSent
                ? "self-end mr-2 " +
                  (isDarkMode ? "bg-gray-800" : "bg-gray-200")
                : "self-start ml-2 " +
                  (isDarkMode ? "bg-gray-800" : "bg-gray-100")
            }`}
          >
            <Text
              className={isDarkMode ? "text-gray-400" : "text-text-secondary"}
            >
              {item.replyTo.isSent ? "You" : contactName}
            </Text>
            <Text
              className={isDarkMode ? "text-gray-400" : "text-text-secondary"}
              numberOfLines={1}
            >
              {item.replyTo.text}
            </Text>
          </View>
        )}

        {/* Message bubble with swipe animation */}
        <Animated.View
          {...panResponder.panHandlers}
          style={{
            transform: [{ translateX: swipeAnim.current[item.id] }],
            alignSelf: item.isSent ? "flex-end" : "flex-start",
            maxWidth: "80%",
          }}
        >
          <TouchableOpacity
            onLongPress={() => toggleReactions(item.id)}
            activeOpacity={0.8}
            delayLongPress={200}
          >
            <View
              className={`p-3 rounded-lg ${
                item.isSent
                  ? isDarkMode
                    ? "bg-bubble-sentDark rounded-tr-none"
                    : "bg-bubble-sent rounded-tr-none"
                  : isDarkMode
                  ? "bg-bubble-receivedDark rounded-tl-none"
                  : "bg-bubble-received rounded-tl-none"
              }`}
            >
              <Text
                className={`text-base ${
                  item.isSent
                    ? "text-text-light"
                    : isDarkMode
                    ? "text-text-dark-primary"
                    : "text-text-primary"
                }`}
              >
                {item.text}
              </Text>
              <Text
                className={`text-xs ${
                  item.isSent
                    ? "text-text-light/70"
                    : isDarkMode
                    ? "text-text-dark-secondary"
                    : "text-text-secondary"
                } self-end mt-1`}
              >
                {item.time}
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Reaction buttons */}
        {showReactions === item.id && (
          <View
            className={`flex-row ${
              isDarkMode ? "bg-gray-800" : "bg-background-light"
            } rounded-full p-1 shadow-md mt-2 ${
              item.isSent ? "self-end" : "self-start"
            }`}
          >
            {["❤️", "👍", "😂", "😮", "😢"].map((reaction) => (
              <TouchableOpacity
                key={reaction}
                className="px-2 py-1"
                onPress={() => addReaction(item.id, reaction)}
                activeOpacity={0.7}
              >
                <Text>{reaction}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Reactions display */}
        {item.reactions && item.reactions.length > 0 && (
          <View
            className={`flex-row ${
              isDarkMode ? "bg-gray-800" : "bg-background-light"
            } rounded-full px-2 py-1 shadow-sm mt-1 ${
              item.isSent ? "self-end" : "self-start"
            }`}
          >
            {item.reactions.map((reaction, index) => (
              <Text key={index} className="mr-1">
                {reaction}
              </Text>
            ))}
            <Text
              className={
                isDarkMode
                  ? "text-text-dark-secondary text-xs ml-1"
                  : "text-text-secondary text-xs ml-1"
              }
            >
              {item.reactions.length}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <DarkModeWrapper>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      {/* Header */}
      <View
        className="bg-primary px-4 pb-3 flex-row items-center"
        style={{ paddingTop: insets.top + 10 }}
      >
        <TouchableOpacity onPress={onBack} activeOpacity={0.7} className="mr-3">
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>

        <View className="flex-1 flex-row items-center">
          <View className="relative mr-3">
            <View className="w-10 h-10 bg-gray-200 rounded-full items-center justify-center">
              <Text className="text-gray-500 font-semibold">
                {contactName.charAt(0)}
              </Text>
            </View>
            <View className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-primary" />
          </View>

          <View className="flex-1">
            <Text className="text-text-light font-semibold">{contactName}</Text>
            <Text className="text-text-light/70 text-xs">Online</Text>
          </View>
        </View>

        <View className="flex-row">
          <TouchableOpacity className="ml-4" activeOpacity={0.7}>
            <Feather name="phone" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity className="ml-4" activeOpacity={0.7}>
            <Feather name="video" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            className="ml-4"
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
      />

      {/* Reply Preview */}
      {replyingTo && (
        <View
          className={`flex-row items-center ${
            isDarkMode ? "bg-gray-800" : "bg-gray-100"
          } px-4 py-2 border-t ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <View className="flex-1">
            <View className="flex-row items-center">
              <View className="w-1 h-4 bg-primary rounded-full mr-2" />
              <DarkModeText className="font-medium">
                {replyingTo.isSent ? "You" : contactName}
              </DarkModeText>
            </View>
            <Text
              className={
                isDarkMode ? "text-text-dark-secondary" : "text-text-secondary"
              }
              numberOfLines={1}
            >
              {replyingTo.text}
            </Text>
          </View>
          <TouchableOpacity onPress={cancelReply} activeOpacity={0.7}>
            <Feather
              name="x"
              size={20}
              color={isDarkMode ? "#9AA5B4" : "#9AA5B4"}
            />
          </TouchableOpacity>
        </View>
      )}

      {/* Message Input */}
      <View
        className={`flex-row items-center border-t ${
          isDarkMode
            ? "border-gray-700 bg-gray-900"
            : "border-gray-200 bg-background-light"
        } px-4 py-2`}
        style={{ paddingBottom: insets.bottom > 0 ? insets.bottom : 8 }}
      >
        <TouchableOpacity
          className="mr-3"
          activeOpacity={0.7}
          onPress={() => setShowAttachmentOptions(true)}
        >
          <Feather
            name="plus"
            size={24}
            color={isDarkMode ? "#9AA5B4" : "#9AA5B4"}
          />
        </TouchableOpacity>

        <View
          className={`flex-1 flex-row items-center ${
            isDarkMode ? "bg-gray-800" : "bg-gray-100"
          } rounded-full px-4 py-2 mr-2`}
        >
          <TextInput
            className={
              isDarkMode ? "flex-1 text-white" : "flex-1 text-text-primary"
            }
            placeholder="Type a message..."
            placeholderTextColor={isDarkMode ? "#9AA5B4" : "#9AA5B4"}
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
          />
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowEmojiPicker(true)}
          >
            <Feather name="smile" size={20} color="#9AA5B4" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className={`w-10 h-10 rounded-full items-center justify-center ${
            newMessage.trim() ? "bg-primary" : "bg-gray-300"
          }`}
          onPress={handleSend}
          disabled={!newMessage.trim()}
          activeOpacity={0.7}
        >
          <Feather name="send" size={18} color="white" />
        </TouchableOpacity>
      </View>

      {/* Attachment Options Modal */}
      <Modal
        visible={showAttachmentOptions}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAttachmentOptions(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
          activeOpacity={1}
          onPress={() => setShowAttachmentOptions(false)}
        >
          <View
            className={`${
              isDarkMode ? "bg-gray-900" : "bg-background-light"
            } rounded-t-3xl absolute bottom-0 left-0 right-0 p-6`}
            style={{ paddingBottom: insets.bottom + 20 }}
          >
            <View className="w-16 h-1 bg-gray-300 rounded-full self-center mb-6" />

            <DarkModeText className="text-lg font-semibold mb-4">
              Share Content
            </DarkModeText>

            <View className="flex-row flex-wrap justify-between">
              <TouchableOpacity
                className="items-center w-1/4 mb-6"
                onPress={() => setShowAttachmentOptions(false)}
              >
                <View className="w-12 h-12 rounded-full bg-blue-500 items-center justify-center mb-2">
                  <Feather name="camera" size={24} color="white" />
                </View>
                <Text className="text-text-secondary text-xs">Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="items-center w-1/4 mb-6"
                onPress={() => setShowAttachmentOptions(false)}
              >
                <View className="w-12 h-12 rounded-full bg-green-500 items-center justify-center mb-2">
                  <Feather name="image" size={24} color="white" />
                </View>
                <Text className="text-text-secondary text-xs">Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="items-center w-1/4 mb-6"
                onPress={() => setShowAttachmentOptions(false)}
              >
                <View className="w-12 h-12 rounded-full bg-purple-500 items-center justify-center mb-2">
                  <Feather name="file" size={24} color="white" />
                </View>
                <Text className="text-text-secondary text-xs">Document</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="items-center w-1/4 mb-6"
                onPress={() => setShowAttachmentOptions(false)}
              >
                <View className="w-12 h-12 rounded-full bg-red-500 items-center justify-center mb-2">
                  <Feather name="map-pin" size={24} color="white" />
                </View>
                <Text className="text-text-secondary text-xs">Location</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="items-center w-1/4 mb-6"
                onPress={() => setShowAttachmentOptions(false)}
              >
                <View className="w-12 h-12 rounded-full bg-yellow-500 items-center justify-center mb-2">
                  <Feather name="user" size={24} color="white" />
                </View>
                <Text className="text-text-secondary text-xs">Contact</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="items-center w-1/4 mb-6"
                onPress={() => setShowAttachmentOptions(false)}
              >
                <View className="w-12 h-12 rounded-full bg-orange-500 items-center justify-center mb-2">
                  <Feather name="music" size={24} color="white" />
                </View>
                <Text className="text-text-secondary text-xs">Audio</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="items-center w-1/4 mb-6"
                onPress={() => setShowAttachmentOptions(false)}
              >
                <View className="w-12 h-12 rounded-full bg-pink-500 items-center justify-center mb-2">
                  <Feather name="gift" size={24} color="white" />
                </View>
                <Text className="text-text-secondary text-xs">GIF</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="items-center w-1/4 mb-6"
                onPress={() => setShowAttachmentOptions(false)}
              >
                <View className="w-12 h-12 rounded-full bg-teal-500 items-center justify-center mb-2">
                  <Feather name="mic" size={24} color="white" />
                </View>
                <Text className="text-text-secondary text-xs">Voice</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Emoji Picker Modal */}
      <Modal
        visible={showEmojiPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEmojiPicker(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
          activeOpacity={1}
          onPress={() => setShowEmojiPicker(false)}
        >
          <View
            className={`${
              isDarkMode ? "bg-gray-900" : "bg-background-light"
            } rounded-t-3xl absolute bottom-0 left-0 right-0 p-4`}
            style={{ height: "50%", paddingBottom: insets.bottom + 20 }}
          >
            <View className="w-16 h-1 bg-gray-300 rounded-full self-center mb-4" />

            <DarkModeText className="text-lg font-semibold mb-2">
              Emojis
            </DarkModeText>

            <ScrollView>
              {emojiCategories.map((category, index) => (
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
                    {category.emojis.map((emoji, emojiIndex) => (
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
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Header Menu Modal */}
      <Modal
        visible={showHeaderMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowHeaderMenu(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
          activeOpacity={1}
          onPress={() => setShowHeaderMenu(false)}
        >
          <View
            className={`${
              isDarkMode ? "bg-gray-900" : "bg-background-light"
            } rounded-lg absolute top-20 right-4 shadow-lg`}
            style={{ width: 200 }}
          >
            <TouchableOpacity
              className={`flex-row items-center px-4 py-3 border-b ${
                isDarkMode ? "border-gray-700" : "border-gray-200"
              }`}
              onPress={() => {
                setShowHeaderMenu(false);
                // Handle view contact
              }}
            >
              <Feather name="user" size={18} color="#1A8D60" className="mr-3" />
              <DarkModeText>View Contact</DarkModeText>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-row items-center px-4 py-3 border-b ${
                isDarkMode ? "border-gray-700" : "border-gray-200"
              }`}
              onPress={() => {
                setShowHeaderMenu(false);
                // Handle media, links, docs
              }}
            >
              <Feather
                name="image"
                size={18}
                color="#1A8D60"
                className="mr-3"
              />
              <DarkModeText>Media, Links, Docs</DarkModeText>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-row items-center px-4 py-3 border-b ${
                isDarkMode ? "border-gray-700" : "border-gray-200"
              }`}
              onPress={() => {
                setShowHeaderMenu(false);
                // Handle search
              }}
            >
              <Feather
                name="search"
                size={18}
                color="#1A8D60"
                className="mr-3"
              />
              <DarkModeText>Search</DarkModeText>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-row items-center px-4 py-3 border-b ${
                isDarkMode ? "border-gray-700" : "border-gray-200"
              }`}
              onPress={() => {
                setShowHeaderMenu(false);
                // Handle mute notifications
              }}
            >
              <Feather
                name="bell-off"
                size={18}
                color="#1A8D60"
                className="mr-3"
              />
              <DarkModeText>Mute Notifications</DarkModeText>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center px-4 py-3"
              onPress={() => {
                setShowHeaderMenu(false);
                // Handle block
              }}
            >
              <Feather
                name="slash"
                size={18}
                color="#E53935"
                className="mr-3"
              />
              <Text className="text-red-500">Block</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </DarkModeWrapper>
  );
};

export default ChatScreen;
