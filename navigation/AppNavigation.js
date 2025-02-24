import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { Welcome, Intro, Chat } from "../screen";

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Intro"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Intro" component={Intro} />
        <Stack.Screen name="Chat" component={Chat} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
