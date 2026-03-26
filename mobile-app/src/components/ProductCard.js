import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { buildImageUrl } from "../api/client";

export default function ProductCard({ product, onPress }) {
  const imageUrl = buildImageUrl(product.images?.[0]);
  const price = product.discountPrice || product.price;

  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 12,
        gap: 8,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2
      }}
    >
      <View style={{ height: 140, borderRadius: 10, overflow: "hidden", backgroundColor: "#eef2f7" }}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            resizeMode="cover"
            style={{ width: "100%", height: "100%" }}
          />
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text style={{ color: "#6b7280" }}>No image</Text>
          </View>
        )}
      </View>

      <View style={{ gap: 4 }}>
        <Text numberOfLines={1} style={{ fontSize: 16, fontWeight: "600" }}>
          {product.name}
        </Text>
        <Text numberOfLines={1} style={{ color: "#6b7280" }}>
          {product.brand || product.category || ""}
        </Text>
        <Text style={{ fontSize: 16, fontWeight: "700", color: "#111827" }}>
          ₹{price?.toLocaleString?.("en-IN") || price}
        </Text>
      </View>
    </Pressable>
  );
}
