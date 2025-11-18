// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   Alert,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { useDispatch, useSelector } from 'react-redux';
// import { login } from '../../store/slices/authSlice';
// import { AppDispatch, RootState } from '../../store/store';
// import { StyleSheet } from 'react-native';

// const Login: React.FC = () => {
//   const navigation = useNavigation();
//   const dispatch = useDispatch<AppDispatch>();
//   const { loading } = useSelector((state: RootState) => state.auth);

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);

//   const handleLogin = async () => {
//     if (!email || !password) {
//       Alert.alert('Error', 'Email dan password harus diisi');
//       return;
//     }

//     try {
//       await dispatch(login({ email, password })).unwrap();
//       // Navigation akan otomatis handle oleh auth state
//     } catch (error: any) {
//       Alert.alert('Login Gagal', error.message || 'Email atau password salah');
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       style={styles.container}
//     >
//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         <View style={styles.header}>
//           <Text style={styles.logo}>💰</Text>
//           <Text style={styles.title}>Catatan Keuangan</Text>
//           <Text style={styles.subtitle}>Kelola keuangan dengan mudah</Text>
//         </View>

//         <View style={styles.form}>
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Email</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="nama@email.com"
//               value={email}
//               onChangeText={setEmail}
//               keyboardType="email-address"
//               autoCapitalize="none"
//               autoCorrect={false}
//             />
//           </View>

//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Password</Text>
//             <View style={styles.passwordContainer}>
//               <TextInput
//                 style={styles.passwordInput}
//                 placeholder="••••••••"
//                 value={password}
//                 onChangeText={setPassword}
//                 secureTextEntry={!showPassword}
//                 autoCapitalize="none"
//               />
//               <TouchableOpacity
//                 style={styles.eyeButton}
//                 onPress={() => setShowPassword(!showPassword)}
//               >
//                 <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           <TouchableOpacity
//             style={styles.forgotPassword}
//             onPress={() => navigation.navigate('ForgotPassword' as never)}
//           >
//             <Text style={styles.forgotPasswordText}>Lupa Password?</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[styles.button, loading && styles.buttonDisabled]}
//             onPress={handleLogin}
//             disabled={loading}
//           >
//             <Text style={styles.buttonText}>
//               {loading ? 'Memproses...' : 'Masuk'}
//             </Text>
//           </TouchableOpacity>

//           <View style={styles.divider}>
//             <View style={styles.dividerLine} />
//             <Text style={styles.dividerText}>atau</Text>
//             <View style={styles.dividerLine} />
//           </View>

//           <TouchableOpacity
//             style={styles.registerLink}
//             onPress={() => navigation.navigate('Register' as never)}
//           >
//             <Text style={styles.registerText}>
//               Belum punya akun?{' '}
//               <Text style={styles.registerTextBold}>Daftar Sekarang</Text>
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// export default Login;

// export const styles = {
//   container: {
//     flex: 1,
//     backgroundColor: "#FFFFFF", // colors.card
//   },
//   scrollContent: {
//     flexGrow: 1,
//     padding: 24, // spacing.xl
//   },
//   header: {
//     alignItems: "center",
//     marginTop: 48, // spacing['3xl']
//     marginBottom: 48,
//   },
//   logo: {
//     fontSize: 48, // typography.fontSize['6xl']
//     marginBottom: 8, // spacing.base
//   },
//   title: {
//     fontSize: 28, // typography.fontSize['3xl']
//     fontWeight: "700", // bold
//     color: "#1A1A1A", // colors.text
//     marginBottom: 6, // spacing.sm
//   },
//   subtitle: {
//     fontSize: 16, // base
//     color: "#6B7280", // colors.textSecondary
//   },
//   form: {
//     flex: 1,
//   },
//   inputGroup: {
//     marginBottom: 20, // spacing.lg
//   },
//   label: {
//     fontSize: 14, // sm
//     fontWeight: "600", // semibold
//     color: "#1A1A1A",
//     marginBottom: 6,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#E5E7EB", // border
//     borderRadius: 12,
//     padding: 12, // spacing.base
//     fontSize: 16,
//     backgroundColor: "#F9FAFB", // backgroundLight
//   },
//   passwordContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 12,
//     backgroundColor: "#F9FAFB",
//   },
//   passwordInput: {
//     flex: 1,
//     padding: 12,
//     fontSize: 16,
//   },
//   eyeButton: {
//     padding: 12,
//   },
//   eyeIcon: {
//     fontSize: 20,
//   },
//   forgotPassword: {
//     alignSelf: "flex-end",
//     marginBottom: 24, // spacing.xl
//   },
//   forgotPasswordText: {
//     color: "#3B82F6", // primary
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   button: {
//     backgroundColor: "#3B82F6",
//     padding: 18,
//     borderRadius: 12,
//     alignItems: "center",
//     shadowColor: "#3B82F6",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   buttonDisabled: {
//     opacity: 0.6,
//   },
//   buttonText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "700",
//   },
//   divider: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginVertical: 24,
//   },
//   dividerLine: {
//     flex: 1,
//     height: 1,
//     backgroundColor: "#E5E7EB",
//   },
//   dividerText: {
//     marginHorizontal: 12,
//     color: "#9CA3AF", // textLight
//     fontSize: 14,
//   },
//   registerLink: {
//     alignItems: "center",
//     marginTop: 12,
//   },
//   registerText: {
//     fontSize: 14,
//     color: "#6B7280",
//   },
//   registerTextBold: {
//     color: "#3B82F6",
//     fontWeight: "700",
//   },
// };

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email dan password harus diisi');
      return;
    }
    Alert.alert("Login", `Email: ${email}\nPassword: ${password}`);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.logo}>💰</Text>
          <Text style={styles.title}>Catatan Keuangan</Text>
          <Text style={styles.subtitle}>Kelola keuangan dengan mudah</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="nama@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.eyeIcon}>
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => Alert.alert("Info", "Halaman lupa password belum dibuat")}
          >
            <Text style={styles.forgotPasswordText}>Lupa Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Masuk</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>atau</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => Alert.alert("Info", "Halaman register belum dibuat")}
          >
            <Text style={styles.registerText}>
              Belum punya akun?{' '}
              <Text style={styles.registerTextBold}>Daftar Sekarang</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginTop: 48,
    marginBottom: 48,
  },
  logo: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#F9FAFB",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  eyeButton: {
    padding: 12,
  },
  eyeIcon: {
    fontSize: 20,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#3B82F6",
    fontSize: 14,
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#3B82F6",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    elevation: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    marginHorizontal: 12,
    color: "#9CA3AF",
    fontSize: 14,
  },
  registerLink: {
    alignItems: "center",
    marginTop: 12,
  },
  registerText: {
    fontSize: 14,
    color: "#6B7280",
  },
  registerTextBold: {
    color: "#3B82F6",
    fontWeight: "700",
  },
});
