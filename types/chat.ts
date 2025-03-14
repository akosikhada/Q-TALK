export type Message = {
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

export type Conversation = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string | null;
  isOnline?: boolean;
  isMuted?: boolean;
};

export type Contact = {
  id: string;
  name: string;
  avatar: string;
  isOnline?: boolean;
  phone?: string;
  email?: string;
  isFavorite?: boolean;
};

export type ContactGroup = {
  id: string;
  name: string;
  contacts: string[]; // Array of contact IDs
};
