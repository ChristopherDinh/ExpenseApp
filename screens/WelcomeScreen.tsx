import React from "react";
import { View, StyleSheet, Image, Pressable } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { Spacing, BorderRadius, Typography } from "@/constants/theme";

export default function WelcomeScreen() {
  const { theme } = useTheme();
  const { signIn } = useAuth();

  const handleGetStarted = async () => {
    await signIn("apple"); // Use any provider, it's just a mock sign-in
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("@/assets/images/icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <ThemedText style={styles.title}>Track Every Expense</ThemedText>
        <ThemedText style={styles.subtitle} variant="secondary">
          Capture receipts, sync accounts, and manage your spending all in one place
        </ThemedText>
      </View>

      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={handleGetStarted}
        >
          <ThemedText style={styles.buttonText}>Get Started</ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: Spacing["3xl"],
  },
  title: {
    ...Typography.h1,
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  subtitle: {
    ...Typography.body,
    textAlign: "center",
    maxWidth: 320,
  },
  footer: {
    padding: Spacing.xl,
    paddingBottom: Spacing["3xl"],
  },
  button: {
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
});

