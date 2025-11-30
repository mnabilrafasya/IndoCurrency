// myApp/pages/history.tsx

import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { transactionAPI } from "../services/api";

interface Transaction {
  id: number;
  type: "INCOME" | "EXPENSE";
  amount: number;
  description: string;
  date: string;
  category: { name: string; icon: string };
  account: { id: number; name: string; icon: string };
}

export default function History() {
  const navigation = useNavigation();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterType, setFilterType] = useState<"ALL" | "INCOME" | "EXPENSE">("ALL");

  useEffect(() => {
    loadTransactions();
  }, [filterType]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filterType !== "ALL") {
        params.type = filterType.toLowerCase();
      }
      const data = await transactionAPI.getAll(params);
      setTransactions(data);
    } catch (error: any) {
      console.error("Load transactions error:", error);
      Alert.alert("Error", error.response?.data?.error || "Gagal memuat transaksi");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  };

  const handleDeleteTransaction = async (id: number) => {
    Alert.alert("Konfirmasi", "Hapus transaksi ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          try {
            await transactionAPI.delete(id);
            Alert.alert("Sukses", "Transaksi berhasil dihapus");
            loadTransactions();
          } catch (error: any) {
            Alert.alert("Error", error.response?.data?.error || "Gagal menghapus");
          }
        },
      },
    ]);
  };

  const groupedTransactions = transactions.reduce((groups: any, transaction) => {
    const date = new Date(transaction.date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    if (!groups[date]) groups[date] = [];
    groups[date].push(transaction);
    return groups;
  }, {});

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Kembali</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Riwayat</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Memuat...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Riwayat</Text>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity style={[styles.filterButton, filterType === "ALL" && styles.filterButtonActive]} onPress={() => setFilterType("ALL")}>
          <Text style={[styles.filterButtonText, filterType === "ALL" && styles.filterButtonTextActive]}>Semua</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterButton, filterType === "INCOME" && styles.filterButtonActiveIncome]} onPress={() => setFilterType("INCOME")}>
          <Text style={[styles.filterButtonText, filterType === "INCOME" && styles.filterButtonTextActive]}>Pemasukan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterButton, filterType === "EXPENSE" && styles.filterButtonActiveExpense]} onPress={() => setFilterType("EXPENSE")}>
          <Text style={[styles.filterButtonText, filterType === "EXPENSE" && styles.filterButtonTextActive]}>Pengeluaran</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {Object.keys(groupedTransactions).length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>Belum ada transaksi</Text>
          </View>
        ) : (
          Object.keys(groupedTransactions).map((date) => (
            <View key={date} style={styles.dateGroup}>
              <Text style={styles.dateHeader}>{date}</Text>
              {groupedTransactions[date].map((transaction: Transaction) => (
                <TouchableOpacity key={transaction.id} style={styles.transactionCard} onLongPress={() => handleDeleteTransaction(transaction.id)}>
                  <View style={styles.transactionLeft}>
                    <View style={[styles.transactionIcon, { backgroundColor: transaction.type === "INCOME" ? "#DCFCE7" : "#FEE2E2" }]}>
                      <Text style={styles.transactionIconText}>{transaction.category.icon}</Text>
                    </View>
                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionCategory}>{transaction.category.name}</Text>
                      <Text style={styles.transactionDescription}>{transaction.description || "Tidak ada deskripsi"}</Text>
                      <Text style={styles.transactionAccount}>
                        {transaction.account.icon} {transaction.account.name}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.transactionAmount, { color: transaction.type === "INCOME" ? "#10B981" : "#EF4444" }]}>
                    {transaction.type === "INCOME" ? "+" : "-"}Rp {transaction.amount.toLocaleString("id-ID")}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))
        )}
        <View style={{ height: 80 }} />
      </ScrollView>

      {transactions.length > 0 && (
        <View style={styles.summaryBar}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total</Text>
            <Text style={styles.summaryValue}>{transactions.length}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Pemasukan</Text>
            <Text style={[styles.summaryValue, { color: "#10B981" }]}>{transactions.filter((t) => t.type === "INCOME").length}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Pengeluaran</Text>
            <Text style={[styles.summaryValue, { color: "#EF4444" }]}>{transactions.filter((t) => t.type === "EXPENSE").length}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6FA" },
  header: { padding: 20, paddingTop: 50, backgroundColor: "#fff" },
  backButton: { marginBottom: 10 },
  backButtonText: { fontSize: 16, color: "#4F46E5", fontWeight: "600" },
  headerTitle: { fontSize: 28, fontWeight: "700", color: "#111827" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, fontSize: 16, color: "#6B7280" },
  filterContainer: { flexDirection: "row", padding: 16, gap: 8, backgroundColor: "#fff" },
  filterButton: { flex: 1, paddingVertical: 10, borderRadius: 12, backgroundColor: "#F3F4F6", alignItems: "center" },
  filterButtonActive: { backgroundColor: "#4F46E5" },
  filterButtonActiveIncome: { backgroundColor: "#10B981" },
  filterButtonActiveExpense: { backgroundColor: "#EF4444" },
  filterButtonText: { fontSize: 14, fontWeight: "600", color: "#6B7280" },
  filterButtonTextActive: { color: "#fff" },
  scrollView: { flex: 1 },
  dateGroup: { marginTop: 16, paddingHorizontal: 16 },
  dateHeader: { fontSize: 14, fontWeight: "600", color: "#6B7280", marginBottom: 12 },
  transactionCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
    elevation: 2,
  },
  transactionLeft: { flexDirection: "row", alignItems: "center", flex: 1, gap: 12 },
  transactionIcon: { width: 48, height: 48, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  transactionIconText: { fontSize: 24 },
  transactionInfo: { flex: 1 },
  transactionCategory: { fontSize: 16, fontWeight: "600", color: "#111827", marginBottom: 2 },
  transactionDescription: { fontSize: 14, color: "#6B7280", marginBottom: 4 },
  transactionAccount: { fontSize: 12, color: "#9CA3AF" },
  transactionAmount: { fontSize: 16, fontWeight: "700" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 80 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyText: { fontSize: 18, fontWeight: "600", color: "#111827", textAlign: "center" },
  summaryBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    elevation: 8,
  },
  summaryItem: { flex: 1, alignItems: "center" },
  summaryLabel: { fontSize: 12, color: "#6B7280", marginBottom: 4 },
  summaryValue: { fontSize: 18, fontWeight: "700", color: "#111827" },
  summaryDivider: { width: 1, backgroundColor: "#E5E7EB", marginHorizontal: 8 },
});
