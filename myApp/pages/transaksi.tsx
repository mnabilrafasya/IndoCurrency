import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, StyleSheet, SafeAreaView, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../components/header";
import Footer from "../components/footer";

const { width } = Dimensions.get("window");

export default function Home() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddModal, setShowAddModal] = useState(false);
  const [transactionType, setTransactionType] = useState("expense");

  // Sample data
  const balance = 15750000;
  const income = 25000000;
  const expense = 9250000;

  const recentTransactions = [
    { id: 1, title: "Gaji Bulanan", amount: 15000000, type: "income", category: "Salary", date: "2024-11-15" },
    { id: 2, title: "Belanja Groceries", amount: 850000, type: "expense", category: "Food", date: "2024-11-14" },
    { id: 3, title: "Tagihan Listrik", amount: 450000, type: "expense", category: "Utilities", date: "2024-11-13" },
    { id: 4, title: "Freelance Project", amount: 5000000, type: "income", category: "Freelance", date: "2024-11-12" },
    { id: 5, title: "Makan Siang", amount: 125000, type: "expense", category: "Food", date: "2024-11-11" },
  ];

  const categories = [
    { name: "Food", amount: 2500000, percentage: 27, color: "#f97316" },
    { name: "Transport", amount: 1800000, percentage: 19, color: "#3b82f6" },
    { name: "Entertainment", amount: 1500000, percentage: 16, color: "#a855f7" },
    { name: "Utilities", amount: 1200000, percentage: 13, color: "#22c55e" },
    { name: "Others", amount: 2250000, percentage: 25, color: "#6b7280" },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header onAddTransaction={() => setShowAddModal(true)} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Balance Cards */}
        <View style={styles.cardsContainer}>
          {/* Total Balance Card */}
          <LinearGradient colors={["#6366f1", "#9333ea"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.balanceCard}>
            <Text style={styles.cardLabel}>Saldo Total</Text>
            <Text style={styles.cardAmount}>{formatCurrency(balance)}</Text>
            <Text style={styles.cardSubtext}>+12.5% dari bulan lalu</Text>
          </LinearGradient>

          {/* Income Card */}
          <View style={styles.whiteCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabelDark}>Pemasukan</Text>
              <View style={[styles.iconContainer, { backgroundColor: "#dcfce7" }]}>
                <Text style={styles.icon}>↑</Text>
              </View>
            </View>
            <Text style={styles.cardAmountDark}>{formatCurrency(income)}</Text>
            <Text style={styles.percentageGreen}>↗ +8.2%</Text>
          </View>

          {/* Expense Card */}
          <View style={styles.whiteCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabelDark}>Pengeluaran</Text>
              <View style={[styles.iconContainer, { backgroundColor: "#fee2e2" }]}>
                <Text style={styles.icon}>↓</Text>
              </View>
            </View>
            <Text style={styles.cardAmountDark}>{formatCurrency(expense)}</Text>
            <Text style={styles.percentageRed}>↘ -3.1%</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabButtons}>
            <TouchableOpacity onPress={() => setActiveTab("overview")} style={[styles.tabButton, activeTab === "overview" && styles.tabButtonActive]}>
              <Text style={[styles.tabButtonText, activeTab === "overview" && styles.tabButtonTextActive]}>Transaksi Terakhir</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab("categories")} style={[styles.tabButton, activeTab === "categories" && styles.tabButtonActive]}>
              <Text style={[styles.tabButtonText, activeTab === "categories" && styles.tabButtonTextActive]}>Kategori</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tabContent}>
            {activeTab === "overview" && (
              <View>
                {recentTransactions.map((transaction) => (
                  <View key={transaction.id} style={styles.transactionItem}>
                    <View style={styles.transactionLeft}>
                      <View style={[styles.transactionIcon, { backgroundColor: transaction.type === "income" ? "#dcfce7" : "#fee2e2" }]}>
                        <Text style={styles.transactionIconText}>{transaction.type === "income" ? "↑" : "↓"}</Text>
                      </View>
                      <View>
                        <Text style={styles.transactionTitle}>{transaction.title}</Text>
                        <Text style={styles.transactionDetails}>
                          {transaction.category} • {formatDate(transaction.date)}
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.transactionAmount, { color: transaction.type === "income" ? "#16a34a" : "#dc2626" }]}>
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {activeTab === "categories" && (
              <View>
                {categories.map((category, index) => (
                  <View key={index} style={styles.categoryItem}>
                    <View style={styles.categoryHeader}>
                      <View style={styles.categoryLeft}>
                        <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                        <Text style={styles.categoryName}>{category.name}</Text>
                      </View>
                      <View style={styles.categoryRight}>
                        <Text style={styles.categoryAmount}>{formatCurrency(category.amount)}</Text>
                        <Text style={styles.categoryPercentage}>{category.percentage}%</Text>
                      </View>
                    </View>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${category.percentage}%`, backgroundColor: category.color }]} />
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Add Transaction Modal */}
      <Modal visible={showAddModal} transparent animationType="slide" onRequestClose={() => setShowAddModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tambah Transaksi</Text>

            <View style={styles.typeButtons}>
              <TouchableOpacity onPress={() => setTransactionType("expense")} style={[styles.typeButton, transactionType === "expense" && styles.typeButtonExpenseActive]}>
                <Text style={[styles.typeButtonText, transactionType === "expense" && styles.typeButtonTextActive]}>Pengeluaran</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setTransactionType("income")} style={[styles.typeButton, transactionType === "income" && styles.typeButtonIncomeActive]}>
                <Text style={[styles.typeButtonText, transactionType === "income" && styles.typeButtonTextActive]}>Pemasukan</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Jumlah</Text>
              <TextInput style={styles.input} placeholder="0" keyboardType="numeric" placeholderTextColor="#9ca3af" />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Judul</Text>
              <TextInput style={styles.input} placeholder="Nama transaksi" placeholderTextColor="#9ca3af" />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Kategori</Text>
              <TextInput style={styles.input} placeholder="Pilih kategori" placeholderTextColor="#9ca3af" />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setShowAddModal(false)} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowAddModal(false)} style={styles.saveButton}>
                <LinearGradient colors={["#6366f1", "#9333ea"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.saveButtonGradient}>
                  <Text style={styles.saveButtonText}>Simpan</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollView: {
    flex: 1,
  },
  cardsContainer: {
    padding: 16,
    gap: 16,
  },
  balanceCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 8,
  },
  whiteCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardLabel: {
    color: "#e0e7ff",
    fontSize: 14,
    marginBottom: 4,
  },
  cardLabelDark: {
    color: "#6b7280",
    fontSize: 14,
  },
  cardAmount: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardAmountDark: {
    color: "#1f2937",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardSubtext: {
    color: "#c7d2fe",
    fontSize: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: 18,
  },
  percentageGreen: {
    color: "#16a34a",
    fontSize: 12,
  },
  percentageRed: {
    color: "#dc2626",
    fontSize: 12,
  },
  tabsContainer: {
    backgroundColor: "white",
    margin: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tabButtons: {
    flexDirection: "row",
    padding: 8,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  tabButtonActive: {
    backgroundColor: "#6366f1",
  },
  tabButtonText: {
    color: "#6b7280",
    fontWeight: "600",
  },
  tabButtonTextActive: {
    color: "white",
  },
  tabContent: {
    padding: 16,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  transactionIconText: {
    fontSize: 18,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 2,
  },
  transactionDetails: {
    fontSize: 12,
    color: "#6b7280",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  categoryItem: {
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  categoryRight: {
    alignItems: "flex-end",
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
  },
  categoryPercentage: {
    fontSize: 12,
    color: "#6b7280",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 20,
  },
  typeButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
  },
  typeButtonExpenseActive: {
    backgroundColor: "#ef4444",
  },
  typeButtonIncomeActive: {
    backgroundColor: "#22c55e",
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
  },
  typeButtonTextActive: {
    color: "white",
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#1f2937",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  saveButton: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  saveButtonGradient: {
    paddingVertical: 14,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});
