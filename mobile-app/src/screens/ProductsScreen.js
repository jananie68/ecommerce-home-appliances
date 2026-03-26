import React, { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from "react-native";
import ProductCard from "../components/ProductCard";
import { client } from "../api/client";
import { useAuth } from "../contexts/AuthContext";
import { Pressable } from "react-native";

export default function ProductsScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={user ? logout : () => navigation.navigate("Login")}
          style={{ padding: 6 }}
        >
          <Text style={{ color: "#2563eb", fontWeight: "600" }}>{user ? "Sign out" : "Sign in"}</Text>
        </Pressable>
      )
    });
  }, [navigation, user, logout]);

  async function fetchProducts() {
    try {
      const { data } = await client.get("/products");
      setProducts(data.products || []);
    } catch (error) {
      console.error("Failed to load products", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 12 }}>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={() => navigation.navigate("ProductDetails", { productId: item._id })} />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchProducts(); }} />
        }
        ListEmptyComponent={() => (
          <View style={{ alignItems: "center", marginTop: 32 }}>
            <Text style={{ color: "#6b7280" }}>No products available.</Text>
          </View>
        )}
      />
    </View>
  );
}
