import React from "react";
import { ActivityIndicator, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import ProductDetailsScreen from "../screens/ProductDetailsScreen";
import ProductsScreen from "../screens/ProductsScreen";
import { useAuth } from "../contexts/AuthContext";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { initializing } = useAuth();

  if (initializing) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerTitleStyle: { fontWeight: "600" },
        contentStyle: { backgroundColor: "#f6f8fb" }
      }}
    >
      <Stack.Screen name="Products" component={ProductsScreen} options={{ title: "Products" }} />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{ title: "Details" }}
      />
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Sign in" }} />
    </Stack.Navigator>
  );
}
