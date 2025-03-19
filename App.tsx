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
import { setupPresenceSystem, setUserOffline } from "./services/DatabaseService";

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

  const handleLogout = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        // Set status to Offline before signing out
        await setUserOffline(user.uid);
      }
      await signOut(auth);
      setIsAuthenticated(false);
    } catch (error:any) {
      console.error("Logout Error:", error.message);
    }
  };

  useEffect(() => {
    let cleanupPresence: (() => void) | null = null;
  
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
  
        if (snapshot.exists() && snapshot.val().emailVerified) {
          setIsAuthenticated(true);
          
          // Setup presence system
          cleanupPresence = setupPresenceSystem(user.uid);
        } else {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    });
  
    return () => {
      if (cleanupPresence) cleanupPresence(); // Cleanup presence
      unsubscribe();
    };
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
