import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LogBox } from "react-native";
import AppNavigator from "./navigation/AppNavigator";
import AuthNavigator from "./navigation/AuthNavigator";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AlertProvider } from "./contexts/AlertContext";

// Ignore specific warnings that are related to third-party libraries
LogBox.ignoreLogs([
  "ViewPropTypes will be removed from React Native",
  "ColorPropType will be removed from React Native",
  "className prop will be ignored",
]);

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <ThemeProvider>
      <AlertProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            {isAuthenticated ? (
              <AppNavigator onLogout={handleLogout} />
            ) : (
              <AuthNavigator onAuthenticated={handleAuthenticated} />
            )}
          </NavigationContainer>
        </SafeAreaProvider>
      </AlertProvider>
    </ThemeProvider>
  );
}
