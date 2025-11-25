import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { CATEGORIES } from "@/types";

interface CategoryBadgeProps {
  categoryId: string;
  size?: "small" | "medium";
}

export default function CategoryBadge({ categoryId, size = "medium" }: CategoryBadgeProps) {
  const category = CATEGORIES.find((c) => c.id === categoryId);
  
  if (!category) return null;

  const iconSize = size === "small" ? 14 : 16;
  const fontSize = size === "small" ? 12 : 14;

  return (
    <View style={[styles.badge, { backgroundColor: category.color + "20" }]}>
      <Feather name={category.icon as any} size={iconSize} color={category.color} />
      <ThemedText style={[styles.text, { color: category.color, fontSize }]}>
        {category.name}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  text: {
    fontWeight: "500",
  },
});
