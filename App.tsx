import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LogBox } from "react-native";
import AppNavigator from "./navigation/AppNavigator";
import AuthNavigator from "./navigation/AuthNavigator";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AlertProvider } from "./contexts/AlertContext";

import { auth, db, onAuthStateChanged, ref, get, signOut } from "./services/config";

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
    } catch (error:any) {
      console.error("Logout Error:", error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
  
        if (snapshot.exists()) {
          // Check if the user has completed email verification
          const userData = snapshot.val();
          // Only authenticate if emailVerified is true
          setIsAuthenticated(userData.emailVerified === true);
        } else {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    });
  
    return () => unsubscribe();
  }, []);

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
