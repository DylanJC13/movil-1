import React from "react";
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from "react-native";

export function MainPage({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Patrón Master–Detail</Text>
        <Text style={styles.subtitle}>
          Ejemplo simple de navegación Maestro (lista) → Detalle (ficha).
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Master")}
        >
          <Text style={styles.buttonText}>Ir a Maestro</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
    padding: 24
  },
  card: {
    backgroundColor: "#1f2937",
    borderRadius: 14,
    padding: 24,
    width: "100%"
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#e5e7eb",
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: "#cbd5e1",
    marginBottom: 18,
    lineHeight: 22
  },
  button: {
    backgroundColor: "#22c55e",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center"
  },
  buttonText: {
    color: "#0b1224",
    fontSize: 16,
    fontWeight: "700"
  }
});
