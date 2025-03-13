import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ResponsiveSize } from "./StyledComponents";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  placeholder?: string;
  isDarkMode: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onClear,
  placeholder = "Search",
  isDarkMode,
}) => {
  return (
    <View
      style={[
        styles.searchContainer,
        {
          backgroundColor: isDarkMode ? "#1A202C" : "#FFFFFF",
        },
      ]}
    >
      <View
        style={[
          styles.searchBar,
          {
            backgroundColor: isDarkMode ? "#2D3748" : "#F3F4F6",
          },
        ]}
      >
        <Feather
          name="search"
          size={ResponsiveSize.font(16)}
          color={isDarkMode ? "#9AA5B4" : "#6B7280"}
          style={styles.searchIcon}
        />
        <TextInput
          style={[
            styles.searchInput,
            {
              color: isDarkMode ? "#FFFFFF" : "#1F2937",
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor={isDarkMode ? "#9AA5B4" : "#9CA3AF"}
          value={value}
          onChangeText={onChangeText}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={onClear} style={styles.clearButton}>
            <Feather
              name="x"
              size={ResponsiveSize.font(16)}
              color={isDarkMode ? "#9AA5B4" : "#6B7280"}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: ResponsiveSize.padding(16),
    paddingVertical: ResponsiveSize.padding(8),
    width: "100%",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: ResponsiveSize.width(8),
    paddingHorizontal: ResponsiveSize.padding(12),
    height: ResponsiveSize.height(40),
  },
  searchIcon: {
    marginRight: ResponsiveSize.padding(8),
  },
  searchInput: {
    flex: 1,
    fontSize: ResponsiveSize.font(14),
    height: "100%",
  },
  clearButton: {
    padding: ResponsiveSize.padding(4),
  },
});

export default SearchBar;
