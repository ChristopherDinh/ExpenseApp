import AsyncStorage from "@react-native-async-storage/async-storage";
import { Receipt, Transaction, Account } from "@/types";

const RECEIPTS_KEY = "receipts";
const TRANSACTIONS_KEY = "transactions";
const ACCOUNTS_KEY = "accounts";

export const storage = {
  async getReceipts(): Promise<Receipt[]> {
    try {
      const data = await AsyncStorage.getItem(RECEIPTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Failed to get receipts:", error);
      return [];
    }
  },

  async saveReceipt(receipt: Receipt): Promise<void> {
    try {
      const receipts = await this.getReceipts();
      const index = receipts.findIndex((r) => r.id === receipt.id);
      if (index >= 0) {
        receipts[index] = receipt;
      } else {
        receipts.push(receipt);
      }
      await AsyncStorage.setItem(RECEIPTS_KEY, JSON.stringify(receipts));
    } catch (error) {
      console.error("Failed to save receipt:", error);
      throw error;
    }
  },

  async deleteReceipt(id: string): Promise<void> {
    try {
      const receipts = await this.getReceipts();
      const filtered = receipts.filter((r) => r.id !== id);
      await AsyncStorage.setItem(RECEIPTS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error("Failed to delete receipt:", error);
      throw error;
    }
  },

  async getTransactions(): Promise<Transaction[]> {
    try {
      const data = await AsyncStorage.getItem(TRANSACTIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Failed to get transactions:", error);
      return [];
    }
  },

  async saveTransaction(transaction: Transaction): Promise<void> {
    try {
      const transactions = await this.getTransactions();
      const index = transactions.findIndex((t) => t.id === transaction.id);
      if (index >= 0) {
        transactions[index] = transaction;
      } else {
        transactions.push(transaction);
      }
      await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
    } catch (error) {
      console.error("Failed to save transaction:", error);
      throw error;
    }
  },

  async getAccounts(): Promise<Account[]> {
    try {
      const data = await AsyncStorage.getItem(ACCOUNTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Failed to get accounts:", error);
      return [];
    }
  },

  async saveAccount(account: Account): Promise<void> {
    try {
      const accounts = await this.getAccounts();
      const index = accounts.findIndex((a) => a.id === account.id);
      if (index >= 0) {
        accounts[index] = account;
      } else {
        accounts.push(account);
      }
      await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch (error) {
      console.error("Failed to save account:", error);
      throw error;
    }
  },

  async deleteAccount(id: string): Promise<void> {
    try {
      const accounts = await this.getAccounts();
      const filtered = accounts.filter((a) => a.id !== id);
      await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error("Failed to delete account:", error);
      throw error;
    }
  },

  async initializeMockData(): Promise<void> {
    const existingReceipts = await this.getReceipts();
    const existingAccounts = await this.getAccounts();
    const existingTransactions = await this.getTransactions();

    if (existingReceipts.length === 0 && existingAccounts.length === 0 && existingTransactions.length === 0) {
      const mockAccount: Account = {
        id: "acc1",
        userId: "1",
        institutionName: "Chase Bank",
        accountName: "Chase Freedom",
        accountType: "credit",
        accountMask: "4242",
        balance: 2850.50,
        isActive: true,
        lastSyncedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      const mockTransactions: Transaction[] = [
        {
          id: "txn1",
          accountId: "acc1",
          userId: "1",
          amount: 45.67,
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          merchantName: "Whole Foods Market",
          category: "food",
          pending: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: "txn2",
          accountId: "acc1",
          userId: "1",
          amount: 15.50,
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          merchantName: "Starbucks",
          category: "food",
          pending: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: "txn3",
          accountId: "acc1",
          userId: "1",
          amount: 89.99,
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          merchantName: "Shell Gas Station",
          category: "transportation",
          pending: false,
          createdAt: new Date().toISOString(),
        },
      ];

      await this.saveAccount(mockAccount);
      for (const transaction of mockTransactions) {
        await this.saveTransaction(transaction);
      }
    }
  },
};
