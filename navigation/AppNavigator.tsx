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
};

export type TabParamList = {
  Messages: undefined;
  Calls: undefined;
  Contacts: undefined;
  Settings: undefined;
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
        name="Messages"
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
      <Tab.Screen name="Calls" component={CallsScreenWrapper} />
      <Tab.Screen name="Contacts" component={ContactsScreenWrapper} />
      <Tab.Screen name="Settings">
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
  const handleSelectConversation = (conversationId: string) => {
    const contact = MOCK_CONTACTS.find((c) => c.id === conversationId);
    if (contact) {
      navigation.navigate("Chat", {
        conversationId,
        contactName: contact.name,
      });
    }
  };

  const handleNewMessage = () => {
    navigation.navigate("NewMessage");
  };

  return (
    <MessagesScreen
      onSelectConversation={handleSelectConversation}
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
      navigation.navigate("Chat", {
        conversationId: contactId,
        contactName: contact.name,
      });
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

  return <CallsScreen onMakeCall={handleMakeCall} navigation={navigation} />;
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
    </MainStack.Navigator>
  );
};

export default AppNavigator;
