import React, { createContext, useState, useContext, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemePreference = "light" | "dark" | "system";
type ThemeType = "light" | "dark";

interface ThemeContextType {
  themePreference: ThemePreference;
  theme: ThemeType;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setThemePreference: (theme: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  themePreference: "system",
  theme: "light",
  isDarkMode: false,
  toggleTheme: () => {},
  setThemePreference: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const deviceTheme = useColorScheme();
  const [themePreference, setThemePreferenceState] =
    useState<ThemePreference>("system");
  const [theme, setThemeState] = useState<ThemeType>(
    (deviceTheme as ThemeType) || "light"
  );

  // Load saved theme preference from storage on initial render
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedThemePreference = await AsyncStorage.getItem(
          "@themePreference"
        );
        if (savedThemePreference) {
          setThemePreferenceState(savedThemePreference as ThemePreference);
        }
      } catch (error) {
        console.error("Failed to load theme preference", error);
      }
    };

    loadTheme();
  }, []);

  // Update actual theme based on preference and device theme
  useEffect(() => {
    if (themePreference === "system") {
      setThemeState((deviceTheme as ThemeType) || "light");
    } else {
      setThemeState(themePreference as ThemeType);
    }
  }, [themePreference, deviceTheme]);

  // Save theme preference to storage whenever it changes
  useEffect(() => {
    const saveThemePreference = async () => {
      try {
        await AsyncStorage.setItem("@themePreference", themePreference);
      } catch (error) {
        console.error("Failed to save theme preference", error);
      }
    };

    saveThemePreference();
  }, [themePreference]);

  const toggleTheme = () => {
    if (themePreference !== "system") {
      setThemePreferenceState(themePreference === "light" ? "dark" : "light");
    } else {
      // If system, switch to explicit light/dark based on current theme
      setThemePreferenceState(theme === "light" ? "dark" : "light");
    }
  };

  const setThemePreference = (newThemePreference: ThemePreference) => {
    setThemePreferenceState(newThemePreference);
  };

  return (
    <ThemeContext.Provider
      value={{
        themePreference,
        theme,
        isDarkMode: theme === "dark",
        toggleTheme,
        setThemePreference,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
