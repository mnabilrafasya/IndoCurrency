import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Footer() {
  return (
    <View style={styles.footer}>
      <View style={styles.footerContent}>
        <Text style={styles.footerText}>Made with by IndoCurrency Team</Text>
        <Text style={styles.copyright}>© {new Date().getFullYear()} IndoCurrency. All rights reserved.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingVertical: 16,
  },
  footerContent: {
    alignItems: "center",
    gap: 4,
  },
  footerText: {
    color: "#6b7280",
    fontSize: 14,
  },
  copyright: {
    color: "#9ca3af",
    fontSize: 12,
  },
});
