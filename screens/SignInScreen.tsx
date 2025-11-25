import React, { useState } from "react";
import { View, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { Spacing, BorderRadius } from "@/constants/theme";

export default function SignInScreen() {
  const { theme } = useTheme();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSignIn = async (provider: "apple" | "google") => {
    setLoading(provider);
    try {
      await signIn(provider);
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText style={styles.title}>Sign In</ThemedText>
        <ThemedText style={styles.subtitle} variant="secondary">
          Choose your preferred sign-in method
        </ThemedText>

        <View style={styles.buttonContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.providerButton,
              { backgroundColor: "#000000", opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={() => handleSignIn("apple")}
            disabled={loading !== null}
          >
            {loading === "apple" ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Feather name="smartphone" size={20} color="#FFFFFF" />
                <ThemedText style={styles.providerButtonText}>
                  Continue with Apple
                </ThemedText>
              </>
            )}
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.providerButton,
              {
                backgroundColor: theme.backgroundSecondary,
                borderWidth: 1,
                borderColor: theme.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            onPress={() => handleSignIn("google")}
            disabled={loading !== null}
          >
            {loading === "google" ? (
              <ActivityIndicator color={theme.text} />
            ) : (
              <>
                <Feather name="globe" size={20} color={theme.text} />
                <ThemedText style={[styles.providerButtonText, { color: theme.text }]}>
                  Continue with Google
                </ThemedText>
              </>
            )}
          </Pressable>
        </View>
      </View>

      <View style={styles.footer}>
        <ThemedText style={styles.footerText} variant="secondary">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </ThemedText>
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
    paddingHorizontal: Spacing.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: Spacing["3xl"],
  },
  buttonContainer: {
    gap: Spacing.lg,
  },
  providerButton: {
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.lg,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.md,
  },
  providerButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    padding: Spacing.xl,
    paddingBottom: Spacing["3xl"],
  },
  footerText: {
    fontSize: 12,
    textAlign: "center",
  },
});

