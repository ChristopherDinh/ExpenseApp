import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ReceiptsScreen from "@/screens/ReceiptsScreen";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type ReceiptsStackParamList = {
  Receipts: undefined;
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
    </Stack.Navigator>
  );
}
