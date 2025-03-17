import React, { useState, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  SectionList,
  StyleSheet,
  Animated,
  ScrollView,
  SectionListData,
} from "react-native";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from "../components/StyledComponents";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import {
  DarkModeWrapper,
  DarkModeText,
  DarkModeSecondaryText,
  ResponsiveSize,
  BottomNavigation,
  Avatar,
} from "../components";
import { NewContactModal } from "../components/modals";

// Define Contact type locally to avoid import errors
interface Contact {
  id: string;
  name: string;
  avatar?: string;
  phone?: string;
  email?: string;
  isOnline?: boolean;
  isFavorite?: boolean;
}

// Define ContactsScreenProps type locally
interface ContactsScreenProps {
  onSelectContact: (id: string) => void;
  navigation?: any;
}

// Define ContactFormData type locally
interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  profilePicture?: string;
}

// Define contact group type
type ContactGroup = {
  id: string;
  name: string;
  contacts: string[]; // Array of contact IDs
};

// Mock data for contacts
const CONTACTS: { title: string; data: Contact[] }[] = [
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
  {
    title: "A",
    data: [
      {
        id: "1",
        name: "Alex Johnson",
        avatar: "https://randomuser.me/api/portraits/men/91.jpg",
        isOnline: false,
        phone: "+1 (555) 234-5678",
        email: "alex.johnson@example.com",
      },
    ],
  },
  {
    title: "D",
    data: [
      {
        id: "3",
        name: "David Wilson",
        avatar: "https://randomuser.me/api/portraits/men/54.jpg",
        isOnline: true,
        phone: "+1 (555) 345-6789",
        email: "david.wilson@example.com",
      },
    ],
  },
  {
    title: "E",
    data: [
      {
        id: "4",
        name: "Emma Thompson",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        isOnline: true,
        phone: "+1 (555) 456-7890",
        email: "emma.thompson@example.com",
      },
    ],
  },
  {
    title: "J",
    data: [
      {
        id: "5",
        name: "James Rodriguez",
        avatar: "https://randomuser.me/api/portraits/men/29.jpg",
        isOnline: false,
        phone: "+1 (555) 567-8901",
        email: "james.rodriguez@example.com",
      },
    ],
  },
  {
    title: "L",
    data: [
      {
        id: "6",
        name: "Lisa Anderson",
        avatar: "https://randomuser.me/api/portraits/women/63.jpg",
        isOnline: false,
        phone: "+1 (555) 678-9012",
        email: "lisa.anderson@example.com",
      },
    ],
  },
  {
    title: "M",
    data: [
      {
        id: "7",
        name: "Michael Chen",
        avatar: "https://randomuser.me/api/portraits/men/42.jpg",
        isOnline: false,
        phone: "+1 (555) 789-0123",
        email: "michael.chen@example.com",
      },
    ],
  },
  {
    title: "S",
    data: [
      {
        id: "9",
        name: "Sophie Turner",
        avatar: "https://randomuser.me/api/portraits/women/33.jpg",
        isOnline: true,
        phone: "+1 (555) 890-1234",
        email: "sophie.turner@example.com",
      },
    ],
  },
];

// Mock data for contact groups
const CONTACT_GROUPS: ContactGroup[] = [
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

const ContactsScreen: React.FC<ContactsScreenProps> = ({
  onSelectContact,
  navigation,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showAlphabetIndex, setShowAlphabetIndex] = useState(false);
  const [showNewContactModal, setShowNewContactModal] = useState(false);
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const sectionListRef = useRef<SectionList>(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  // Filter contacts based on search query and active filter
  const getFilteredContacts = () => {
    let filteredData = [...CONTACTS];

    // Apply search filter
    if (searchQuery) {
      filteredData = filteredData
        .map((section) => ({
          title: section.title,
          data: section.data.filter(
            (contact) =>
              contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (contact.phone && contact.phone.includes(searchQuery)) ||
              (contact.email &&
                contact.email.toLowerCase().includes(searchQuery.toLowerCase()))
          ),
        }))
        .filter((section) => section.data.length > 0);
    }

    // Apply category filter
    if (activeFilter !== "all") {
      if (activeFilter === "favorites") {
        filteredData = filteredData.filter(
          (section) =>
            section.title === "Favorites" ||
            section.data.some((contact) => contact.isFavorite)
        );
      } else {
        // Filter by group
        const groupId = activeFilter;
        const groupContacts =
          CONTACT_GROUPS.find((group) => group.id === groupId)?.contacts || [];

        filteredData = filteredData
          .map((section) => ({
            title: section.title,
            data: section.data.filter((contact) =>
              groupContacts.includes(contact.id)
            ),
          }))
          .filter((section) => section.data.length > 0);
      }
    }

    return filteredData;
  };

  const filteredContacts = getFilteredContacts();

  // Function to scroll to a specific section
  const scrollToSection = (sectionTitle: string) => {
    const sectionIndex = filteredContacts.findIndex(
      (section) => section.title === sectionTitle
    );
    if (sectionIndex !== -1 && sectionListRef.current) {
      sectionListRef.current.scrollToLocation({
        sectionIndex,
        itemIndex: 0,
        animated: true,
        viewOffset: 0,
      });
    }
  };

  // Generate alphabet index for quick navigation
  const alphabetIndex = filteredContacts
    .map((section) => section.title)
    .filter((title) => title !== "Favorites");

  const renderItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={[
        styles.contactItem,
        { borderBottomColor: isDarkMode ? "#2D3748" : "#F5F7FA" },
      ]}
      onPress={() => onSelectContact(item.id)}
      activeOpacity={0.7}
    >
      {/* Avatar with favorite indicator */}
      <View style={styles.avatarContainer}>
        <Avatar
          uri={item.avatar}
          name={item.name}
          size={56}
          backgroundColor={isDarkMode ? "#3D4A5C" : "#E8E8E8"}
          showStatus={true}
          isOnline={item.isOnline}
          statusSize={14}
        />
        {item.isFavorite && (
          <View style={styles.favoriteIndicator}>
            <MaterialIcons
              name="star"
              size={ResponsiveSize.font(12)}
              color="#FFD700"
            />
          </View>
        )}
      </View>

      {/* Contact Info */}
      <View style={styles.contactInfo}>
        <DarkModeText style={styles.nameText}>{item.name}</DarkModeText>
        {item.phone && (
          <DarkModeSecondaryText style={styles.contactDetail}>
            {item.phone}
          </DarkModeSecondaryText>
        )}
      </View>

      {/* Quick Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onSelectContact(item.id)}
          activeOpacity={0.7}
        >
          <Feather
            name="message-circle"
            size={ResponsiveSize.font(20)}
            color={isDarkMode ? "#64B5F6" : "#2196F3"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onSelectContact(item.id)}
          activeOpacity={0.7}
        >
          <Feather
            name="phone"
            size={ResponsiveSize.font(20)}
            color={isDarkMode ? "#25BE80" : "#1A8D60"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onSelectContact(item.id)}
          activeOpacity={0.7}
        >
          <Feather
            name="video"
            size={ResponsiveSize.font(20)}
            color={isDarkMode ? "#FF5252" : "#FF3B30"}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section }: any) => (
    <View
      style={[
        styles.sectionHeader,
        { backgroundColor: isDarkMode ? "#1E293B" : "#F5F7FA" },
      ]}
    >
      <Text
        style={[
          styles.sectionTitle,
          { color: isDarkMode ? "#A0A0A0" : "#9AA5B4" },
        ]}
      >
        {section.title}
      </Text>
    </View>
  );

  const navigateToTab = (tabName: string) => {
    if (navigation) {
      // Navigate to the tab screen using the parent navigator
      const rootNavigation = navigation.getParent();
      if (rootNavigation) {
        rootNavigation.navigate("TabNavigator", { screen: tabName });
      }
    }
  };

  // Filter tabs
  const renderFilterTabs = () => {
    const filters = [
      { id: "all", label: "All" },
      { id: "favorites", label: "Favorites" },
      ...CONTACT_GROUPS.map((group) => ({ id: group.id, label: group.name })),
    ];

    return (
      <View
        style={[
          styles.filterTabsWrapper,
          { borderBottomColor: isDarkMode ? "#3D4A5C" : "#E5E7EB" },
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabsContainer}
          style={styles.filterTabsScroll}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterTab,
                activeFilter === filter.id && styles.activeFilterTab,
                {
                  backgroundColor:
                    activeFilter === filter.id
                      ? isDarkMode
                        ? "#25BE80"
                        : "#1A8D60"
                      : isDarkMode
                      ? "#2D3748"
                      : "#F3F4F6",
                },
              ]}
              onPress={() => setActiveFilter(filter.id)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  {
                    color:
                      activeFilter === filter.id
                        ? "#FFFFFF"
                        : isDarkMode
                        ? "#A0A0A0"
                        : "#6B7280",
                  },
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  // Alphabet index for quick navigation
  const renderAlphabetIndex = () => {
    if (!showAlphabetIndex || alphabetIndex.length <= 1) return null;

    return (
      <View style={styles.alphabetIndexContainer}>
        {alphabetIndex.map((letter) => (
          <TouchableOpacity
            key={letter}
            style={styles.alphabetIndexItem}
            onPress={() => scrollToSection(letter)}
          >
            <Text
              style={[
                styles.alphabetIndexText,
                { color: isDarkMode ? "#FFFFFF" : "#1F2937" },
              ]}
            >
              {letter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const handleSaveContact = (contactData: ContactFormData) => {
    console.log("Saving new contact:", contactData);
    // Here you would typically add the contact to your data store
    // For now, we'll just close the modal
    setShowNewContactModal(false);

    // In a real app, you would add the contact to your data store
    // and then refresh the contacts list
    // For example:
    // const newContact: Contact = {
    //   id: Date.now().toString(),
    //   name: contactData.name,
    //   phone: contactData.phone,
    //   email: contactData.email,
    //   avatar: contactData.profilePicture,
    //   isOnline: false,
    // };
    // addContact(newContact);
  };

  return (
    <DarkModeWrapper>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: isDarkMode ? "#25BE80" : "#1A8D60",
            paddingTop: insets.top + ResponsiveSize.padding(10),
          },
        ]}
      >
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Contacts</Text>
          <TouchableOpacity
            style={styles.newCallButton}
            activeOpacity={0.7}
            onPress={() => setShowNewContactModal(true)}
          >
            <Feather
              name="user-plus"
              size={ResponsiveSize.font(22)}
              color="white"
            />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Feather
            name="search"
            size={ResponsiveSize.font(18)}
            color="rgba(255, 255, 255, 0.6)"
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search contacts, phone numbers, emails..."
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Feather
                name="x"
                size={ResponsiveSize.font(18)}
                color="rgba(255, 255, 255, 0.6)"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Tabs */}
      {renderFilterTabs()}

      {/* Contacts List */}
      <View style={styles.listContainer}>
        <SectionList
          ref={sectionListRef}
          sections={filteredContacts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled={true}
          contentContainerStyle={{
            paddingBottom: insets.bottom + ResponsiveSize.padding(100),
          }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather
                name="users"
                size={ResponsiveSize.font(50)}
                color={isDarkMode ? "#3D4A5C" : "#E5E7EB"}
              />
              <DarkModeText style={styles.emptyText}>
                {searchQuery
                  ? "No contacts found matching your search"
                  : activeFilter !== "all"
                  ? "No contacts in this filter"
                  : "No contacts found"}
              </DarkModeText>
            </View>
          }
        />

        {/* Alphabet Index */}
        {renderAlphabetIndex()}
      </View>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab="contacts"
        onTabPress={navigateToTab}
        isDarkMode={isDarkMode}
      />

      {/* New Contact Modal - Using the enhanced reusable component */}
      <NewContactModal
        visible={showNewContactModal}
        onClose={() => setShowNewContactModal(false)}
        isDarkMode={isDarkMode}
        onSave={handleSaveContact}
      />
    </DarkModeWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: ResponsiveSize.padding(16),
    paddingBottom: ResponsiveSize.padding(12),
    borderBottomLeftRadius: ResponsiveSize.width(20),
    borderBottomRightRadius: ResponsiveSize.width(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: ResponsiveSize.padding(16),
  },
  headerTitle: {
    fontSize: ResponsiveSize.font(24),
    lineHeight: ResponsiveSize.font(32),
    fontWeight: "700",
    color: "#FFFFFF",
  },
  newCallButton: {
    width: ResponsiveSize.width(40),
    height: ResponsiveSize.width(40),
    borderRadius: ResponsiveSize.width(20),
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 100,
    paddingHorizontal: ResponsiveSize.padding(16),
    paddingVertical: ResponsiveSize.padding(8),
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: ResponsiveSize.font(16),
    marginLeft: ResponsiveSize.padding(8),
  },
  filterTabsWrapper: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB", // Default light mode color
    flexDirection: "row",
    justifyContent: "center",
  },
  filterTabsContainer: {
    paddingVertical: ResponsiveSize.padding(8),
    paddingHorizontal: ResponsiveSize.padding(16),
    flexGrow: 1,
    justifyContent: "center",
  },
  filterTab: {
    paddingHorizontal: ResponsiveSize.padding(12),
    paddingVertical: ResponsiveSize.padding(6),
    borderRadius: ResponsiveSize.width(16),
    marginRight: ResponsiveSize.padding(8),
  },
  activeFilterTab: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  filterTabText: {
    fontSize: ResponsiveSize.font(13),
    fontWeight: "500",
  },
  listContainer: {
    flex: 1,
    position: "relative",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: ResponsiveSize.padding(16),
    paddingVertical: ResponsiveSize.padding(16),
    borderBottomWidth: 1,
  },
  avatarContainer: {
    position: "relative",
  },
  favoriteIndicator: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: ResponsiveSize.width(10),
    padding: ResponsiveSize.padding(2),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  contactInfo: {
    flex: 1,
    marginLeft: ResponsiveSize.padding(16),
  },
  nameText: {
    fontWeight: "600",
    fontSize: ResponsiveSize.font(16),
    marginBottom: ResponsiveSize.padding(2),
  },
  contactDetail: {
    fontSize: ResponsiveSize.font(14),
  },
  actionButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: ResponsiveSize.padding(8),
    marginLeft: ResponsiveSize.padding(4),
  },
  sectionHeader: {
    paddingHorizontal: ResponsiveSize.padding(16),
    paddingVertical: ResponsiveSize.padding(6),
  },
  sectionTitle: {
    fontSize: ResponsiveSize.font(14),
    fontWeight: "600",
  },
  alphabetIndexContainer: {
    position: "absolute",
    right: ResponsiveSize.padding(4),
    top: "10%",
    bottom: "10%",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  alphabetIndexItem: {
    width: ResponsiveSize.width(20),
    height: ResponsiveSize.width(20),
    justifyContent: "center",
    alignItems: "center",
  },
  alphabetIndexText: {
    fontSize: ResponsiveSize.font(10),
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: ResponsiveSize.padding(100),
    paddingHorizontal: ResponsiveSize.padding(32),
  },
  emptyText: {
    fontSize: ResponsiveSize.font(16),
    marginTop: ResponsiveSize.padding(16),
    textAlign: "center",
  },
  filterTabsScroll: {
    width: "100%",
  },
});

export default ContactsScreen;
