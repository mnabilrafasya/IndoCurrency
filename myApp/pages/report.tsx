// myApp/pages/report.tsx - Fixed with Manual Calculation

import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { transactionAPI } from "../services/api";

interface Transaction {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  description: string;
  date: string;
  category: {
    name: string;
    icon: string;
  };
}

interface CategoryStat {
  name: string;
  icon: string;
  amount: number;
  count: number;
  percentage: number;
}

interface TransactionStats {
  totalIncome: number;
  totalExpense: number;
  totalBalance: number;
  categories: CategoryStat[];
}

export default function Report() {
  const navigation = useNavigation();

  const [stats, setStats] = useState<TransactionStats>({
    totalIncome: 0,
    totalExpense: 0,
    totalBalance: 0,
    categories: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [period, setPeriod] = useState<"month" | "year">("month");

  useEffect(() => {
    loadStats();
  }, [period]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const now = new Date();
      let startDate, endDate;

      if (period === "month") {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);
      } else {
        startDate = new Date(now.getFullYear(), 0, 1);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(now.getFullYear(), 11, 31);
        endDate.setHours(23, 59, 59, 999);
      }

      console.log("📅 Report period:", {
        period,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      // ✅ Fetch ALL transactions first
      const allTransactions: Transaction[] = await transactionAPI.getAll();

      console.log("📝 Total transactions fetched:", allTransactions.length);
      console.log("🔍 Sample transaction:", allTransactions[0]);
      console.log("🔍 All transactions:", JSON.stringify(allTransactions, null, 2));

      // ✅ Filter transactions by date period
      const filteredTransactions = allTransactions.filter((t: Transaction) => {
        if (!t.date) {
          console.log(`⚠️ Transaction ${t.id} has no date, including it`);
          return true; // Include transactions without date
        }

        const transactionDate = new Date(t.date);

        // Check if date is valid
        if (isNaN(transactionDate.getTime())) {
          console.log(`⚠️ Transaction ${t.id} has invalid date: ${t.date}`);
          return false;
        }

        const isInRange = transactionDate >= startDate && transactionDate <= endDate;

        console.log(`📆 Transaction ${t.id}:`, {
          date: t.date,
          parsed: transactionDate.toISOString(),
          amount: t.amount,
          type: t.type,
          isInRange,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });

        return isInRange;
      });

      console.log("📊 Filtered transactions:", filteredTransactions.length);
      console.log("💰 Filtered data:", JSON.stringify(filteredTransactions, null, 2));

      // ✅ Calculate stats manually
      const totalIncome = filteredTransactions.filter((t: Transaction) => t.type === "INCOME").reduce((sum: number, t: Transaction) => sum + Number(t.amount || 0), 0);

      const totalExpense = filteredTransactions.filter((t: Transaction) => t.type === "EXPENSE").reduce((sum: number, t: Transaction) => sum + Number(t.amount || 0), 0);

      const totalBalance = totalIncome - totalExpense;

      // ✅ Calculate category breakdown (only expenses)
      const expenseTransactions = filteredTransactions.filter((t: Transaction) => t.type === "EXPENSE");

      const categoryMap = new Map<string, CategoryStat>();

      expenseTransactions.forEach((t: Transaction) => {
        const categoryName = t.category?.name || "Lainnya";
        const categoryIcon = t.category?.icon || "💰";

        if (categoryMap.has(categoryName)) {
          const existing = categoryMap.get(categoryName)!;
          existing.amount += Number(t.amount || 0);
          existing.count += 1;
        } else {
          categoryMap.set(categoryName, {
            name: categoryName,
            icon: categoryIcon,
            amount: Number(t.amount || 0),
            count: 1,
            percentage: 0,
          });
        }
      });

      // Calculate percentages
      const categories = Array.from(categoryMap.values()).map((cat) => ({
        ...cat,
        percentage: totalExpense > 0 ? Math.round((cat.amount / totalExpense) * 100) : 0,
      }));

      // Sort by amount descending
      categories.sort((a, b) => b.amount - a.amount);

      const finalStats = {
        totalIncome,
        totalExpense,
        totalBalance,
        categories,
      };

      console.log("✅ Final stats:", {
        income: totalIncome,
        expense: totalExpense,
        balance: totalBalance,
        categoriesCount: categories.length,
      });

      setStats(finalStats);
    } catch (error: any) {
      console.error("❌ Load stats error:", error);
      Alert.alert("Error", error.response?.data?.error || "Gagal memuat laporan");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  const getPeriodLabel = () => {
    const now = new Date();
    if (period === "month") {
      return now.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
    }
    return `Tahun ${now.getFullYear()}`;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Kembali</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Laporan</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Memuat...</Text>
        </View>
      </View>
    );
  }

  const savingsRate = stats.totalIncome > 0 ? ((stats.totalBalance / stats.totalIncome) * 100).toFixed(1) : "0.0";

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Laporan</Text>
      </View>

      {/* Period Selector */}
      <View style={styles.periodContainer}>
        <TouchableOpacity style={[styles.periodButton, period === "month" && styles.periodButtonActive]} onPress={() => setPeriod("month")}>
          <Text style={[styles.periodButtonText, period === "month" && styles.periodButtonTextActive]}>Bulan Ini</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.periodButton, period === "year" && styles.periodButtonActive]} onPress={() => setPeriod("year")}>
          <Text style={[styles.periodButtonText, period === "year" && styles.periodButtonTextActive]}>Tahun Ini</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.periodLabel}>{getPeriodLabel()}</Text>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, { backgroundColor: "#4F46E5" }]}>
          <Text style={styles.summaryIcon}>💰</Text>
          <Text style={styles.summaryLabel}>Saldo</Text>
          <Text style={styles.summaryAmount}>Rp {stats.totalBalance.toLocaleString("id-ID")}</Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: "#10B981" }]}>
          <Text style={styles.summaryIcon}>📈</Text>
          <Text style={styles.summaryLabel}>Pemasukan</Text>
          <Text style={styles.summaryAmount}>Rp {stats.totalIncome.toLocaleString("id-ID")}</Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: "#EF4444" }]}>
          <Text style={styles.summaryIcon}>📉</Text>
          <Text style={styles.summaryLabel}>Pengeluaran</Text>
          <Text style={styles.summaryAmount}>Rp {stats.totalExpense.toLocaleString("id-ID")}</Text>
        </View>
      </View>

      {/* Savings Rate */}
      <View style={styles.savingsCard}>
        <Text style={styles.savingsLabel}>Tingkat Tabungan</Text>
        <Text style={styles.savingsPercentage}>{savingsRate}%</Text>
        <Text style={styles.savingsDescription}>Dari total pemasukan Anda</Text>
      </View>

      {/* Category Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pengeluaran per Kategori</Text>

        {stats.categories.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyText}>Belum ada data pengeluaran</Text>
          </View>
        ) : (
          stats.categories.map((category, index) => (
            <View key={index} style={styles.categoryItem}>
              <View style={styles.categoryHeader}>
                <View style={styles.categoryLeft}>
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <View>
                    <Text style={styles.categoryName}>{category.name}</Text>
                    <Text style={styles.categoryCount}>{category.count} transaksi</Text>
                  </View>
                </View>
                <View style={styles.categoryRight}>
                  <Text style={styles.categoryAmount}>Rp {category.amount.toLocaleString("id-ID")}</Text>
                  <Text style={styles.categoryPercentage}>{category.percentage}%</Text>
                </View>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${category.percentage}%`, backgroundColor: getColor(index) }]} />
              </View>
            </View>
          ))
        )}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const getColor = (index: number) => {
  const colors = ["#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EC4899"];
  return colors[index % colors.length];
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6FA" },
  header: { padding: 20, paddingTop: 50, backgroundColor: "#fff" },
  backButton: { marginBottom: 10 },
  backButtonText: { fontSize: 16, color: "#4F46E5", fontWeight: "600" },
  headerTitle: { fontSize: 28, fontWeight: "700", color: "#111827" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, fontSize: 16, color: "#6B7280" },
  periodContainer: { flexDirection: "row", padding: 16, gap: 12, backgroundColor: "#fff" },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
  },
  periodButtonActive: { backgroundColor: "#4F46E5" },
  periodButtonText: { fontSize: 14, fontWeight: "600", color: "#6B7280" },
  periodButtonTextActive: { color: "#fff" },
  periodLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  summaryContainer: { padding: 16, gap: 12 },
  summaryCard: { borderRadius: 16, padding: 20, elevation: 4 },
  summaryIcon: { fontSize: 32, marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: "rgba(255,255,255,0.9)", marginBottom: 4 },
  summaryAmount: { fontSize: 24, fontWeight: "700", color: "#fff" },
  savingsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    elevation: 2,
  },
  savingsLabel: { fontSize: 14, color: "#6B7280", marginBottom: 8 },
  savingsPercentage: { fontSize: 48, fontWeight: "700", color: "#4F46E5", marginBottom: 4 },
  savingsDescription: { fontSize: 12, color: "#9CA3AF" },
  section: { paddingHorizontal: 16, marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: "#111827", marginBottom: 16 },
  emptyContainer: { alignItems: "center", paddingVertical: 40 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyText: { fontSize: 16, color: "#6B7280" },
  categoryItem: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  categoryIcon: { fontSize: 32 },
  categoryName: { fontSize: 16, fontWeight: "600", color: "#111827", marginBottom: 2 },
  categoryCount: { fontSize: 12, color: "#6B7280" },
  categoryRight: { alignItems: "flex-end" },
  categoryAmount: { fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 2 },
  categoryPercentage: { fontSize: 12, color: "#6B7280" },
  progressBar: { height: 8, backgroundColor: "#E5E7EB", borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 4 },
});
