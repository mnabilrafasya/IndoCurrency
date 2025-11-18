import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

export default function Register() {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleRegister = () => {
    // Validasi input
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Semua field harus diisi!");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Password dan konfirmasi password tidak cocok!");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password minimal 6 karakter!");
      return;
    }

    if (!agreeTerms) {
      Alert.alert("Error", "Anda harus menyetujui syarat dan ketentuan!");
      return;
    }

    // Simulasi registrasi - ganti dengan API call
    Alert.alert("Sukses", "Registrasi berhasil! Silakan login.", [
      {
        text: "OK",
        onPress: () => navigation.navigate("Login" as never),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* Header Section */}
          <View style={styles.header}>
            <LinearGradient colors={["#6366f1", "#9333ea"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.logoContainer}>
              <Text style={styles.logoIcon}>💰</Text>
            </LinearGradient>
            <Text style={styles.title}>Daftar Akun</Text>
            <Text style={styles.subtitle}>Buat akun baru untuk memulai mengelola keuangan</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            {/* Full Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nama Lengkap</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>👤</Text>
                <TextInput style={styles.input} placeholder="Masukkan nama lengkap" placeholderTextColor="#9ca3af" value={fullName} onChangeText={setFullName} autoCapitalize="words" />
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>📧</Text>
                <TextInput style={styles.input} placeholder="nama@email.com" placeholderTextColor="#9ca3af" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput style={styles.input} placeholder="Minimal 6 karakter" placeholderTextColor="#9ca3af" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} autoCapitalize="none" />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                  <Text style={styles.eyeIcon}>{showPassword ? "👁️" : "👁️‍🗨️"}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Konfirmasi Password</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>🔐</Text>
                <TextInput style={styles.input} placeholder="Ulangi password" placeholderTextColor="#9ca3af" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!showConfirmPassword} autoCapitalize="none" />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeButton}>
                  <Text style={styles.eyeIcon}>{showConfirmPassword ? "👁️" : "👁️‍🗨️"}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Terms and Conditions */}
            <TouchableOpacity style={styles.checkboxContainer} onPress={() => setAgreeTerms(!agreeTerms)} activeOpacity={0.7}>
              <View style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}>{agreeTerms && <Text style={styles.checkboxIcon}>✓</Text>}</View>
              <Text style={styles.checkboxText}>
                Saya setuju dengan <Text style={styles.linkText}>Syarat & Ketentuan</Text> dan <Text style={styles.linkText}>Kebijakan Privasi</Text>
              </Text>
            </TouchableOpacity>

            {/* Register Button */}
            <TouchableOpacity onPress={handleRegister} activeOpacity={0.8} style={styles.registerButton}>
              <LinearGradient colors={["#6366f1", "#9333ea"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.registerButtonGradient}>
                <Text style={styles.registerButtonText}>Daftar</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>atau daftar dengan</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Register Buttons */}
            <View style={styles.socialButtons}>
              <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                <Text style={styles.socialIcon}>🔵</Text>
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                <Text style={styles.socialIcon}>📘</Text>
                <Text style={styles.socialButtonText}>Facebook</Text>
              </TouchableOpacity>
            </View>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Sudah punya akun? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login" as never)}>
                <Text style={styles.loginLink}>Masuk</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  logoIcon: {
    fontSize: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1f2937",
  },
  eyeButton: {
    padding: 4,
  },
  eyeIcon: {
    fontSize: 20,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    marginTop: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#d1d5db",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  checkboxChecked: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  checkboxIcon: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  linkText: {
    color: "#6366f1",
    fontWeight: "600",
  },
  registerButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
  },
  registerButtonGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  registerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e5e7eb",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#9ca3af",
    fontSize: 14,
  },
  socialButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 14,
    gap: 8,
  },
  socialIcon: {
    fontSize: 20,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  loginText: {
    color: "#6b7280",
    fontSize: 14,
  },
  loginLink: {
    color: "#6366f1",
    fontSize: 14,
    fontWeight: "bold",
  },
});
