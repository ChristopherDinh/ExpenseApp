import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ReceiptsScreen from "@/screens/ReceiptsScreen";
import ReceiptProcessScreen from "@/screens/ReceiptProcessScreen";
import { getCommonScreenOptions } from "@/navigation/screenOptions";
import { Receipt } from "@/types";

export type ReceiptsStackParamList = {
  Receipts: undefined;
  ReceiptProcess: {
    imageUri: string;
    existingReceipt?: Receipt;
  };
};

const Stack = createNativeStackNavigator<ReceiptsStackParamList>();

export default function ReceiptsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={getCommonScreenOptions}>
      <Stack.Screen
        name="Receipts"
        component={ReceiptsScreen}
        options={{
          headerTitle: "Receipts",
        }}
      />
      <Stack.Screen
        name="ReceiptProcess"
        component={ReceiptProcessScreen}
        options={{
          headerTitle: "Process Receipt",
          presentation: "modal",
        }}
      />
    </Stack.Navigator>
  );
}
