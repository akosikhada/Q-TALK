import { Contact, ContactSection } from "../types/contacts";

// Mock contacts data
export const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Alice Johnson",
    phone: "+1 (555) 123-4567",
    email: "alice@example.com",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    isOnline: true,
    isFavorite: true,
    status: "online",
    lastSeen: "Just now",
  },
  {
    id: "2",
    name: "Bob Smith",
    phone: "+1 (555) 234-5678",
    email: "bob@example.com",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    isOnline: false,
    isFavorite: true,
    status: "offline",
    lastSeen: "2 hours ago",
  },
  {
    id: "3",
    name: "Charlie Davis",
    phone: "+1 (555) 345-6789",
    email: "charlie@example.com",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    isOnline: true,
    isFavorite: false,
    status: "online",
    lastSeen: "Just now",
  },
  {
    id: "4",
    name: "Diana Miller",
    phone: "+1 (555) 456-7890",
    email: "diana@example.com",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    isOnline: false,
    isFavorite: false,
    status: "away",
    lastSeen: "1 day ago",
  },
  {
    id: "5",
    name: "Ethan Wilson",
    phone: "+1 (555) 567-8901",
    email: "ethan@example.com",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    isOnline: true,
    isFavorite: true,
    status: "online",
    lastSeen: "Just now",
  },
  {
    id: "6",
    name: "Fiona Brown",
    phone: "+1 (555) 678-9012",
    email: "fiona@example.com",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    isOnline: false,
    isFavorite: false,
    status: "busy",
    lastSeen: "3 hours ago",
  },
  {
    id: "7",
    name: "George Taylor",
    phone: "+1 (555) 789-0123",
    email: "george@example.com",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    isOnline: true,
    isFavorite: false,
    status: "online",
    lastSeen: "Just now",
  },
  {
    id: "8",
    name: "Hannah Martinez",
    phone: "+1 (555) 890-1234",
    email: "hannah@example.com",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    isOnline: false,
    isFavorite: true,
    status: "offline",
    lastSeen: "5 days ago",
  },
];

// Function to group contacts by first letter
export const getContactSections = (): ContactSection[] => {
  const grouped: { [key: string]: Contact[] } = {};

  // Sort contacts by name
  const sortedContacts = [...mockContacts].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // Group by first letter
  sortedContacts.forEach((contact) => {
    const firstLetter = contact.name.charAt(0).toUpperCase();
    if (!grouped[firstLetter]) {
      grouped[firstLetter] = [];
    }
    grouped[firstLetter].push(contact);
  });

  // Convert to array of sections
  const sections = Object.keys(grouped)
    .sort()
    .map((letter) => ({
      title: letter,
      data: grouped[letter],
    }));

  return sections;
};

// Function to get favorite contacts
export const getFavoriteContacts = (): Contact[] => {
  return mockContacts.filter((contact) => contact.isFavorite);
};

// Function to search contacts
export const searchContacts = (query: string): Contact[] => {
  const searchTerm = query.toLowerCase().trim();
  if (!searchTerm) return mockContacts;

  return mockContacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm) ||
      (contact.phone && contact.phone.includes(searchTerm)) ||
      (contact.email && contact.email.toLowerCase().includes(searchTerm))
  );
};
