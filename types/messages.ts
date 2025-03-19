export type Conversation = {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
  avatar: string | null;
  isOnline?: boolean;
  isMuted?: boolean;
};

export type MessagesScreenProps = {
  onSelectConversation: (conversationId: string, conversationName: string) => void;
  onNewMessage: () => void;
  navigation?: any;
};
