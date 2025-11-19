import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, ActivityIndicator } from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000";

export function DetailPage({ route }) {
  const incomingProduct = route.params?.product;
  const productId = incomingProduct?.id || route.params?.productId;

  const [product, setProduct] = useState(incomingProduct || null);
  const [loading, setLoading] = useState(!incomingProduct && !!productId);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!productId) return;
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/products/${productId}`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError("No se pudo cargar el detalle desde la base de datos.");
      } finally {
        setLoading(false);
      }
    };

    if (!incomingProduct && productId) {
      fetchDetail();
    }
  }, [incomingProduct, productId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#22c55e" />
          <Text style={styles.statusText}>Cargando detalle...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>{error || "No se encontró el detalle."}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.category}>{product.category}</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Precio:</Text>
          <Text style={styles.value}>
            $
            {typeof product.price === "number"
              ? product.price.toFixed(2)
              : parseFloat(product.price || 0).toFixed(2)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Stock:</Text>
          <Text style={styles.value}>{product.stock} uds</Text>
        </View>
        <Text style={styles.description}>{product.description}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 16
  },
  card: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#1f2937",
    gap: 10
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12
  },
  statusText: {
    color: "#9ca3af",
    fontSize: 14,
    textAlign: "center"
  },
  title: {
    color: "#e5e7eb",
    fontSize: 22,
    fontWeight: "800"
  },
  category: {
    color: "#22c55e",
    fontSize: 14,
    fontWeight: "700"
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  label: {
    color: "#9ca3af",
    fontSize: 14
  },
  value: {
    color: "#e5e7eb",
    fontSize: 14,
    fontWeight: "700"
  },
  description: {
    color: "#cbd5e1",
    fontSize: 15,
    lineHeight: 21,
    marginTop: 6
  }
});
