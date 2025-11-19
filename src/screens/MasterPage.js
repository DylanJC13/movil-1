import React, { useEffect, useState, useCallback } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000";

export function MasterPage({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/products`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      setError("No se pudo cargar el catálogo desde la base de datos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate("Detail", { product: item })}
    >
      <View style={styles.itemRow}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
      </View>
      <Text style={styles.itemMeta}>{item.category}</Text>
      <Text style={styles.itemMeta}>Stock: {item.stock}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#22c55e" />
          <Text style={styles.statusText}>Cargando catálogo...</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchProducts} tintColor="#22c55e" />
          }
          ListEmptyComponent={
            <Text style={styles.statusText}>
              {error || "No hay productos en la base de datos."}
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a"
  },
  list: {
    padding: 16,
    gap: 12
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
  item: {
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#1f2937"
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6
  },
  itemName: {
    color: "#e5e7eb",
    fontSize: 16,
    fontWeight: "700"
  },
  itemPrice: {
    color: "#22c55e",
    fontSize: 15,
    fontWeight: "700"
  },
  itemMeta: {
    color: "#9ca3af",
    fontSize: 13
  }
});
