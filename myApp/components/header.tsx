import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface HeaderProps {
  onAddTransaction: () => void;
}

export default function Header({ onAddTransaction }: HeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.logoContainer}>
          <LinearGradient colors={["#6366f1", "#9333ea"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.logoGradient}>
            <Text style={styles.logoIcon}>💰</Text>
          </LinearGradient>
          <View>
            <Text style={styles.logoText}>IndoCurrency</Text>
            <Text style={styles.logoSubtext}>Kelola keuangan Anda</Text>
          </View>
        </View>

        <TouchableOpacity onPress={onAddTransaction} activeOpacity={0.8}>
          <LinearGradient colors={["#6366f1", "#9333ea"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoGradient: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  logoIcon: {
    fontSize: 24,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6366f1",
  },
  logoSubtext: {
    fontSize: 12,
    color: "#6b7280",
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
});
