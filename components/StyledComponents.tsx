import { styled } from "nativewind";
import {
  View as RNView,
  Text as RNText,
  TouchableOpacity as RNTouchableOpacity,
  TextInput as RNTextInput,
  Image as RNImage,
  ScrollView as RNScrollView,
  KeyboardAvoidingView as RNKeyboardAvoidingView,
  FlatList as RNFlatList,
  SafeAreaView as RNSafeAreaView,
  Dimensions,
  PixelRatio,
  Platform,
  ScaledSize,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";

// Get device dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Base dimensions we're designing for (iPhone 11 Pro / X)
const baseWidth = 375;
const baseHeight = 812;

// Responsive size utility
export const ResponsiveSize = {
  width: (size: number) => {
    return (SCREEN_WIDTH / baseWidth) * size;
  },
  height: (size: number) => {
    return (SCREEN_HEIGHT / baseHeight) * size;
  },
  font: (size: number) => {
    const scale = Math.min(
      SCREEN_WIDTH / baseWidth,
      SCREEN_HEIGHT / baseHeight
    );
    const newSize = size * scale;

    // Ensure font size is never too small
    return Math.round(Math.max(newSize, size * 0.8));
  },
  padding: (size: number) => {
    const scale = Math.min(
      SCREEN_WIDTH / baseWidth,
      SCREEN_HEIGHT / baseHeight
    );
    return Math.round(size * scale);
  },
  // Responsive size hook for components that need to update on orientation change
  useResponsiveSize: () => {
    const [dimensions, setDimensions] = useState({
      window: Dimensions.get("window"),
      screen: Dimensions.get("screen"),
    });

    useEffect(() => {
      const subscription = Dimensions.addEventListener(
        "change",
        ({ window, screen }) => {
          setDimensions({ window, screen });
        }
      );

      return () => subscription?.remove();
    }, []);

    const { width, height } = dimensions.window;

    return {
      width,
      height,
      isLandscape: width > height,
      responsiveWidth: (size: number) => (width / baseWidth) * size,
      responsiveHeight: (size: number) => (height / baseHeight) * size,
      responsiveFont: (size: number) => {
        const scale = Math.min(width / baseWidth, height / baseHeight);
        const newSize = size * scale;
        return Math.round(Math.max(newSize, size * 0.8));
      },
      responsivePadding: (size: number) => {
        const scale = Math.min(width / baseWidth, height / baseHeight);
        return Math.round(size * scale);
      },
    };
  },
};

// Export styled components
export const View = styled(RNView);
export const Text = styled(RNText);
export const TouchableOpacity = styled(RNTouchableOpacity);
export const TextInput = styled(RNTextInput);
export const Image = styled(RNImage);
export const ScrollView = styled(RNScrollView);
export const KeyboardAvoidingView = styled(RNKeyboardAvoidingView);
export const FlatList = styled(RNFlatList);
export const SafeAreaView = styled(RNSafeAreaView);

// Re-export other components from react-native
export {
  Platform,
  StatusBar,
  Switch,
  Animated,
  ActivityIndicator,
} from "react-native";

// Dark mode wrapper component
export const DarkModeWrapper: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: any;
}> = ({ children, className = "", style = {} }) => {
  const { isDarkMode } = useTheme();

  return (
    <View
      className={`flex-1 ${
        isDarkMode ? "bg-gray-900" : "bg-background-light"
      } ${className}`}
      style={style}
    >
      {children}
    </View>
  );
};

// Dark mode text component
export const DarkModeText: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: any;
}> = ({ children, className = "", style = {} }) => {
  const { isDarkMode } = useTheme();

  return (
    <Text
      className={`${
        isDarkMode ? "text-text-dark-primary" : "text-text-primary"
      } ${className}`}
      style={{
        fontSize: className.includes("text-")
          ? undefined
          : ResponsiveSize.font(16),
        lineHeight: className.includes("leading-")
          ? undefined
          : ResponsiveSize.font(24),
        ...style,
      }}
    >
      {children}
    </Text>
  );
};

// Dark mode secondary text component
export const DarkModeSecondaryText: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: any;
}> = ({ children, className = "", style = {} }) => {
  const { isDarkMode } = useTheme();

  return (
    <Text
      className={`${
        isDarkMode ? "text-text-dark-secondary" : "text-text-secondary"
      } ${className}`}
      style={{
        fontSize: className.includes("text-")
          ? undefined
          : ResponsiveSize.font(14),
        lineHeight: className.includes("leading-")
          ? undefined
          : ResponsiveSize.font(20),
        ...style,
      }}
    >
      {children}
    </Text>
  );
};

// Add a new component for headings with preserved size
export const DarkModeHeading: React.FC<{
  children: React.ReactNode;
  className?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  style?: any;
}> = ({ children, className = "", level = 1, style = {} }) => {
  const { isDarkMode } = useTheme();

  // Define font sizes based on heading level
  const getFontSize = () => {
    switch (level) {
      case 1:
        return ResponsiveSize.font(32);
      case 2:
        return ResponsiveSize.font(28);
      case 3:
        return ResponsiveSize.font(24);
      case 4:
        return ResponsiveSize.font(20);
      case 5:
        return ResponsiveSize.font(18);
      case 6:
        return ResponsiveSize.font(16);
      default:
        return ResponsiveSize.font(32);
    }
  };

  // Define line heights based on heading level
  const getLineHeight = () => {
    switch (level) {
      case 1:
        return ResponsiveSize.font(40);
      case 2:
        return ResponsiveSize.font(36);
      case 3:
        return ResponsiveSize.font(32);
      case 4:
        return ResponsiveSize.font(28);
      case 5:
        return ResponsiveSize.font(24);
      case 6:
        return ResponsiveSize.font(22);
      default:
        return ResponsiveSize.font(40);
    }
  };

  return (
    <Text
      className={`font-bold ${
        isDarkMode ? "text-text-dark-primary" : "text-text-primary"
      } ${className}`}
      style={{
        fontSize: className.includes("text-") ? undefined : getFontSize(),
        lineHeight: className.includes("leading-")
          ? undefined
          : getLineHeight(),
        ...style,
      }}
    >
      {children}
    </Text>
  );
};
