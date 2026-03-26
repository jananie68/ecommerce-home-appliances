import React, { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { useAuth } from "../contexts/AuthContext";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!email || !password) {
      Alert.alert("Missing fields", "Email and password are required.");
      return;
    }

    setSubmitting(true);
    try {
      await login({ email, password });
      navigation.goBack();
    } catch (error) {
      // handled inside login
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={{ flex: 1, padding: 20, gap: 12 }}>
      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 24, fontWeight: "700" }}>Welcome back</Text>
        <Text style={{ color: "#6b7280" }}>Sign in to manage orders and wishlist.</Text>
      </View>

      <View style={{ gap: 12 }}>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Email"
          style={{
            backgroundColor: "#fff",
            padding: 14,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#e5e7eb"
          }}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          style={{
            backgroundColor: "#fff",
            padding: 14,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#e5e7eb"
          }}
        />
      </View>

      <Pressable
        onPress={handleSubmit}
        disabled={submitting}
        style={{
          backgroundColor: submitting ? "#93c5fd" : "#2563eb",
          paddingVertical: 14,
          borderRadius: 10,
          alignItems: "center"
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
          {submitting ? "Signing in..." : "Sign in"}
        </Text>
      </Pressable>
    </View>
  );
}
