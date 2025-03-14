import { useState, useRef, useEffect } from "react";
import { Animated, PanResponder } from "react-native";
import { Message } from "../types/chat";

type SwipeAnimRef = {
  [key: string]: Animated.Value;
};

export const useChat = (initialMessages: Message[] = []) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showReactions, setShowReactions] = useState<string | null>(null);
  const swipeAnimRef = useRef<SwipeAnimRef>({});

  // Initialize animation values for all messages
  useEffect(() => {
    const newAnimations: SwipeAnimRef = {};
    messages.forEach((message) => {
      if (!swipeAnimRef.current[message.id]) {
        newAnimations[message.id] = new Animated.Value(0);
      }
    });
    swipeAnimRef.current = { ...swipeAnimRef.current, ...newAnimations };
  }, [messages]);

  const handleSend = (newMessage: string) => {
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

    // Initialize animation value for new message
    swipeAnimRef.current[newMsg.id] = new Animated.Value(0);
    setMessages([...messages, newMsg]);
    setReplyingTo(null);
  };

  const toggleReactions = (messageId: string) => {
    setShowReactions(showReactions === messageId ? null : messageId);
  };

  const addReaction = (messageId: string, reaction: string) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              reactions: msg.reactions
                ? msg.reactions.includes(reaction)
                  ? msg.reactions.filter((r) => r !== reaction)
                  : [...msg.reactions, reaction]
                : [reaction],
            }
          : msg
      )
    );
    setShowReactions(null);
  };

  const handleReply = (message: Message) => {
    setReplyingTo(message);
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const createPanResponder = (message: Message) => {
    const anim = swipeAnimRef.current[message.id];
    if (!anim)
      return PanResponder.create({ onStartShouldSetPanResponder: () => false });

    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy * 3);
      },
      onPanResponderGrant: () => {
        anim.setValue(0);
      },
      onPanResponderMove: (_, gestureState) => {
        // Allow swiping in both directions based on message sender
        const swipeDirection = message.isSent ? -1 : 1;
        const dx = gestureState.dx * swipeDirection;
        if (dx > 0) {
          const swipeDistance = Math.min(dx, 100);
          anim.setValue(swipeDistance * swipeDirection);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const swipeDirection = message.isSent ? -1 : 1;
        const dx = gestureState.dx * swipeDirection;
        if (dx > 80) {
          handleReply(message);
        }

        Animated.spring(anim, {
          toValue: 0,
          useNativeDriver: true,
          friction: 5,
        }).start();
      },
    });
  };

  return {
    messages,
    replyingTo,
    showReactions,
    swipeAnim: swipeAnimRef.current,
    handleSend,
    toggleReactions,
    addReaction,
    handleReply,
    cancelReply,
    createPanResponder,
  };
};
