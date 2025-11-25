import React from "react";
import { StyleSheet, View, ViewStyle, StyleProp } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  elevation?: number;
}

export function Card({ children, style, elevation = 1 }: CardProps) {
  const { theme } = useTheme();

  const getBackgroundColor = () => {
    switch (elevation) {
      case 0:
        return theme.backgroundRoot;
      case 1:
        return theme.backgroundDefault;
      case 2:
        return theme.backgroundSecondary;
      case 3:
        return theme.backgroundTertiary;
      default:
        return theme.backgroundDefault;
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: getBackgroundColor(),
        },
        Shadows.card,
        style,
      ]}
    >
      {children}
    </View>
  );
}

export default Card;

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.sm,
    overflow: "hidden",
  },
});
