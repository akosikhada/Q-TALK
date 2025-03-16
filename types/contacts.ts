import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "./navigation";

export interface Contact {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  avatar?: string;
  isOnline?: boolean;
  isFavorite?: boolean;
  status?: "online" | "offline" | "away" | "busy";
  lastSeen?: string;
}

export interface ContactSection {
  title: string;
  data: Contact[];
}

export interface ContactsScreenProps {
  navigation: StackNavigationProp<RootStackParamList, "ContactsScreen">;
}
