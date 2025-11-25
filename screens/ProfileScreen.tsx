import React, { useState } from "react";
import { View, StyleSheet, Pressable, Image, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import ScreenScrollView from "@/components/ScreenScrollView";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { Spacing, BorderRadius } from "@/constants/theme";

const AVATARS = [
  { id: "piggy-bank", name: "Piggy Bank", source: require("@/assets/images/avatars/piggy-bank.png") },
  { id: "wallet", name: "Wallet", source: require("@/assets/images/avatars/wallet.png") },
  { id: "chart", name: "Chart", source: require("@/assets/images/avatars/chart.png") },
];

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { user, signOut } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || "piggy-bank");

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: async () => {
            await signOut();
          },
        },
      ]
    );
  };

  return (
    <ScreenScrollView>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Profile</ThemedText>
      </View>

      <Card style={styles.userCard}>
        <View style={styles.avatarSection}>
          <Image 
            source={AVATARS.find((a) => a.id === selectedAvatar)?.source} 
            style={styles.currentAvatar}
            resizeMode="contain"
          />
          <View style={styles.userInfo}>
            <ThemedText style={styles.userName}>{user?.name}</ThemedText>
            <ThemedText variant="secondary" style={styles.userEmail}>
              {user?.email}
            </ThemedText>
          </View>
        </View>
      </Card>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Choose Avatar</ThemedText>
        <View style={styles.avatarGrid}>
          {AVATARS.map((avatar) => (
            <Pressable
              key={avatar.id}
              style={({ pressed }) => [
                styles.avatarOption,
                {
                  borderColor: selectedAvatar === avatar.id ? theme.primary : theme.border,
                  borderWidth: 2,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
              onPress={() => setSelectedAvatar(avatar.id)}
            >
              <Image source={avatar.source} style={styles.avatarImage} resizeMode="contain" />
              {selectedAvatar === avatar.id && (
                <View style={[styles.checkmark, { backgroundColor: theme.primary }]}>
                  <Feather name="check" size={16} color="#FFFFFF" />
                </View>
              )}
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Settings</ThemedText>
        
        <Card style={styles.settingItem}>
          <Feather name="bell" size={20} color={theme.text} />
          <ThemedText style={styles.settingText}>Notifications</ThemedText>
          <Feather name="chevron-right" size={20} color={theme.textSecondary} />
        </Card>

        <Card style={styles.settingItem}>
          <Feather name="tag" size={20} color={theme.text} />
          <ThemedText style={styles.settingText}>Manage Categories</ThemedText>
          <Feather name="chevron-right" size={20} color={theme.textSecondary} />
        </Card>

        <Card style={styles.settingItem}>
          <Feather name="shield" size={20} color={theme.text} />
          <ThemedText style={styles.settingText}>Privacy & Security</ThemedText>
          <Feather name="chevron-right" size={20} color={theme.textSecondary} />
        </Card>

        <Card style={styles.settingItem}>
          <Feather name="help-circle" size={20} color={theme.text} />
          <ThemedText style={styles.settingText}>Help & Support</ThemedText>
          <Feather name="chevron-right" size={20} color={theme.textSecondary} />
        </Card>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.logoutButton,
          { opacity: pressed ? 0.7 : 1 },
        ]}
        onPress={handleLogout}
      >
        <Feather name="log-out" size={20} color={theme.expense} />
        <ThemedText style={[styles.logoutText, { color: theme.expense }]}>
          Log Out
        </ThemedText>
      </Pressable>

      <ThemedText variant="secondary" style={styles.version}>
        Version 1.0.0
      </ThemedText>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
  },
  userCard: {
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  avatarSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
  },
  currentAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  userEmail: {
    fontSize: 16,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: Spacing.lg,
  },
  avatarGrid: {
    flexDirection: "row",
    gap: Spacing.lg,
  },
  avatarOption: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  avatarImage: {
    width: 70,
    height: 70,
  },
  checkmark: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    marginBottom: Spacing.xl,
  },
});
