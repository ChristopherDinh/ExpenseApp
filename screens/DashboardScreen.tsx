import React, { useState, useEffect } from "react";
import { View, StyleSheet, Pressable, RefreshControl, Modal, ScrollView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import ScreenScrollView from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import CategoryBadge from "@/components/CategoryBadge";
import { useTheme } from "@/hooks/useTheme";
import { storage } from "@/utils/storage";
import { Transaction, Receipt } from "@/types";
import { CATEGORIES } from "@/types";
import { Spacing, BorderRadius } from "@/constants/theme";

const TRANSACTIONS_PER_PAGE = 10;

export default function DashboardScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [displayedCount, setDisplayedCount] = useState(TRANSACTIONS_PER_PAGE);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryDisplayedCount, setCategoryDisplayedCount] = useState(TRANSACTIONS_PER_PAGE);

  useEffect(() => {
    loadData();
  }, []);

  // Reload data when screen comes into focus (after saving receipt)
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    await storage.initializeMockData();
    const txns = await storage.getTransactions();
    const rcpts = await storage.getReceipts();
    const sortedTxns = txns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setTransactions(sortedTxns);
    setReceipts(rcpts);
    // Reset displayed count if we have fewer transactions than currently displayed
    setDisplayedCount((prev) => {
      if (sortedTxns.length < prev) {
        return Math.max(TRANSACTIONS_PER_PAGE, sortedTxns.length);
      }
      return prev;
    });
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

  const displayedTransactions = transactions.slice(0, displayedCount);
  const hasMoreTransactions = transactions.length > displayedCount;

  const loadMoreTransactions = () => {
    setDisplayedCount((prev) => prev + TRANSACTIONS_PER_PAGE);
  };

  const handleCategoryPress = (categoryId: string) => {
    if (Platform.OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedCategory(categoryId);
    setCategoryDisplayedCount(TRANSACTIONS_PER_PAGE);
  };

  const closeCategoryModal = () => {
    setSelectedCategory(null);
    setCategoryDisplayedCount(TRANSACTIONS_PER_PAGE);
  };

  const loadMoreCategoryTransactions = () => {
    setCategoryDisplayedCount((prev) => prev + TRANSACTIONS_PER_PAGE);
  };

  const categoryTransactions = selectedCategory
    ? transactions
        .filter((txn) => txn.category === selectedCategory)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];

  const displayedCategoryTransactions = categoryTransactions.slice(0, categoryDisplayedCount);
  const hasMoreCategoryTransactions = categoryTransactions.length > categoryDisplayedCount;
  const selectedCategoryData = selectedCategory ? CATEGORIES.find((c) => c.id === selectedCategory) : null;

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
              <Pressable
                key={categoryId}
                onPress={() => handleCategoryPress(categoryId)}
                style={({ pressed }) => [
                  styles.categoryCard,
                  { opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <Card style={styles.categoryCardContent}>
                  <View style={styles.categoryHeader}>
                    <View style={styles.categoryInfo}>
                      <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                      <ThemedText style={styles.categoryName}>{category.name}</ThemedText>
                    </View>
                    <View style={styles.categoryRight}>
                      <ThemedText style={styles.categoryAmount}>${amount.toFixed(2)}</ThemedText>
                      <Feather name="chevron-right" size={16} color={theme.textSecondary} />
                    </View>
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
              </Pressable>
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
        {displayedTransactions.length > 0 ? (
          <>
            {displayedTransactions.map((transaction) => (
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
            {hasMoreTransactions && (
              <Pressable
                style={({ pressed }) => [
                  styles.loadMoreButton,
                  { backgroundColor: theme.backgroundSecondary, opacity: pressed ? 0.8 : 1 },
                ]}
                onPress={loadMoreTransactions}
              >
                <ThemedText style={styles.loadMoreText}>
                  Load More ({transactions.length - displayedCount} remaining)
                </ThemedText>
                <Feather name="chevron-down" size={16} color={theme.textSecondary} />
              </Pressable>
            )}
          </>
        ) : (
          <ThemedText variant="secondary" style={styles.emptyText}>
            No transactions yet
          </ThemedText>
        )}
      </View>

      <Modal
        visible={selectedCategory !== null}
        transparent={true}
        animationType="slide"
        onRequestClose={closeCategoryModal}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.backgroundRoot }]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                {selectedCategoryData && (
                  <>
                    <View style={[styles.modalCategoryDot, { backgroundColor: selectedCategoryData.color }]} />
                    <ThemedText style={styles.modalTitle}>{selectedCategoryData.name}</ThemedText>
                  </>
                )}
              </View>
              <Pressable
                onPress={closeCategoryModal}
                style={({ pressed }) => [
                  styles.modalCloseButton,
                  { opacity: pressed ? 0.6 : 1 },
                ]}
              >
                <Feather name="x" size={24} color={theme.text} />
              </Pressable>
            </View>

            <ScrollView
              style={styles.modalScrollView}
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator
            >
              {displayedCategoryTransactions.length > 0 ? (
                <>
                  {displayedCategoryTransactions.map((transaction) => (
                    <Card key={transaction.id} style={styles.transactionCard}>
                      <View style={styles.transactionRow}>
                        <View style={styles.transactionInfo}>
                          <ThemedText style={styles.merchantName}>{transaction.merchantName}</ThemedText>
                          <ThemedText variant="secondary" style={styles.transactionDate}>
                            {new Date(transaction.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
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
                  {hasMoreCategoryTransactions && (
                    <Pressable
                      style={({ pressed }) => [
                        styles.loadMoreButton,
                        { backgroundColor: theme.backgroundSecondary, opacity: pressed ? 0.8 : 1 },
                      ]}
                      onPress={loadMoreCategoryTransactions}
                    >
                      <ThemedText style={styles.loadMoreText}>
                        Load More ({categoryTransactions.length - categoryDisplayedCount} remaining)
                      </ThemedText>
                      <Feather name="chevron-down" size={16} color={theme.textSecondary} />
                    </Pressable>
                  )}
                </>
              ) : (
                <ThemedText variant="secondary" style={styles.emptyText}>
                  No transactions in this category yet
                </ThemedText>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    marginBottom: Spacing.md,
  },
  categoryCardContent: {
    padding: Spacing.lg,
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
  categoryRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
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
  loadMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: "500",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 60 : 40,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingTop: Spacing.lg,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  modalHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    flex: 1,
  },
  modalCategoryDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  modalCloseButton: {
    padding: Spacing.xs,
  },
  modalScrollView: {
    flex: 1,
  },
  modalScrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing["4xl"],
  },
});

