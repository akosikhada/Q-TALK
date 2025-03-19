import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Image } from "react-native";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from "../components/StyledComponents";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import MessagesScreen from "../screens/MessagesScreen";
import ChatScreen from "../screens/ChatScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ContactsScreen from "../screens/ContactsScreen";
import CallsScreen from "../screens/CallsScreen";
import PrivacyScreen from "../screens/PrivacyScreen";
import ProfileScreen from "../screens/ProfileScreen";

import { db } from "../services/config"; 
import { ref, update } from "firebase/database";

// Mock data for contacts
const MOCK_CONTACTS = [
  { id: "1", name: "Sarah Parker" },
  { id: "2", name: "David Wilson" },
  { id: "3", name: "Emma Thompson" },
  { id: "4", name: "Michael Chen" },
  { id: "5", name: "Lisa Anderson" },
  { id: "6", name: "James Rodriguez" },
  { id: "7", name: "Sophie Turner" },
  { id: "8", name: "Alex Johnson" },
];

// Type definitions for navigation
export type MainStackParamList = {
  TabNavigator: undefined;
  Chat: { conversationId: string; contactName: string };
  NewMessage: undefined;
  Privacy: undefined;
  Profile: undefined;
  Security: undefined;
  LinkedDevices: undefined;
  ChatSettings: undefined;
  DataStorage: undefined;
  Language: undefined;
  HelpCenter: undefined;
  About: undefined;
  Terms: undefined;
};

export type TabParamList = {
  messages: undefined;
  calls: undefined;
  contacts: undefined;
  settings: undefined;
};

const MainStack = createStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

type AppNavigatorProps = {
  onLogout: () => void;
};

// Tab Navigator Component
const TabNavigator: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          display: "none", // Hide the tab bar as we're using custom bottom navigation
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="messages"
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../assets/SimpleLogo.png")}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          ),
        }}
      >
        {(props) => <MessagesScreenWrapper {...props} />}
      </Tab.Screen>
      <Tab.Screen name="calls" component={CallsScreenWrapper} />
      <Tab.Screen name="contacts" component={ContactsScreenWrapper} />
      <Tab.Screen name="settings">
        {(props) => (
          <SettingsScreen
            {...props}
            onLogout={onLogout}
            navigation={props.navigation}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

// Wrapper for MessagesScreen to handle navigation
const MessagesScreenWrapper = ({ navigation }: any) => {
  const handleSelectConversation = (conversationId: string, contactName: string) => {
    const rootNavigation = navigation.getParent();
    
    if (rootNavigation) {
      // Navigate to chat screen
      rootNavigation.navigate("Chat", { conversationId, contactName });
  
      // Reset unread count in Firebase
      const conversationRef = ref(db, `conversations/${conversationId}`);
      update(conversationRef, { unread: 0 })
  .then(() => {
    console.log("Unread count reset.");
  })
  .catch(error => console.error("Failed to reset unread count:", error));
    }
  };

  const handleNewMessage = () => {
    const rootNavigation = navigation.getParent();
    if (rootNavigation) {
      rootNavigation.navigate("NewMessage");
    }
  };

  return (
    <MessagesScreen
      onSelectConversation={handleSelectConversation} // Pass the function
      onNewMessage={handleNewMessage}
      navigation={navigation}
    />
  );
};


// Wrapper for ContactsScreen to handle navigation
const ContactsScreenWrapper = ({ navigation }: any) => {
  const handleSelectContact = (contactId: string) => {
    const contact = MOCK_CONTACTS.find((c) => c.id === contactId);
    if (contact) {
      const rootNavigation = navigation.getParent();
      if (rootNavigation) {
        rootNavigation.navigate("Chat", {
          conversationId: contactId,
          contactName: contact.name,
        });
      }
    }
  };

  return (
    <ContactsScreen
      onSelectContact={handleSelectContact}
      navigation={navigation}
    />
  );
};

// Wrapper for CallsScreen to handle navigation
const CallsScreenWrapper = ({ navigation }: any) => {
  const handleMakeCall = (contactId: string, isVideo: boolean) => {
    // In a real app, this would initiate a call
    console.log(`Making ${isVideo ? "video" : "audio"} call to ${contactId}`);
  };

  return <CallsScreen navigation={navigation} />;
};

// New Message Screen
const NewMessageScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background-light">
      <StatusBar style="light" />

      {/* Header */}
      <View
        className="bg-primary px-4 pb-3"
        style={{ paddingTop: insets.top + 10 }}
      >
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            className="mr-3"
          >
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>

          <Text className="text-2xl font-bold text-text-light">
            New Message
          </Text>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white/20 rounded-full px-4 py-2">
          <Feather
            name="search"
            size={18}
            color="rgba(255, 255, 255, 0.6)"
            className="mr-2"
          />
          <TextInput
            className="flex-1 text-text-light"
            placeholder="Search contacts"
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
          />
        </View>
      </View>

      <View className="flex-1 items-center justify-center p-4">
        <View className="items-center mb-6">
          <Feather name="edit" size={48} color="#9AA5B4" />
          <Text className="text-text-primary text-lg font-semibold mt-4">
            New Message
          </Text>
          <Text className="text-text-secondary text-center mt-2">
            Search for contacts above to start a new conversation
          </Text>
        </View>
      </View>
    </View>
  );
};

// Placeholder Screen Component
const PlaceholderScreen = ({ route, navigation }: any) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <Feather name="alert-circle" size={48} color="#9AA5B4" />
      <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 16 }}>
        {route.name} Screen
      </Text>
      <Text
        style={{ marginTop: 8, textAlign: "center", paddingHorizontal: 32 }}
      >
        This screen is under development
      </Text>
      <TouchableOpacity
        style={{
          marginTop: 24,
          paddingVertical: 12,
          paddingHorizontal: 24,
          backgroundColor: "#25BE80",
          borderRadius: 100,
        }}
        onPress={() => navigation.goBack()}
      >
        <Text style={{ color: "white", fontWeight: "600" }}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

// Main App Navigator
const AppNavigator: React.FC<AppNavigatorProps> = ({ onLogout }) => {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="TabNavigator">
        {(props) => <TabNavigator {...props} onLogout={onLogout} />}
      </MainStack.Screen>

      <MainStack.Screen name="Chat">
        {({ route, navigation }) => (
          <ChatScreen
            conversationId={route.params.conversationId}
            contactName={route.params.contactName}
            onBack={() => navigation.goBack()}
            navigation={navigation}
          />
        )}
      </MainStack.Screen>

      <MainStack.Screen name="NewMessage" component={NewMessageScreen} />
      <MainStack.Screen name="Privacy" component={PrivacyScreen} />
      <MainStack.Screen name="Profile" component={ProfileScreen} />

      {/* Placeholder screens */}
      <MainStack.Screen name="Security" component={PlaceholderScreen} />
      <MainStack.Screen name="LinkedDevices" component={PlaceholderScreen} />
      <MainStack.Screen name="ChatSettings" component={PlaceholderScreen} />
      <MainStack.Screen name="DataStorage" component={PlaceholderScreen} />
      <MainStack.Screen name="Language" component={PlaceholderScreen} />
      <MainStack.Screen name="HelpCenter" component={PlaceholderScreen} />
      <MainStack.Screen name="About" component={PlaceholderScreen} />
      <MainStack.Screen name="Terms" component={PlaceholderScreen} />
    </MainStack.Navigator>
  );
};

export default AppNavigator;
