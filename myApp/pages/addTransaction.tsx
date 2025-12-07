// myApp/pages/addTransaction.tsx

import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { transactionAPI, accountAPI } from "../services/api";

const CATEGORIES = {
  income: [
    { name: "Gaji", icon: "💼" },
    { name: "Freelance", icon: "💻" },
    { name: "Investasi", icon: "📈" },
    { name: "Bonus", icon: "🎁" },
    { name: "Lainnya", icon: "💰" },
  ],
  expense: [
    { name: "Makanan", icon: "🍔" },
    { name: "Transportasi", icon: "🚗" },
    { name: "Belanja", icon: "🛒" },
    { name: "Hiburan", icon: "🎬" },
    { name: "Kesehatan", icon: "🏥" },
    { name: "Tagihan", icon: "📄" },
    { name: "Lainnya", icon: "📦" },
  ],
};

interface Account {
  id: number;
  name: string;
  icon: string;
  balance: number;
}

export default function AddTransaction() {
  const navigation = useNavigation();

  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoadingAccounts(true);
      const data = await accountAPI.getAll();
      setAccounts(data);
      if (data.length > 0) {
        setSelectedAccount(data[0].id);
      }
    } catch (error: any) {
      console.error("Load accounts error:", error);
      Alert.alert("Error", "Gagal memuat akun");
    } finally {
      setLoadingAccounts(false);
    }
  };

  const handleSubmit = async () => {
    // Validasi
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Masukkan jumlah yang valid");
      return;
    }
    if (!selectedCategory) {
      Alert.alert("Error", "Pilih kategori");
      return;
    }
    if (!selectedAccount) {
      Alert.alert("Error", "Pilih akun");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Error", "Masukkan deskripsi");
      return;
    }
    if (type === "expense") {
    const selectedAcc = accounts.find(acc => acc.id === selectedAccount);
    const transactionAmount = parseFloat(amount);
    
    if (selectedAcc && transactionAmount > selectedAcc.balance) {
      Alert.alert(
        "Saldo Tidak Cukup", 
        `Saldo ${selectedAcc.name}: Rp ${selectedAcc.balance.toLocaleString("id-ID")}\nJumlah pengeluaran: Rp ${transactionAmount.toLocaleString("id-ID")}\n\nSaldo kurang Rp ${(transactionAmount - selectedAcc.balance).toLocaleString("id-ID")}`
      );
      return;
    }
  }

    try {
      setLoading(true);
      await transactionAPI.create({
        type,
        amount: parseFloat(amount),
        description: description.trim(),
        accountId: selectedAccount,
        category: selectedCategory,
      });

      Alert.alert("Sukses", "Transaksi berhasil ditambahkan", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      console.error("Create transaction error:", error);
      Alert.alert("Error", error.response?.data?.error || "Gagal menambah transaksi");
    } finally {
      setLoading(false);
    }
  };

  const categories = type === "income" ? CATEGORIES.income : CATEGORIES.expense;

  if (loadingAccounts) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Memuat...</Text>
        </View>
      </View>
    );
  }

  if (accounts.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Kembali</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tambah Transaksi</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>💳</Text>
          <Text style={styles.emptyText}>Belum ada akun keuangan</Text>
          <Text style={styles.emptySubtext}>Buat akun keuangan terlebih dahulu</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tambah Transaksi</Text>
      </View>

      <View style={styles.content}>
        {/* Type Selector */}
        <View style={styles.typeContainer}>
          <TouchableOpacity
            style={[styles.typeButton, type === "expense" && styles.typeButtonExpense]}
            onPress={() => {
              setType("expense");
              setSelectedCategory("");
            }}
          >
            <Text style={[styles.typeButtonText, type === "expense" && styles.typeButtonTextActive]}>Pengeluaran</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, type === "income" && styles.typeButtonIncome]}
            onPress={() => {
              setType("income");
              setSelectedCategory("");
            }}
          >
            <Text style={[styles.typeButtonText, type === "income" && styles.typeButtonTextActive]}>Pemasukan</Text>
          </TouchableOpacity>
        </View>

        {/* Amount */}
        <View style={styles.section}>
          <Text style={styles.label}>Jumlah</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.currency}>Rp</Text>
            <TextInput style={styles.amountInput} placeholder="0" keyboardType="numeric" value={amount} onChangeText={setAmount} placeholderTextColor="#9CA3AF" />
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Deskripsi</Text>
          <TextInput style={styles.input} placeholder="Contoh: Makan siang" value={description} onChangeText={setDescription} placeholderTextColor="#9CA3AF" />
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={styles.label}>Kategori</Text>
          <View style={styles.categoryGrid}>
            {categories.map((cat) => (
              <TouchableOpacity key={cat.name} style={[styles.categoryButton, selectedCategory === cat.name && styles.categoryButtonActive]} onPress={() => setSelectedCategory(cat.name)}>
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text style={styles.categoryName}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text style={styles.label}>Akun</Text>
          <View style={styles.accountGrid}>
            {accounts.map((acc) => (
              <TouchableOpacity key={acc.id} style={[styles.accountButton, selectedAccount === acc.id && styles.accountButtonActive]} onPress={() => setSelectedAccount(acc.id)}>
                <Text style={styles.accountIcon}>{acc.icon}</Text>
                <Text style={styles.accountName}>{acc.name}</Text>
                <Text style={styles.accountBalance}>Rp {acc.balance.toLocaleString("id-ID")}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={[styles.submitButton, loading && styles.submitButtonDisabled]} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Simpan Transaksi</Text>}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
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
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyText: { fontSize: 18, fontWeight: "600", color: "#111827", marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: "#6B7280", textAlign: "center" },
  content: { padding: 20 },
  typeContainer: { flexDirection: "row", gap: 12, marginBottom: 24 },
  typeButton: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: "#F3F4F6", alignItems: "center" },
  typeButtonExpense: { backgroundColor: "#EF4444" },
  typeButtonIncome: { backgroundColor: "#10B981" },
  typeButtonText: { fontSize: 16, fontWeight: "600", color: "#6B7280" },
  typeButtonTextActive: { color: "#fff" },
  section: { marginBottom: 24 },
  label: { fontSize: 16, fontWeight: "600", color: "#111827", marginBottom: 12 },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  currency: { fontSize: 24, fontWeight: "700", color: "#111827", marginRight: 8 },
  amountInput: { flex: 1, fontSize: 32, fontWeight: "700", color: "#111827", paddingVertical: 16 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#111827",
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  categoryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  categoryButton: {
    width: "31%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  categoryButtonActive: { borderColor: "#4F46E5", backgroundColor: "#EEF2FF" },
  categoryIcon: { fontSize: 28, marginBottom: 4 },
  categoryName: { fontSize: 12, color: "#6B7280", fontWeight: "500" },
  accountGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  accountButton: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  accountButtonActive: { borderColor: "#4F46E5", backgroundColor: "#EEF2FF" },
  accountIcon: { fontSize: 32, marginBottom: 4 },
  accountName: { fontSize: 14, fontWeight: "600", color: "#111827", marginBottom: 2 },
  accountBalance: { fontSize: 12, color: "#6B7280" },
  submitButton: {
    backgroundColor: "#4F46E5",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    elevation: 4,
  },
  submitButtonDisabled: { opacity: 0.6 },
  submitButtonText: { fontSize: 16, fontWeight: "700", color: "#fff" },
});
