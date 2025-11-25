import React, { useState, useEffect } from "react";
import { View, StyleSheet, Pressable, RefreshControl } from "react-native";
import { Feather } from "@expo/vector-icons";
import ScreenScrollView from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import CategoryBadge from "@/components/CategoryBadge";
import { useTheme } from "@/hooks/useTheme";
import { storage } from "@/utils/storage";
import { Transaction, Receipt } from "@/types";
import { CATEGORIES } from "@/types";
import { Spacing, BorderRadius } from "@/constants/theme";

export default function DashboardScreen() {
  const { theme } = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await storage.initializeMockData();
    const txns = await storage.getTransactions();
    const rcpts = await storage.getReceipts();
    setTransactions(txns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setReceipts(rcpts);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const totalSpent = transactions.reduce((sum, txn) => sum + txn.amount, 0);
  
  const categoryTotals = transactions.reduce((acc, txn) => {
    acc[txn.category] = (acc[txn.category] || 0) + txn.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <ScreenScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />}>
      <View style={styles.greeting}>
        <ThemedText style={styles.greetingText}>Hello, Demo User</ThemedText>
        <ThemedText variant="secondary" style={styles.greetingSubtext}>
          Here's your spending overview
        </ThemedText>
      </View>

      <Card style={styles.summaryCard}>
        <ThemedText variant="secondary" style={styles.label}>
          Total Spending This Month
        </ThemedText>
        <ThemedText style={styles.amount}>${totalSpent.toFixed(2)}</ThemedText>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <ThemedText variant="secondary" style={styles.statLabel}>
              Transactions
            </ThemedText>
            <ThemedText style={styles.statValue}>{transactions.length}</ThemedText>
          </View>
          <View style={styles.stat}>
            <ThemedText variant="secondary" style={styles.statLabel}>
              Receipts
            </ThemedText>
            <ThemedText style={styles.statValue}>{receipts.length}</ThemedText>
          </View>
        </View>
      </Card>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Top Categories</ThemedText>
        {topCategories.length > 0 ? (
          topCategories.map(([categoryId, amount]) => {
            const category = CATEGORIES.find((c) => c.id === categoryId);
            if (!category) return null;
            const percentage = (amount / totalSpent) * 100;
            
            return (
              <Card key={categoryId} style={styles.categoryCard}>
                <View style={styles.categoryHeader}>
                  <View style={styles.categoryInfo}>
                    <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                    <ThemedText style={styles.categoryName}>{category.name}</ThemedText>
                  </View>
                  <ThemedText style={styles.categoryAmount}>${amount.toFixed(2)}</ThemedText>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${percentage}%`, backgroundColor: category.color },
                    ]}
                  />
                </View>
              </Card>
            );
          })
        ) : (
          <ThemedText variant="secondary" style={styles.emptyText}>
            No spending data yet
          </ThemedText>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Recent Transactions</ThemedText>
        </View>
        {transactions.slice(0, 5).map((transaction) => (
          <Card key={transaction.id} style={styles.transactionCard}>
            <View style={styles.transactionRow}>
              <View style={styles.transactionInfo}>
                <ThemedText style={styles.merchantName}>{transaction.merchantName}</ThemedText>
                <ThemedText variant="secondary" style={styles.transactionDate}>
                  {new Date(transaction.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </ThemedText>
              </View>
              <View style={styles.transactionRight}>
                <ThemedText style={[styles.transactionAmount, { color: theme.expense }]}>
                  -${transaction.amount.toFixed(2)}
                </ThemedText>
                <CategoryBadge categoryId={transaction.category} size="small" />
              </View>
            </View>
          </Card>
        ))}
        {transactions.length === 0 && (
          <ThemedText variant="secondary" style={styles.emptyText}>
            No transactions yet
          </ThemedText>
        )}
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  greeting: {
    marginBottom: Spacing.xl,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: Spacing.xs,
  },
  greetingSubtext: {
    fontSize: 16,
  },
  summaryCard: {
    marginBottom: Spacing.xl,
    padding: Spacing.xl,
  },
  label: {
    fontSize: 14,
    marginBottom: Spacing.sm,
  },
  amount: {
    fontSize: 36,
    fontWeight: "700",
    marginBottom: Spacing.lg,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.xl,
  },
  stat: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "600",
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: Spacing.lg,
  },
  categoryCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  categoryInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "500",
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
  progressBar: {
    height: 6,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  transactionCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transactionInfo: {
    flex: 1,
  },
  merchantName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: Spacing.xs,
  },
  transactionDate: {
    fontSize: 14,
  },
  transactionRight: {
    alignItems: "flex-end",
    gap: Spacing.xs,
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: "600",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 14,
    marginTop: Spacing.lg,
  },
});

