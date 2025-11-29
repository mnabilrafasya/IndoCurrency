// src/pages/home.tsx - Integrated with Backend API

import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Alert, RefreshControl } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { transactionAPI, accountAPI } from "../services/api";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface Transaction {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  description: string;
  date: string;
  category: Category;
  account: {
    id: string;
    name: string;
    icon: string;
  };
}

interface Account {
  id: string;
  name: string;
  balance: number;
  icon: string;
}

interface TransactionStats {
  totalIncome: number;
  totalExpense: number;
  totalBalance: number;
}

const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [stats, setStats] = useState<TransactionStats>({
    totalIncome: 0,
    totalExpense: 0,
    totalBalance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Load user error:", error);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);

      // Get current month date range
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

      // Fetch data parallel
      const [statsData, transactionsData, accountsData] = await Promise.all([transactionAPI.getStats({ startDate, endDate }), transactionAPI.getAll({ startDate, endDate }), accountAPI.getAll()]);

      setStats(statsData);
      setTransactions(transactionsData);
      setAccounts(accountsData);
    } catch (error: any) {
      console.error("Load data error:", error);
      Alert.alert("Error", error.response?.data?.error || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleAddTransaction = () => {
    console.log("Tambah transaksi");
    // Navigate to AddTransaction screen
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Memuat data...</Text>
      </View>
    );
  }

  const recentTransactions = transactions.slice(0, 5);

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Halo,</Text>
          <Text style={styles.userName}>{user?.name || "User"}</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Saldo</Text>
        <Text style={styles.balanceAmount}>Rp {stats.totalBalance.toLocaleString("id-ID")}</Text>

        <View style={styles.balanceRow}>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceItemIcon}>📈</Text>
            <View>
              <Text style={styles.balanceItemLabel}>Pemasukan</Text>
              <Text style={styles.incomeAmount}>Rp {stats.totalIncome.toLocaleString("id-ID")}</Text>
            </View>
          </View>

          <View style={styles.balanceDivider} />

          <View style={styles.balanceItem}>
            <Text style={styles.balanceItemIcon}>📉</Text>
            <View>
              <Text style={styles.balanceItemLabel}>Pengeluaran</Text>
              <Text style={styles.expenseAmount}>Rp {stats.totalExpense.toLocaleString("id-ID")}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickActionButton} onPress={handleAddTransaction}>
          <View style={styles.quickActionIcon}>
            <Text style={styles.quickActionEmoji}>➕</Text>
          </View>
          <Text style={styles.quickActionText}>Tambah</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickActionButton}>
          <View style={styles.quickActionIcon}>
            <Text style={styles.quickActionEmoji}>📋</Text>
          </View>
          <Text style={styles.quickActionText}>Riwayat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickActionButton}>
          <View style={styles.quickActionIcon}>
            <Text style={styles.quickActionEmoji}>📊</Text>
          </View>
          <Text style={styles.quickActionText}>Laporan</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickActionButton}>
          <View style={styles.quickActionIcon}>
            <Text style={styles.quickActionEmoji}>💳</Text>
          </View>
          <Text style={styles.quickActionText}>Akun</Text>
        </TouchableOpacity>
      </View>

      {/* Accounts Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Akun Keuangan</Text>
          <Text style={styles.seeAll}>Lihat Semua →</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {accounts.length === 0 ? (
            <Text style={styles.emptyText}>Belum ada akun keuangan</Text>
          ) : (
            accounts.slice(0, 3).map((account) => (
              <View key={account.id} style={styles.accountCard}>
                <Text style={styles.accountIcon}>{account.icon}</Text>
                <Text style={styles.accountName}>{account.name}</Text>
                <Text style={styles.accountBalance}>Rp {account.balance.toLocaleString("id-ID")}</Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Transaksi Terbaru</Text>
          <Text style={styles.seeAll}>Lihat Semua →</Text>
        </View>

        {recentTransactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>Belum ada transaksi</Text>
            <TouchableOpacity style={styles.emptyButton} onPress={handleAddTransaction}>
              <Text style={styles.emptyButtonText}>Tambah Transaksi</Text>
            </TouchableOpacity>
          </View>
        ) : (
          recentTransactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionLeft}>
                <View style={styles.transactionIcon}>
                  <Text>{transaction.category?.icon || "💰"}</Text>
                </View>
                <View>
                  <Text style={styles.transactionCategory}>{transaction.category?.name}</Text>
                  <Text style={styles.transactionDescription}>{transaction.description}</Text>
                </View>
              </View>

              <Text style={[styles.transactionAmount, transaction.type === "INCOME" ? styles.incomeText : styles.expenseText]}>
                {transaction.type === "INCOME" ? "+" : "-"}Rp {transaction.amount.toLocaleString("id-ID")}
              </Text>
            </View>
          ))
        )}
      </View>

      {/* Floating Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddTransaction}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F6FA",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#fff",
  },
  greeting: { fontSize: 16, color: "#6B7280" },
  userName: { fontSize: 28, fontWeight: "700", color: "#111827" },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  profileIcon: { fontSize: 28 },
  balanceCard: {
    margin: 20,
    padding: 24,
    backgroundColor: "#4F46E5",
    borderRadius: 20,
    elevation: 8,
  },
  balanceLabel: { fontSize: 14, color: "rgba(255,255,255,0.8)" },
  balanceAmount: {
    fontSize: 36,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 24,
  },
  balanceRow: { flexDirection: "row", justifyContent: "space-around" },
  balanceItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  balanceItemIcon: { fontSize: 28 },
  balanceItemLabel: { fontSize: 12, color: "rgba(255,255,255,0.8)" },
  incomeAmount: { fontSize: 16, fontWeight: "600", color: "#10B981" },
  expenseAmount: { fontSize: 16, fontWeight: "600", color: "#EF4444" },
  balanceDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  quickActionButton: { alignItems: "center" },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    elevation: 3,
  },
  quickActionEmoji: { fontSize: 26 },
  quickActionText: { fontSize: 14, color: "#6B7280", fontWeight: "500" },
  section: { paddingHorizontal: 20, marginBottom: 32 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: "#111827" },
  seeAll: { fontSize: 14, color: "#4F46E5", fontWeight: "500" },
  accountCard: {
    width: 140,
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginRight: 16,
    alignItems: "center",
    elevation: 3,
  },
  accountIcon: { fontSize: 34, marginBottom: 8 },
  accountName: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
    marginBottom: 4,
    textAlign: "center",
  },
  accountBalance: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4F46E5",
    textAlign: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 28,
  },
  emptyIcon: { fontSize: 34, marginBottom: 8 },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 16,
  },
  emptyButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  transactionLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  transactionIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  transactionCategory: { fontSize: 16, fontWeight: "500", color: "#111827" },
  transactionDescription: { fontSize: 14, color: "#6B7280" },
  transactionAmount: { fontSize: 16, fontWeight: "600" },
  incomeText: { color: "#10B981" },
  expenseText: { color: "#EF4444" },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
  fabIcon: { fontSize: 34, color: "#fff" },
});
