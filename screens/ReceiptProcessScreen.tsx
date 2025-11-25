import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TextInput,
  Pressable,
  Platform,
  Alert,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import ScreenKeyboardAwareScrollView from "@/components/ScreenKeyboardAwareScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import CategoryBadge from "@/components/CategoryBadge";
import { useTheme } from "@/hooks/useTheme";
import { storage } from "@/utils/storage";
import { Receipt, CATEGORIES } from "@/types";
import { Spacing, BorderRadius, Typography } from "@/constants/theme";
import { ReceiptsStackParamList } from "@/navigation/ReceiptsStackNavigator";

type ReceiptProcessScreenRouteProp = RouteProp<ReceiptsStackParamList, "ReceiptProcess">;
type ReceiptProcessScreenNavigationProp = NativeStackNavigationProp<ReceiptsStackParamList, "ReceiptProcess">;

interface OCRResult {
  merchantName: string;
  totalAmount: string;
  date: string;
  items: Array<{ description: string; amount: number }>;
  confidence: number;
}

export default function ReceiptProcessScreen() {
  const navigation = useNavigation<ReceiptProcessScreenNavigationProp>();
  const route = useRoute<ReceiptProcessScreenRouteProp>();
  const { theme } = useTheme();
  const { imageUri, existingReceipt } = route.params;

  const [isProcessing, setIsProcessing] = useState(false);
  const [merchantName, setMerchantName] = useState(existingReceipt?.merchantName || "");
  const [amount, setAmount] = useState(
    existingReceipt?.totalAmount ? existingReceipt.totalAmount.toString() : ""
  );
  const [date, setDate] = useState(
    existingReceipt?.date
      ? new Date(existingReceipt.date).toLocaleDateString("en-US")
      : new Date().toLocaleDateString("en-US")
  );
  const [selectedCategory, setSelectedCategory] = useState(
    existingReceipt?.category || "other"
  );
  const [ocrProcessed, setOcrProcessed] = useState(false);

  const handleOCRProcess = async () => {
    setIsProcessing(true);
    if (Platform.OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockOCRResult: OCRResult = {
        merchantName: "Starbucks Coffee",
        totalAmount: "12.75",
        date: new Date().toLocaleDateString("en-US"),
        items: [
          { description: "Grande Latte", amount: 5.45 },
          { description: "Croissant", amount: 4.25 },
          { description: "Tax", amount: 0.89 },
          { description: "Tip", amount: 2.16 },
        ],
        confidence: 0.92,
      };

      setMerchantName(mockOCRResult.merchantName);
      setAmount(mockOCRResult.totalAmount);
      setDate(mockOCRResult.date);
      setSelectedCategory("food");
      setOcrProcessed(true);

      if (Platform.OS === "ios") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      Alert.alert("OCR Failed", "Unable to process receipt. Please enter details manually.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = async () => {
    if (!merchantName.trim()) {
      Alert.alert("Missing Information", "Please enter a merchant name.");
      return;
    }

    const parsedAmount = parseFloat(amount) || 0;

    if (Platform.OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const receiptData: Receipt = {
      id: existingReceipt?.id || Date.now().toString(),
      userId: "1",
      imageUri,
      merchantName: merchantName.trim(),
      totalAmount: parsedAmount,
      currency: "USD",
      date: new Date(date).toISOString(),
      category: selectedCategory,
      createdAt: existingReceipt?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await storage.saveReceipt(receiptData);

    if (Platform.OS === "ios") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    navigation.goBack();
  };

  return (
    <ScreenKeyboardAwareScrollView>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.receiptImage} resizeMode="cover" />
        {!ocrProcessed && !existingReceipt && (
          <View style={styles.ocrOverlay}>
            <Pressable
              style={({ pressed }) => [
                styles.ocrButton,
                { backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1 },
              ]}
              onPress={handleOCRProcess}
              disabled={isProcessing}
            >
              <Feather name={isProcessing ? "loader" : "cpu"} size={20} color="#FFFFFF" />
              <ThemedText style={styles.ocrButtonText}>
                {isProcessing ? "Processing..." : "Auto-Extract Details"}
              </ThemedText>
            </Pressable>
          </View>
        )}
      </View>

      {ocrProcessed && (
        <View style={[styles.ocrBanner, { backgroundColor: theme.success + "20" }]}>
          <Feather name="check-circle" size={16} color={theme.success} />
          <ThemedText style={[styles.ocrBannerText, { color: theme.success }]}>
            Details extracted automatically (92% confidence)
          </ThemedText>
        </View>
      )}

      <View style={styles.formContainer}>
        <ThemedText type="h4" style={styles.sectionTitle}>
          Receipt Details
        </ThemedText>

        <Card style={styles.formCard}>
          <View style={styles.inputGroup}>
            <ThemedText variant="secondary" style={styles.label}>
              Merchant Name
            </ThemedText>
            <TextInput
              style={[
                styles.input,
                { color: theme.text, borderColor: theme.border, backgroundColor: theme.backgroundSecondary },
              ]}
              value={merchantName}
              onChangeText={setMerchantName}
              placeholder="Enter merchant name"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText variant="secondary" style={styles.label}>
              Total Amount
            </ThemedText>
            <View style={styles.amountInputContainer}>
              <ThemedText style={styles.currencySymbol}>$</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  styles.amountInput,
                  { color: theme.text, borderColor: theme.border, backgroundColor: theme.backgroundSecondary },
                ]}
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor={theme.textSecondary}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText variant="secondary" style={styles.label}>
              Date
            </ThemedText>
            <TextInput
              style={[
                styles.input,
                { color: theme.text, borderColor: theme.border, backgroundColor: theme.backgroundSecondary },
              ]}
              value={date}
              onChangeText={setDate}
              placeholder="MM/DD/YYYY"
              placeholderTextColor={theme.textSecondary}
            />
          </View>
        </Card>

        <ThemedText type="h4" style={styles.sectionTitle}>
          Category
        </ThemedText>

        <View style={styles.categoryGrid}>
          {CATEGORIES.map((category) => (
            <Pressable
              key={category.id}
              style={({ pressed }) => [
                styles.categoryItem,
                selectedCategory === category.id && [
                  styles.categorySelected,
                  { borderColor: theme.primary },
                ],
                { opacity: pressed ? 0.8 : 1 },
              ]}
              onPress={() => {
                setSelectedCategory(category.id);
                if (Platform.OS === "ios") {
                  Haptics.selectionAsync();
                }
              }}
            >
              <CategoryBadge category={category.id} size="large" />
              <ThemedText
                style={[
                  styles.categoryName,
                  selectedCategory === category.id && { color: theme.primary },
                ]}
              >
                {category.name.split(" ")[0]}
              </ThemedText>
            </Pressable>
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            { backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={handleSave}
        >
          <Feather name="check" size={20} color="#FFFFFF" />
          <ThemedText style={styles.saveButtonText}>Save Receipt</ThemedText>
        </Pressable>
      </View>
    </ScreenKeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    height: 240,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.md,
    overflow: "hidden",
    position: "relative",
  },
  receiptImage: {
    width: "100%",
    height: "100%",
  },
  ocrOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.md,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  ocrButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.sm,
    gap: Spacing.sm,
  },
  ocrButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  ocrBanner: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    gap: Spacing.sm,
  },
  ocrBannerText: {
    fontSize: 13,
    fontWeight: "500",
  },
  formContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing["4xl"],
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  formCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: 13,
    marginBottom: Spacing.xs,
  },
  input: {
    height: Spacing.inputHeight,
    borderWidth: 1,
    borderRadius: BorderRadius.xs,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: "600",
    marginRight: Spacing.sm,
  },
  amountInput: {
    flex: 1,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  categoryItem: {
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderColor: "transparent",
    width: "23%",
  },
  categorySelected: {
    borderWidth: 2,
  },
  categoryName: {
    fontSize: 11,
    marginTop: Spacing.xs,
    textAlign: "center",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
});
