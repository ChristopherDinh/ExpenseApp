import React, { useState, useEffect } from "react";
import { View, StyleSheet, Pressable, Alert, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import ScreenScrollView from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import EmptyState from "@/components/EmptyState";
import FloatingActionButton from "@/components/FloatingActionButton";
import { useTheme } from "@/hooks/useTheme";
import { storage } from "@/utils/storage";
import { Receipt } from "@/types";
import { Spacing } from "@/constants/theme";

export default function ReceiptsScreen() {
  const { theme } = useTheme();
  const [receipts, setReceipts] = useState<Receipt[]>([]);

  useEffect(() => {
    loadReceipts();
  }, []);

  const loadReceipts = async () => {
    const data = await storage.getReceipts();
    setReceipts(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  const handleCameraPress = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== "granted") {
      Alert.alert("Permission needed", "Camera permission is required to scan receipts");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: "images",
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await handleReceiptCapture(result.assets[0].uri);
    }
  };

  const handleReceiptCapture = async (imageUri: string) => {
    const newReceipt: Receipt = {
      id: Date.now().toString(),
      userId: "1",
      imageUri,
      merchantName: "Sample Merchant",
      totalAmount: 0,
      currency: "USD",
      date: new Date().toISOString(),
      category: "other",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await storage.saveReceipt(newReceipt);
    await loadReceipts();
    
    Alert.alert(
      "Receipt Captured",
      "In the full version, this would use OCR to extract transaction details automatically.",
      [{ text: "OK" }]
    );
  };

  return (
    <View style={styles.container}>
      <ScreenScrollView>
        {receipts.length === 0 ? (
          <EmptyState
            image={require("@/assets/images/empty-states/no-receipts.png")}
            title="No Receipts Yet"
            description="Tap the camera button to scan your first receipt"
          />
        ) : (
          <View style={styles.grid}>
            {receipts.map((receipt) => (
              <Card key={receipt.id} style={styles.receiptCard}>
                <Image source={{ uri: receipt.imageUri }} style={styles.receiptImage} />
                <View style={styles.receiptInfo}>
                  <ThemedText style={styles.merchantName} numberOfLines={1}>
                    {receipt.merchantName}
                  </ThemedText>
                  <ThemedText variant="secondary" style={styles.receiptDate}>
                    {new Date(receipt.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </ThemedText>
                  {receipt.totalAmount > 0 && (
                    <ThemedText style={styles.receiptAmount}>
                      ${receipt.totalAmount.toFixed(2)}
                    </ThemedText>
                  )}
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScreenScrollView>
      
      <FloatingActionButton onPress={handleCameraPress} icon="camera" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  receiptCard: {
    width: "48%",
    padding: 0,
    overflow: "hidden",
  },
  receiptImage: {
    width: "100%",
    height: 120,
    backgroundColor: "#f0f0f0",
  },
  receiptInfo: {
    padding: Spacing.md,
  },
  merchantName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  receiptDate: {
    fontSize: 12,
    marginBottom: Spacing.xs,
  },
  receiptAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
});

