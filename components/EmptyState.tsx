import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Spacing } from "@/constants/theme";

interface EmptyStateProps {
  image: any;
  title: string;
  description: string;
}

export default function EmptyState({ image, title, description }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} resizeMode="contain" />
      <ThemedText style={styles.title}>{title}</ThemedText>
      <ThemedText style={styles.description} variant="secondary">
        {description}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: Spacing.xl,
    opacity: 0.6,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    maxWidth: 280,
  },
});
