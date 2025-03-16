export type RootStackParamList = {
  TabNavigator: { screen: string };
  MessagesScreen: undefined;
  CallsScreen: undefined;
  ContactsScreen: undefined;
  SettingsScreen: undefined;
  ChatScreen: { chatId: string };
  ProfileScreen: { userId: string };
};
