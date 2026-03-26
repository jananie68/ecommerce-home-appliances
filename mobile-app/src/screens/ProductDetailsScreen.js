import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";
import { buildImageUrl, client } from "../api/client";

export default function ProductDetailsScreen({ route }) {
  const { productId } = route.params || {};
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await client.get(`/products/${productId}`);
        setProduct(data.product);
      } catch (error) {
        console.error("Failed to load product", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: "#6b7280" }}>Product not found.</Text>
      </View>
    );
  }

  const imageUrl = buildImageUrl(product.images?.[0]);
  const price = product.discountPrice || product.price;

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
      <View style={{ height: 260, borderRadius: 16, overflow: "hidden", backgroundColor: "#eef2f7" }}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} resizeMode="cover" style={{ width: "100%", height: "100%" }} />
        ) : (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: "#6b7280" }}>No image available</Text>
          </View>
        )}
      </View>

      <View style={{ gap: 6 }}>
        <Text style={{ fontSize: 22, fontWeight: "700" }}>{product.name}</Text>
        <Text style={{ color: "#6b7280" }}>{product.brand || product.category}</Text>
        <Text style={{ fontSize: 20, fontWeight: "700", color: "#111827" }}>
          ₹{price?.toLocaleString?.("en-IN") || price}
        </Text>
      </View>

      {product.shortDescription ? (
        <View style={{ gap: 4 }}>
          <Text style={{ fontWeight: "700" }}>Overview</Text>
          <Text style={{ lineHeight: 20, color: "#374151" }}>{product.shortDescription}</Text>
        </View>
      ) : null}

      {product.description ? (
        <View style={{ gap: 4 }}>
          <Text style={{ fontWeight: "700" }}>Description</Text>
          <Text style={{ lineHeight: 20, color: "#374151" }}>{product.description}</Text>
        </View>
      ) : null}

      {Array.isArray(product.specifications) && product.specifications.length ? (
        <View style={{ gap: 8 }}>
          <Text style={{ fontWeight: "700" }}>Specifications</Text>
          <View style={{ gap: 8 }}>
            {product.specifications.map((spec) => (
              <View
                key={`${spec.label}-${spec.value}`}
                style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}
              >
                <Text style={{ color: "#6b7280", flex: 1 }}>{spec.label}</Text>
                <Text style={{ fontWeight: "600", flex: 1 }}>{spec.value}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}
