import React from "react";
import { View, Image, StyleSheet, Text } from "react-native";
import { ResponsiveSize } from "./StyledComponents";

interface AvatarProps {
  uri?: string;
  name: string;
  size?: number;
  backgroundColor?: string;
  textColor?: string;
  showStatus?: boolean;
  isOnline?: boolean;
  statusSize?: number;
  statusColor?: string;
  style?: any;
}

const Avatar: React.FC<AvatarProps> = ({
  uri,
  name,
  size = 40,
  backgroundColor = "#25BE80",
  textColor = "#FFFFFF",
  showStatus = false,
  isOnline = false,
  statusSize = 12,
  statusColor,
  style,
}) => {
  const getInitials = (name: string) => {
    if (!name) return "";
    const nameParts = name.split(" ");
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    return (
      nameParts[0].charAt(0).toUpperCase() +
      nameParts[nameParts.length - 1].charAt(0).toUpperCase()
    );
  };

  const responsiveSize = ResponsiveSize.width(size);
  const fontSize = responsiveSize * 0.4;
  const statusDotSize = ResponsiveSize.width(statusSize);

  return (
    <View style={[styles.container, style]}>
      {uri ? (
        <Image
          source={{ uri }}
          style={[
            styles.image,
            {
              width: responsiveSize,
              height: responsiveSize,
              borderRadius: responsiveSize / 2,
            },
          ]}
        />
      ) : (
        <View
          style={[
            styles.initialsContainer,
            {
              width: responsiveSize,
              height: responsiveSize,
              borderRadius: responsiveSize / 2,
              backgroundColor,
            },
          ]}
        >
          <Text style={[styles.initialsText, { color: textColor, fontSize }]}>
            {getInitials(name)}
          </Text>
        </View>
      )}
      {showStatus && (
        <View
          style={[
            styles.statusDot,
            {
              width: statusDotSize,
              height: statusDotSize,
              borderRadius: statusDotSize / 2,
              backgroundColor:
                statusColor || (isOnline ? "#25BE80" : "#9AA5B4"),
              right: 0,
              bottom: 0,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  image: {
    backgroundColor: "#E5E7EB",
  },
  initialsContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  initialsText: {
    fontWeight: "600",
  },
  statusDot: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
});

export default Avatar;
