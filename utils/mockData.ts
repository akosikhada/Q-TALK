import { Message, Conversation, Contact, ContactGroup } from "../types/chat";

export const MOCK_MESSAGES: Message[] = [
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

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    name: "Sarah Parker",
    lastMessage: "Hey! How's your project coming along?",
    time: "9:41 AM",
    unread: 2,
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    isOnline: true,
  },
  {
    id: "2",
    name: "David Wilson",
    lastMessage: "The meeting is scheduled for tomorrow at 10.",
    time: "Yesterday",
    unread: 0,
    avatar: "https://randomuser.me/api/portraits/men/54.jpg",
    isOnline: true,
  },
  // ... Add more mock conversations
];

export const MOCK_CONTACTS = [
  {
    title: "Favorites",
    data: [
      {
        id: "2",
        name: "Amanda White",
        avatar: "https://randomuser.me/api/portraits/women/90.jpg",
        isOnline: true,
        phone: "+1 (555) 123-4567",
        email: "amanda.white@example.com",
        isFavorite: true,
      },
      {
        id: "8",
        name: "Sarah Parker",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
        isOnline: true,
        phone: "+1 (555) 987-6543",
        email: "sarah.parker@example.com",
        isFavorite: true,
      },
    ],
  },
  // ... Add more mock contacts
];

export const MOCK_CONTACT_GROUPS: ContactGroup[] = [
  {
    id: "1",
    name: "Family",
    contacts: ["2", "8"],
  },
  {
    id: "2",
    name: "Work",
    contacts: ["3", "7", "9"],
  },
  {
    id: "3",
    name: "Friends",
    contacts: ["1", "4", "5", "6"],
  },
];

export const EMOJI_CATEGORIES = [
  {
    title: "Smileys & Emotion",
    emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "�"],
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
    ],
  },
  {
    title: "Animals & Nature",
    emojis: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "�"],
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
