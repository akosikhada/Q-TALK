import { Call } from "../types/calls";

// Create dates for different days
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

const threeDaysAgo = new Date(today);
threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

const fourDaysAgo = new Date(today);
fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);

export const MOCK_CALLS: Call[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    type: "incoming",
    timestamp: today,
  },
  {
    id: "2",
    name: "Michael Chen",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    type: "outgoing",
    timestamp: yesterday,
  },
  {
    id: "3",
    name: "Emma Wilson",
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
    type: "missed",
    timestamp: yesterday,
  },
  {
    id: "4",
    name: "James Rodriguez",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    type: "video",
    timestamp: twoDaysAgo,
  },
  {
    id: "5",
    name: "Olivia Taylor",
    avatar: "https://randomuser.me/api/portraits/women/17.jpg",
    type: "incoming",
    timestamp: twoDaysAgo,
  },
  {
    id: "6",
    name: "William Brown",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    type: "outgoing",
    timestamp: threeDaysAgo,
  },
  {
    id: "7",
    name: "Sophia Martinez",
    avatar: "https://randomuser.me/api/portraits/women/28.jpg",
    type: "missed",
    timestamp: threeDaysAgo,
  },
  {
    id: "8",
    name: "Benjamin Lee",
    avatar: "https://randomuser.me/api/portraits/men/91.jpg",
    type: "video",
    timestamp: fourDaysAgo,
  },
  {
    id: "9",
    name: "Isabella Garcia",
    avatar: "https://randomuser.me/api/portraits/women/63.jpg",
    type: "incoming",
    timestamp: fourDaysAgo,
  },
  {
    id: "10",
    name: "Ethan Wilson",
    avatar: "https://randomuser.me/api/portraits/men/40.jpg",
    type: "outgoing",
    timestamp: fourDaysAgo,
  },
];
