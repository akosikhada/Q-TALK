import { useState } from "react";
import { Conversation } from "../types/chat";

export const useConversations = (initialConversations: Conversation[] = []) => {
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const filteredConversations = conversations.filter((conversation) =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleArchive = () => {
    if (selectedConversation) {
      // In a real app, you would implement actual archiving logic
      setSelectedConversation(null);
    }
  };

  const handleMute = () => {
    if (selectedConversation) {
      const updatedConversations = conversations.map((conv) =>
        conv.id === selectedConversation.id
          ? { ...conv, isMuted: !conv.isMuted }
          : conv
      );
      setConversations(updatedConversations);
      setSelectedConversation(null);
    }
  };

  const handleMarkAsUnread = () => {
    if (selectedConversation) {
      const updatedConversations = conversations.map((conv) =>
        conv.id === selectedConversation.id && conv.unread === 0
          ? { ...conv, unread: 1 }
          : conv
      );
      setConversations(updatedConversations);
      setSelectedConversation(null);
    }
  };

  const handleBlock = () => {
    if (selectedConversation) {
      // Remove the conversation from the list
      const updatedConversations = conversations.filter(
        (conv) => conv.id !== selectedConversation.id
      );
      setConversations(updatedConversations);
      setSelectedConversation(null);
    }
  };

  const handleDelete = () => {
    if (selectedConversation) {
      // Remove the conversation from the list
      const updatedConversations = conversations.filter(
        (conv) => conv.id !== selectedConversation.id
      );
      setConversations(updatedConversations);
      setSelectedConversation(null);
    }
  };

  return {
    conversations,
    setConversations,
    searchQuery,
    setSearchQuery,
    selectedConversation,
    setSelectedConversation,
    filteredConversations,
    handleArchive,
    handleMute,
    handleMarkAsUnread,
    handleBlock,
    handleDelete,
  };
};
