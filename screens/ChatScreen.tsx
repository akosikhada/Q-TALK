  import React, { useState, useRef, useEffect } from "react";
  import { StatusBar } from "expo-status-bar";
  import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Image,
    KeyboardAvoidingView,
    ScrollView,
  } from "../components/StyledComponents";
  import {
    FlatList,
    Animated,
    Platform,
    Keyboard,
    Dimensions,
    Easing,
  } from "react-native";
  import { useSafeAreaInsets } from "react-native-safe-area-context";
  import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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

  import { fetchMessages, saveMessage } from "../services/DatabaseService";

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

  const { width: SCREEN_WIDTH } = Dimensions.get("window");

  const ChatScreen: React.FC<ChatScreenProps> = ({
    conversationId,
    contactName,
    onBack,
    navigation,
  }) => {
    const {
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
    const [isTyping, setIsTyping] = useState(false);
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const flatListRef = useRef<FlatList>(null);
    const insets = useSafeAreaInsets();
    const { isDarkMode } = useTheme();
    const [messages, setMessages] = useState<Message[]>([]);

    // Animation values for typing indicator
    const typingAnim1 = useRef(new Animated.Value(0)).current;
    const typingAnim2 = useRef(new Animated.Value(0)).current;
    const typingAnim3 = useRef(new Animated.Value(0)).current;

    // Simulate typing indicator
    useEffect(() => {
      const typingInterval = setInterval(() => {
        setIsTyping(Math.random() > 0.7);
      }, 5000);

      return () => clearInterval(typingInterval);
    }, []);

    useEffect(() => {
      const loadMessages = () => {
        fetchMessages(conversationId, (fetchedMessages) => {
          setMessages(fetchedMessages);
        });
      };
      
      loadMessages();
    }, [conversationId]);

    // Animate typing indicator dots
    useEffect(() => {
      if (isTyping) {
        const animateDot = (animValue: Animated.Value, delay: number) => {
          Animated.loop(
            Animated.sequence([
              Animated.timing(animValue, {
                toValue: 1,
                duration: 400,
                delay,
                easing: Easing.ease,
                useNativeDriver: true,
              }),
              Animated.timing(animValue, {
                toValue: 0,
                duration: 400,
                easing: Easing.ease,
                useNativeDriver: true,
              }),
            ])
          ).start();
        };

        animateDot(typingAnim1, 0);
        animateDot(typingAnim2, 200);
        animateDot(typingAnim3, 400);
      } else {
        // Stop animations when not typing
        typingAnim1.setValue(0);
        typingAnim2.setValue(0);
        typingAnim3.setValue(0);
      }
    }, [isTyping, typingAnim1, typingAnim2, typingAnim3]);

    // Keyboard listeners
    useEffect(() => {
      const keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        () => {
          setKeyboardVisible(true);
          scrollToBottom();
        }
      );
      const keyboardDidHideListener = Keyboard.addListener(
        "keyboardDidHide",
        () => {
          setKeyboardVisible(false);
        }
      );

      return () => {
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
      };
    }, []);

    const scrollToBottom = () => {
      if (flatListRef.current && messages.length > 0) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    };

    const handleSendMessage = () => {
      if (newMessage.trim()) {
        const newMessageObj = {
          text: newMessage,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSent: true,
        };
        
        // Save to Firebase
        saveMessage(conversationId, newMessageObj)
          .then((success) => {
            if (!success) {
              console.error("Failed to save message to database");
            }
          });
        
        setNewMessage("");
        
        setTimeout(scrollToBottom, 100);
      }
    };

    const handleInsertEmoji = (emoji: string) => {
      setNewMessage((prev) => prev + emoji);
    };

    // Format timestamp to show date if message is from a different day
    const formatMessageDate = (timestamp: string | Date) => {
      try {
        const date = new Date(timestamp);

        // Check if date is valid
        if (isNaN(date.getTime())) {
          return "Today"; // Default to Today if date is invalid
        }

        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
          return "Today";
        } else if (date.toDateString() === yesterday.toDateString()) {
          return "Yesterday";
        } else {
          return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
        }
      } catch (error) {
        console.log("Error formatting date:", error);
        return "Today"; // Default to Today if there's an error
      }
    };

    // Group messages by date
    const groupedMessages = messages.reduce((groups, message) => {
      // Use message.time instead of timestamp since timestamp doesn't exist in Message type
      const date = formatMessageDate(message.time || new Date().toString());
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    }, {} as Record<string, Message[]>);

    // Convert grouped messages to array for FlatList
    const messageGroups = Object.keys(groupedMessages).map((date) => ({
      date,
      data: groupedMessages[date],
    }));

    const renderDateSeparator = (date: string) => (
      <View className="flex-row items-center justify-center my-4">
        <View className="flex-1 h-[1px] bg-gray-300 dark:bg-gray-700 opacity-50" />
        <View className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 mx-2">
          <Text
            className={`text-xs font-medium ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {date}
          </Text>
        </View>
        <View className="flex-1 h-[1px] bg-gray-300 dark:bg-gray-700 opacity-50" />
      </View>
    );

    const renderMessage = ({
      item,
      index,
      section,
    }: {
      item: Message;
      index: number;
      section: any;
    }) => {
      // Check if this is the first message from this sender in a sequence
      const isFirstInSequence =
        index === 0 || section.data[index - 1].isSent !== item.isSent;

      // Check if this is the last message from this sender in a sequence
      const isLastInSequence =
        index === section.data.length - 1 ||
        section.data[index + 1].isSent !== item.isSent;

      // Determine bubble shape based on position in sequence
      let bubbleShape = "";
      if (item.isSent) {
        if (isFirstInSequence && isLastInSequence) {
          bubbleShape = "rounded-2xl rounded-tr-md";
        } else if (isFirstInSequence) {
          bubbleShape = "rounded-2xl rounded-br-md rounded-tr-md";
        } else if (isLastInSequence) {
          bubbleShape = "rounded-2xl rounded-tr-md";
        } else {
          bubbleShape = "rounded-2xl rounded-tr-md rounded-br-md";
        }
      } else {
        if (isFirstInSequence && isLastInSequence) {
          bubbleShape = "rounded-2xl rounded-tl-md";
        } else if (isFirstInSequence) {
          bubbleShape = "rounded-2xl rounded-bl-md rounded-tl-md";
        } else if (isLastInSequence) {
          bubbleShape = "rounded-2xl rounded-tl-md";
        } else {
          bubbleShape = "rounded-2xl rounded-tl-md rounded-bl-md";
        }
      }

      return (
        <View className={`mb-1 ${isLastInSequence ? "mb-3" : ""}`}>
          {item.replyTo && (
            <View
              className={`p-2 rounded-lg max-w-[80%] mb-1 ${
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

          <View
            className={`flex-row ${
              item.isSent ? "justify-end" : "justify-start"
            }`}
          >
            <Animated.View
              {...createPanResponder(item).panHandlers}
              style={{
                transform: [
                  { translateX: swipeAnim[item.id] || new Animated.Value(0) },
                ],
                alignSelf: item.isSent ? "flex-end" : "flex-start",
                maxWidth: "80%",
                marginLeft: 0, // Removed the conditional margin that was based on the profile icon
              }}
            >
              <View
                className={`p-3 ${bubbleShape} shadow-sm ${
                  item.isSent
                    ? isDarkMode
                      ? "bg-primary"
                      : "bg-primary"
                    : isDarkMode
                    ? "bg-gray-800"
                    : "bg-white"
                }`}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  elevation: 2,
                }}
              >
                <TouchableOpacity
                  onLongPress={() => toggleReactions(item.id)}
                  activeOpacity={1}
                  delayLongPress={200}
                >
                  <Text
                    className={`text-[15px] leading-[22px] ${
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
                    {item.isSent && (
                      <Text className="ml-1">
                        {" "}
                        <Ionicons
                          name="checkmark-done"
                          size={12}
                          color={
                            item.isSent
                              ? isDarkMode
                                ? "#FFFFFF99"
                                : "#FFFFFFCC"
                              : "#9AA5B4"
                          }
                        />
                      </Text>
                    )}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>

        {showReactions === item.id && (
          <View
            className={`flex-row items-center ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-full py-1.5 px-2 shadow-lg mt-2 ${
              item.isSent ? "self-end" : "self-start ml-10"
            }`}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            {["❤️", "👍", "😂", "😮", "😢", "🎉"].map((reaction: string) => (
              <TouchableOpacity
                key={`${item.id}-reaction-${reaction}`}
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
              item.isSent ? "self-end" : "self-start ml-10"
            }`}
          >
            {item.reactions.map((reaction: string, reactionIndex: number) => (
              <Text
                key={`${item.id}-reaction-display-${reactionIndex}`}
                className="mr-0.5 text-sm"
              >
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
  };

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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <DarkModeWrapper>
        <StatusBar style={isDarkMode ? "light" : "dark"} />

        {/* Header */}
        <View
          style={{
            paddingTop: insets.top,
            backgroundColor: isDarkMode ? "#25BE80" : "#1A8D60",
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
            zIndex: 10,
          }}
        >
          <View className="flex-row items-center px-4 py-3">
            <TouchableOpacity
              onPress={onBack}
              activeOpacity={0.7}
              className="mr-3 p-1"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                borderRadius: 20,
                width: 36,
                height: 36,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Feather name="arrow-left" size={20} color="white" />
            </TouchableOpacity>

            <View className="flex-1 flex-row items-center">
              <View className="relative mr-3">
                <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center overflow-hidden">
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
                <Text className="text-white/70 text-xs font-medium">
                  {isTyping ? "Typing..." : "Online"}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <TouchableOpacity
                className="p-2 mx-1"
                activeOpacity={0.7}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: 20,
                  width: 36,
                  height: 36,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Feather name="phone" size={18} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                className="p-2 mx-1"
                activeOpacity={0.7}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: 20,
                  width: 36,
                  height: 36,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Feather name="video" size={18} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                className="p-2 ml-1"
                activeOpacity={0.7}
                onPress={() => setShowHeaderMenu(true)}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: 20,
                  width: 36,
                  height: 36,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Feather name="more-vertical" size={18} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Messages */}
        <View
          style={{
            flex: 1,
            backgroundColor: isDarkMode ? "#121A29" : "#F5F7FA",
          }}
        >
          <FlatList
            ref={flatListRef}
            data={messageGroups}
            keyExtractor={(item) => item.date}
            renderItem={({
              item,
            }: {
              item: { date: string; data: Message[] };
            }) => {
              return (
                <View key={`message-group-${item.date}`}>
                  {renderDateSeparator(item.date)}
                  {item.data.map((message: Message, index: number) => (
                    <React.Fragment key={`message-${message.id}`}>
                      {renderMessage({
                        item: message,
                        index,
                        section: { data: item.data },
                      })}
                    </React.Fragment>
                  ))}
                </View>
              );
            }}
            contentContainerStyle={{
              padding: 16,
              paddingBottom: insets.bottom + 100,
            }}
            onContentSizeChange={scrollToBottom}
            onLayout={scrollToBottom}
            showsVerticalScrollIndicator={false}
          />

          {/* Typing indicator */}
          {isTyping && (
            <View
              className="absolute bottom-2 left-4"
              style={{
                zIndex: 5,
                opacity: 0.9,
              }}
            >
              <View
                className={`flex-row items-center p-2 rounded-full ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  elevation: 2,
                }}
              >
                <View className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full items-center justify-center mr-2">
                  <Text className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                    {contactName.charAt(0)}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Animated.View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: isDarkMode ? "#9AA5B4" : "#64748B",
                      transform: [
                        {
                          translateY: typingAnim1.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -4],
                          }),
                        },
                      ],
                    }}
                  />
                  <Animated.View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: isDarkMode ? "#9AA5B4" : "#64748B",
                      marginHorizontal: 4,
                      transform: [
                        {
                          translateY: typingAnim2.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -4],
                          }),
                        },
                      ],
                    }}
                  />
                  <Animated.View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: isDarkMode ? "#9AA5B4" : "#64748B",
                      transform: [
                        {
                          translateY: typingAnim3.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -4],
                          }),
                        },
                      ],
                    }}
                  />
                </View>
              </View>
            </View>
          )}
        </View>

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
              <View className="w-1 h-full bg-primary rounded-full mr-2" />
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
              style={{
                backgroundColor: isDarkMode
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.05)",
                borderRadius: 20,
              }}
            >
              <Feather
                name="x"
                size={18}
                color={isDarkMode ? "#9AA5B4" : "#64748B"}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Message Input */}
        <View
          className={`border-t ${
            isDarkMode
              ? "border-gray-800 bg-gray-900"
              : "border-gray-100 bg-white"
          } px-3 py-2`}
          style={{
            paddingBottom: insets.bottom > 0 ? insets.bottom + 8 : 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 3,
          }}
        >
          <View className="flex-row items-end">
            <TouchableOpacity
              className="mr-2 p-2"
              activeOpacity={0.7}
              onPress={() => setShowAttachmentOptions(true)}
              style={{
                backgroundColor: isDarkMode
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.03)",
                borderRadius: 20,
                width: 40,
                height: 40,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Feather
                name="plus"
                size={22}
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
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: newMessage.trim()
                  ? isDarkMode
                    ? "#25BE80"
                    : "#1A8D60"
                  : isDarkMode
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.03)",
              }}
              onPress={handleSendMessage}
              disabled={!newMessage.trim()}
              activeOpacity={0.7}
            >
              <Feather
                name="send"
                size={18}
                color={
                  newMessage.trim()
                    ? "white"
                    : isDarkMode
                    ? "#9AA5B4"
                    : "#94A3B8"
                }
              />
            </TouchableOpacity>
          </View>
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
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
