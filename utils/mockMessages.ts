import { Conversation } from "../types/messages";

// Create dates for different times
const now = new Date();
const fiveMinutesAgo = new Date(now.getTime() - 5 * 60000);
const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60000);
const oneHourAgo = new Date(now.getTime() - 60 * 60000);
const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60000);
const yesterday = new Date(now);
yesterday.setDate(yesterday.getDate() - 1);
const twoDaysAgo = new Date(now);
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    name: "Sarah Parker",
    lastMessage: "Hey! How's your project coming along?",
    timestamp: fiveMinutesAgo,
    unread: 2,
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    isOnline: true,
  },
  {
    id: "2",
    name: "David Wilson",
    lastMessage: "The meeting is scheduled for tomorrow at 10.",
    timestamp: thirtyMinutesAgo,
    unread: 0,
    avatar: "https://randomuser.me/api/portraits/men/54.jpg",
    isOnline: true,
  },
  {
    id: "3",
    name: "Emma Thompson",
    lastMessage: "Thanks for your help with the presentation",
    timestamp: oneHourAgo,
    unread: 1,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    isOnline: true,
  },
  {
    id: "4",
    name: "Michael Chen",
    lastMessage: "Let's catch up soon!",
    timestamp: threeHoursAgo,
    unread: 0,
    avatar: "https://randomuser.me/api/portraits/men/42.jpg",
    isOnline: false,
  },
  {
    id: "5",
    name: "Lisa Anderson",
    lastMessage: "The documents have been sent to your email",
    timestamp: yesterday,
    unread: 0,
    avatar: "https://randomuser.me/api/portraits/women/63.jpg",
    isOnline: false,
  },
  {
    id: "6",
    name: "James Rodriguez",
    lastMessage: "Great idea! Let's discuss it further",
    timestamp: yesterday,
    unread: 0,
    avatar: "https://randomuser.me/api/portraits/men/29.jpg",
    isOnline: false,
  },
  {
    id: "7",
    name: "Sophie Turner",
    lastMessage: "Looking forward to our meeting next week",
    timestamp: twoDaysAgo,
    unread: 0,
    avatar: "https://randomuser.me/api/portraits/women/33.jpg",
    isOnline: true,
  },
  {
    id: "8",
    name: "Alex Johnson",
    lastMessage: "The project files are ready for review",
    timestamp: twoDaysAgo,
    unread: 0,
    avatar: "https://randomuser.me/api/portraits/men/91.jpg",
    isOnline: false,
  },
];
