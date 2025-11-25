export interface Receipt {
  id: string;
  userId: string;
  imageUri: string;
  merchantName: string;
  totalAmount: number;
  currency: string;
  date: string;
  category: string;
  items?: ReceiptItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ReceiptItem {
  description: string;
  amount: number;
}

export interface Transaction {
  id: string;
  accountId: string;
  userId: string;
  amount: number;
  date: string;
  merchantName: string;
  category: string;
  pending: boolean;
  receiptId?: string;
  createdAt: string;
}

export interface Account {
  id: string;
  userId: string;
  institutionName: string;
  accountName: string;
  accountType: "credit" | "checking" | "savings";
  accountMask: string;
  balance: number;
  isActive: boolean;
  lastSyncedAt: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  subcategories?: string[];
}

export const CATEGORIES: Category[] = [
  { id: "food", name: "Food & Dining", icon: "coffee", color: "#F59E0B" },
  { id: "transportation", name: "Transportation", icon: "truck", color: "#3B82F6" },
  { id: "shopping", name: "Shopping", icon: "shopping-bag", color: "#EC4899" },
  { id: "utilities", name: "Utilities", icon: "zap", color: "#8B5CF6" },
  { id: "healthcare", name: "Healthcare", icon: "heart", color: "#EF4444" },
  { id: "entertainment", name: "Entertainment", icon: "film", color: "#10B981" },
  { id: "travel", name: "Travel", icon: "map", color: "#06B6D4" },
  { id: "other", name: "Other", icon: "more-horizontal", color: "#6B7280" },
];
