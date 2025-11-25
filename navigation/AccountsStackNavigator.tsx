import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AccountsScreen from "@/screens/AccountsScreen";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type AccountsStackParamList = {
  Accounts: undefined;
};

const Stack = createNativeStackNavigator<AccountsStackParamList>();

export default function AccountsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={getCommonScreenOptions}>
      <Stack.Screen
        name="Accounts"
        component={AccountsScreen}
        options={{
          headerTitle: "Accounts",
        }}
      />
    </Stack.Navigator>
  );
}
