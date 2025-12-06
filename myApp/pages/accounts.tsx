// myApp/pages/accounts.tsx

import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert, RefreshControl, Modal, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { accountAPI } from "../services/api";

interface Account {
  id: number;
  name: string;
  type: string;
  icon: string;
  balance: number;
}

const ACCOUNT_TYPES = [
  { type: "cash", icon: "💵", name: "Cash" },
  { type: "bank", icon: "🏦", name: "Bank" },
  { type: "ewallet", icon: "📱", name: "E-Wallet" },
  { type: "credit", icon: "💳", name: "Kartu Kredit" },
  { type: "saving", icon: "💰", name: "Tabungan" },
  { type: "investment", icon: "📈", name: "Investasi" },
];

export default function Accounts() {
  const navigation = useNavigation();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState("cash");
  const [formBalance, setFormBalance] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const data = await accountAPI.getAll();
      setAccounts(data);
    } catch (error: any) {
      console.error("Load accounts error:", error);
      Alert.alert("Error", error.response?.data?.error || "Gagal memuat akun");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAccounts();
    setRefreshing(false);
  };

  const handleOpenModal = (account?: Account) => {
    if (account) {
      setEditingAccount(account);
      setFormName(account.name);
      setFormType(account.type);
      setFormBalance(account.balance.toString());
    } else {
      setEditingAccount(null);
      setFormName("");
      setFormType("cash");
      setFormBalance("0");
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAccount(null);
    setFormName("");
    setFormType("cash");
    setFormBalance("0");
  };

  const handleSubmit = async () => {
    if (!formName.trim()) {
      Alert.alert("Error", "Nama akun harus diisi");
      return;
    }

    if (!formBalance || parseFloat(formBalance) < 0) {
      Alert.alert("Error", "Saldo tidak valid");
      return;
    }

    try {
      setSubmitting(true);

      if (editingAccount) {
        await accountAPI.update(editingAccount.id, {
          name: formName.trim(),
          type: formType,
          balance: parseFloat(formBalance),
        });
        Alert.alert("Sukses", "Akun berhasil diupdate");
      } else {
        await accountAPI.create({
          name: formName.trim(),
          type: formType,
          balance: parseFloat(formBalance),
        });
        Alert.alert("Sukses", "Akun berhasil ditambahkan");
      }

      handleCloseModal();
      loadAccounts();
    } catch (error: any) {
      console.error("Submit account error:", error);
      Alert.alert("Error", error.response?.data?.error || "Gagal menyimpan akun");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    Alert.alert("Konfirmasi", "Hapus akun ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          try {
            await accountAPI.delete(id);
            Alert.alert("Sukses", "Akun berhasil dihapus");
            loadAccounts();
          } catch (error: any) {
            Alert.alert("Error", error.response?.data?.error || "Gagal menghapus akun");
          }
        },
      },
    ]);
  };

  const getIconForType = (type: string) => {
    const accountType = ACCOUNT_TYPES.find((t) => t.type === type);
    return accountType?.icon || "💳";
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Kembali</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Akun Keuangan</Text>
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
        <Text style={styles.headerTitle}>Akun Keuangan</Text>
      </View>

      {/* Total Balance Card */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Saldo Semua Akun</Text>
        <Text style={styles.totalAmount}>Rp {totalBalance.toLocaleString("id-ID")}</Text>
      </View>

      <ScrollView style={styles.scrollView} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {accounts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>💳</Text>
            <Text style={styles.emptyText}>Belum ada akun keuangan</Text>
            <TouchableOpacity style={styles.emptyButton} onPress={() => handleOpenModal()}>
              <Text style={styles.emptyButtonText}>Tambah Akun</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.accountsContainer}>
            {accounts.map((account) => (
              <View key={account.id} style={styles.accountCard}>
                <View style={styles.accountHeader}>
                  <Text style={styles.accountIcon}>{account.icon}</Text>
                  <View style={styles.accountInfo}>
                    <Text style={styles.accountName}>{account.name}</Text>
                    <Text style={styles.accountType}>{ACCOUNT_TYPES.find((t) => t.type === account.type)?.name || account.type}</Text>
                  </View>
                </View>
                <Text style={styles.accountBalance}>Rp {account.balance.toLocaleString("id-ID")}</Text>
                <View style={styles.accountActions}>
                  <TouchableOpacity style={styles.actionButton} onPress={() => handleOpenModal(account)}>
                    <Text style={styles.actionButtonText}>✏️ Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={() => handleDelete(account.id)}>
                    <Text style={[styles.actionButtonText, styles.deleteButtonText]}>🗑️ Hapus</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => handleOpenModal()}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Modal Form */}
      <Modal visible={showModal} transparent animationType="slide" onRequestClose={handleCloseModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingAccount ? "Edit Akun" : "Tambah Akun"}</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Nama Akun</Text>
              <TextInput style={styles.input} placeholder="Contoh: BCA Tabungan" value={formName} onChangeText={setFormName} placeholderTextColor="#9CA3AF" />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Tipe Akun</Text>
              <View style={styles.typeGrid}>
                {ACCOUNT_TYPES.map((type) => (
                  <TouchableOpacity key={type.type} style={[styles.typeButton, formType === type.type && styles.typeButtonActive]} onPress={() => setFormType(type.type)}>
                    <Text style={styles.typeIcon}>{type.icon}</Text>
                    <Text style={styles.typeName}>{type.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Saldo Awal</Text>
              <TextInput style={styles.input} placeholder="0" keyboardType="numeric" value={formBalance} onChangeText={setFormBalance} placeholderTextColor="#9CA3AF" />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCloseModal}>
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.saveButton, submitting && styles.saveButtonDisabled]} onPress={handleSubmit} disabled={submitting}>
                {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Simpan</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  totalCard: {
    margin: 16,
    padding: 20,
    backgroundColor: "#4F46E5",
    borderRadius: 16,
    elevation: 4,
  },
  totalLabel: { fontSize: 14, color: "rgba(255,255,255,0.9)", marginBottom: 8 },
  totalAmount: { fontSize: 32, fontWeight: "700", color: "#fff" },
  scrollView: { flex: 1 },
  emptyContainer: { alignItems: "center", paddingVertical: 80, paddingHorizontal: 40 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyText: { fontSize: 18, fontWeight: "600", color: "#111827", marginBottom: 16 },
  emptyButton: { backgroundColor: "#4F46E5", paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
  emptyButtonText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  accountsContainer: { padding: 16, gap: 12 },
  accountCard: { backgroundColor: "#fff", borderRadius: 16, padding: 20, elevation: 2 },
  accountHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  accountIcon: { fontSize: 40, marginRight: 12 },
  accountInfo: { flex: 1 },
  accountName: { fontSize: 18, fontWeight: "700", color: "#111827", marginBottom: 2 },
  accountType: { fontSize: 14, color: "#6B7280" },
  accountBalance: { fontSize: 24, fontWeight: "700", color: "#4F46E5", marginBottom: 12 },
  accountActions: { flexDirection: "row", gap: 8 },
  actionButton: { flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: "#F3F4F6", alignItems: "center" },
  actionButtonText: { fontSize: 14, fontWeight: "600", color: "#111827" },
  deleteButton: { backgroundColor: "#FEE2E2" },
  deleteButtonText: { color: "#EF4444" },
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
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: "80%" },
  modalTitle: { fontSize: 24, fontWeight: "700", color: "#111827", marginBottom: 20 },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", color: "#111827", marginBottom: 8 },
  input: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, padding: 14, fontSize: 16, color: "#111827", backgroundColor: "#F9FAFB" },
  typeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  typeButton: { width: "31%", backgroundColor: "#F3F4F6", borderRadius: 12, padding: 12, alignItems: "center", borderWidth: 2, borderColor: "transparent" },
  typeButtonActive: { borderColor: "#4F46E5", backgroundColor: "#EEF2FF" },
  typeIcon: { fontSize: 24, marginBottom: 4 },
  typeName: { fontSize: 11, color: "#6B7280", fontWeight: "500" },
  modalButtons: { flexDirection: "row", gap: 12, marginTop: 8 },
  cancelButton: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: "#E5E7EB", alignItems: "center" },
  cancelButtonText: { fontSize: 16, fontWeight: "600", color: "#6B7280" },
  saveButton: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: "#4F46E5", alignItems: "center" },
  saveButtonDisabled: { opacity: 0.6 },
  saveButtonText: { fontSize: 16, fontWeight: "600", color: "#fff" },
});
