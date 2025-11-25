import React, { useState, useEffect } from "react";
import { View, StyleSheet, Pressable, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import ScreenScrollView from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import EmptyState from "@/components/EmptyState";
import { useTheme } from "@/hooks/useTheme";
import { storage } from "@/utils/storage";
import { Account } from "@/types";
import { Spacing, BorderRadius } from "@/constants/theme";

export default function AccountsScreen() {
  const { theme } = useTheme();
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    const data = await storage.getAccounts();
    setAccounts(data);
  };

  const handleAddAccount = () => {
    Alert.alert(
      "Add Account",
      "In the full version, this would integrate with Plaid to securely link your financial accounts.",
      [{ text: "OK" }]
    );
  };

  const handleSyncAccount = async (accountId: string) => {
    Alert.alert(
      "Sync Account",
      "In the full version, this would fetch the latest transactions from your account.",
      [{ text: "OK" }]
    );
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "credit":
        return "credit-card";
      case "checking":
        return "dollar-sign";
      case "savings":
        return "briefcase";
      default:
        return "credit-card";
    }
  };

  return (
    <ScreenScrollView>
      {accounts.length === 0 ? (
        <EmptyState
          image={require("@/assets/images/empty-states/no-accounts.png")}
          title="No Accounts Linked"
          description="Add your first account to automatically track expenses"
        />
      ) : (
        <View style={styles.accountsList}>
          {accounts.map((account) => (
            <Card key={account.id} style={styles.accountCard}>
              <View style={styles.accountHeader}>
                <View style={[styles.iconCircle, { backgroundColor: theme.primary + "20" }]}>
                  <Feather name={getAccountIcon(account.accountType) as any} size={24} color={theme.primary} />
                </View>
                <View style={styles.accountInfo}>
                  <ThemedText style={styles.institutionName}>{account.institutionName}</ThemedText>
                  <ThemedText variant="secondary" style={styles.accountName}>
                    {account.accountName} ••{account.accountMask}
                  </ThemedText>
                </View>
              </View>
              
              <View style={styles.accountDetails}>
                <View style={styles.balanceRow}>
                  <ThemedText variant="secondary">Balance</ThemedText>
                  <ThemedText style={styles.balance}>${account.balance.toFixed(2)}</ThemedText>
                </View>
                
                <View style={styles.syncRow}>
                  <ThemedText variant="secondary" style={styles.syncText}>
                    Last synced: {new Date(account.lastSyncedAt).toLocaleDateString()}
                  </ThemedText>
                  <Pressable
                    style={({ pressed }) => [
                      styles.syncButton,
                      { opacity: pressed ? 0.6 : 1 },
                    ]}
                    onPress={() => handleSyncAccount(account.id)}
                  >
                    <Feather name="refresh-cw" size={16} color={theme.primary} />
                    <ThemedText style={[styles.syncButtonText, { color: theme.primary }]}>
                      Sync
                    </ThemedText>
                  </Pressable>
                </View>
              </View>
            </Card>
          ))}
        </View>
      )}

      <Pressable
        style={({ pressed }) => [
          styles.addButton,
          { backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1 },
        ]}
        onPress={handleAddAccount}
      >
        <Feather name="plus" size={20} color="#FFFFFF" />
        <ThemedText style={styles.addButtonText}>Add Account</ThemedText>
      </Pressable>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  accountsList: {
    marginBottom: Spacing.xl,
  },
  accountCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  accountHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  accountInfo: {
    flex: 1,
  },
  institutionName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  accountName: {
    fontSize: 14,
  },
  accountDetails: {
    gap: Spacing.md,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balance: {
    fontSize: 20,
    fontWeight: "600",
  },
  syncRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  syncText: {
    fontSize: 12,
  },
  syncButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  syncButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  addButton: {
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.lg,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.sm,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

