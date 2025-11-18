// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchTransactions } from '../../store/slices/transactionSlice';
// import { fetchAccounts } from '../../store/slices/accountSlice';
// import { AppDispatch, RootState } from '../../store/store';
// import { StyleSheet } from 'react-native';

// const Home: React.FC = () => {
//   const navigation = useNavigation();
//   const dispatch = useDispatch<AppDispatch>();
//   const { user } = useSelector((state: RootState) => state.auth);
//   const { transactions, totalIncome, totalExpense, loading } = useSelector(
//     (state: RootState) => state.transaction
//   );
//   const { accounts } = useSelector((state: RootState) => state.account);

//   const [selectedMonth] = useState(new Date());

//   React.useEffect(() => {
//     dispatch(fetchTransactions(selectedMonth));
//     dispatch(fetchAccounts());
//   }, []);

//   const totalBalance = totalIncome - totalExpense;
//   const recentTransactions = transactions.slice(0, 5);

//   const handleAddTransaction = () => {
//     navigation.navigate('AddTransaction' as never);
//   };

//   return (
//     <ScrollView style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <View>
//           <Text style={styles.greeting}>Halo,</Text>
//           <Text style={styles.userName}>{user?.name || 'User'}</Text>
//         </View>
//         <TouchableOpacity
//           style={styles.profileButton}
//           onPress={() => navigation.navigate('Profile' as never)}
//         >
//           <Text style={styles.profileIcon}>👤</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Balance Card */}
//       <View style={styles.balanceCard}>
//         <Text style={styles.balanceLabel}>Total Saldo</Text>
//         <Text style={styles.balanceAmount}>
//           Rp {totalBalance.toLocaleString('id-ID')}
//         </Text>

//         <View style={styles.balanceRow}>
//           <View style={styles.balanceItem}>
//             <Text style={styles.balanceItemIcon}>📈</Text>
//             <View>
//               <Text style={styles.balanceItemLabel}>Pemasukan</Text>
//               <Text style={styles.incomeAmount}>
//                 Rp {totalIncome.toLocaleString('id-ID')}
//               </Text>
//             </View>
//           </View>

//           <View style={styles.balanceDivider} />

//           <View style={styles.balanceItem}>
//             <Text style={styles.balanceItemIcon}>📉</Text>
//             <View>
//               <Text style={styles.balanceItemLabel}>Pengeluaran</Text>
//               <Text style={styles.expenseAmount}>
//                 Rp {totalExpense.toLocaleString('id-ID')}
//               </Text>
//             </View>
//           </View>
//         </View>
//       </View>

//       {/* Quick Actions */}
//       <View style={styles.quickActions}>
//         <TouchableOpacity
//           style={styles.quickActionButton}
//           onPress={handleAddTransaction}
//         >
//           <View style={styles.quickActionIcon}>
//             <Text style={styles.quickActionEmoji}>➕</Text>
//           </View>
//           <Text style={styles.quickActionText}>Tambah</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.quickActionButton}
//           onPress={() => navigation.navigate('TransactionList' as never)}
//         >
//           <View style={styles.quickActionIcon}>
//             <Text style={styles.quickActionEmoji}>📋</Text>
//           </View>
//           <Text style={styles.quickActionText}>Riwayat</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.quickActionButton}
//           onPress={() => navigation.navigate('Report' as never)}
//         >
//           <View style={styles.quickActionIcon}>
//             <Text style={styles.quickActionEmoji}>📊</Text>
//           </View>
//           <Text style={styles.quickActionText}>Laporan</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.quickActionButton}
//           onPress={() => navigation.navigate('AccountList' as never)}
//         >
//           <View style={styles.quickActionIcon}>
//             <Text style={styles.quickActionEmoji}>💳</Text>
//           </View>
//           <Text style={styles.quickActionText}>Akun</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Accounts Section */}
//       <View style={styles.section}>
//         <View style={styles.sectionHeader}>
//           <Text style={styles.sectionTitle}>Akun Keuangan</Text>
//           <TouchableOpacity
//             onPress={() => navigation.navigate('AccountList' as never)}
//           >
//             <Text style={styles.seeAll}>Lihat Semua →</Text>
//           </TouchableOpacity>
//         </View>

//         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//           {accounts.slice(0, 3).map((account) => (
//             <View key={account.id} style={styles.accountCard}>
//               <Text style={styles.accountIcon}>{account.icon}</Text>
//               <Text style={styles.accountName}>{account.name}</Text>
//               <Text style={styles.accountBalance}>
//                 Rp {account.balance.toLocaleString('id-ID')}
//               </Text>
//             </View>
//           ))}
//         </ScrollView>
//       </View>

//       {/* Recent Transactions */}
//       <View style={styles.section}>
//         <View style={styles.sectionHeader}>
//           <Text style={styles.sectionTitle}>Transaksi Terbaru</Text>
//           <TouchableOpacity
//             onPress={() => navigation.navigate('TransactionList' as never)}
//           >
//             <Text style={styles.seeAll}>Lihat Semua →</Text>
//           </TouchableOpacity>
//         </View>

//         {loading ? (
//           <Text style={styles.loadingText}>Memuat...</Text>
//         ) : recentTransactions.length === 0 ? (
//           <View style={styles.emptyState}>
//             <Text style={styles.emptyIcon}>📝</Text>
//             <Text style={styles.emptyText}>Belum ada transaksi</Text>
//             <TouchableOpacity
//               style={styles.emptyButton}
//               onPress={handleAddTransaction}
//             >
//               <Text style={styles.emptyButtonText}>Tambah Transaksi</Text>
//             </TouchableOpacity>
//           </View>
//         ) : (
//           recentTransactions.map((transaction) => (
//             <View key={transaction.id} style={styles.transactionItem}>
//               <View style={styles.transactionLeft}>
//                 <View style={styles.transactionIcon}>
//                   <Text>{transaction.category?.icon || '💰'}</Text>
//                 </View>
//                 <View>
//                   <Text style={styles.transactionCategory}>
//                     {transaction.category?.name}
//                   </Text>
//                   <Text style={styles.transactionDescription}>
//                     {transaction.description}
//                   </Text>
//                 </View>
//               </View>
//               <Text
//                 style={[
//                   styles.transactionAmount,
//                   transaction.type === 'INCOME'
//                     ? styles.incomeText
//                     : styles.expenseText,
//                 ]}
//               >
//                 {transaction.type === 'INCOME' ? '+' : '-'}Rp{' '}
//                 {transaction.amount.toLocaleString('id-ID')}
//               </Text>
//             </View>
//           ))
//         )}
//       </View>

//       {/* Floating Action Button */}
//       <TouchableOpacity style={styles.fab} onPress={handleAddTransaction}>
//         <Text style={styles.fabIcon}>+</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// export default Home;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F4F6FA', // background
//   },

//   /* === Header === */
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 20,
//     paddingTop: 50,
//     backgroundColor: '#FFFFFF', // card
//   },
//   greeting: {
//     fontSize: 16,
//     color: '#6B7280',
//   },
//   userName: {
//     fontSize: 28,
//     fontWeight: '700',
//     color: '#111827',
//   },
//   profileButton: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: '#E5E7EB',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   profileIcon: {
//     fontSize: 28,
//   },

//   /* === Balance Card === */
//   balanceCard: {
//     margin: 20,
//     padding: 24,
//     backgroundColor: '#4F46E5', // primary
//     borderRadius: 20,
//     shadowColor: '#4F46E5',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.3,
//     shadowRadius: 12,
//     elevation: 8,
//   },
//   balanceLabel: {
//     fontSize: 14,
//     color: 'rgba(255,255,255,0.8)',
//     marginBottom: 6,
//   },
//   balanceAmount: {
//     fontSize: 36,
//     fontWeight: '700',
//     color: '#fff',
//     marginBottom: 24,
//   },
//   balanceRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//   },
//   balanceItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   balanceItemIcon: {
//     fontSize: 28,
//   },
//   balanceItemLabel: {
//     fontSize: 12,
//     color: 'rgba(255,255,255,0.8)',
//   },
//   incomeAmount: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#10B981', // green
//   },
//   expenseAmount: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#EF4444', // red
//   },
//   balanceDivider: {
//     width: 1,
//     height: 40,
//     backgroundColor: 'rgba(255,255,255,0.3)',
//   },

//   /* === Quick Actions === */
//   quickActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingHorizontal: 20,
//     marginBottom: 24,
//   },
//   quickActionButton: {
//     alignItems: 'center',
//   },
//   quickActionIcon: {
//     width: 56,
//     height: 56,
//     borderRadius: 16,
//     backgroundColor: '#FFFFFF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   quickActionEmoji: {
//     fontSize: 26,
//   },
//   quickActionText: {
//     fontSize: 14,
//     color: '#6B7280',
//     fontWeight: '500',
//   },

//   /* === Section === */
//   section: {
//     paddingHorizontal: 20,
//     marginBottom: 32,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#111827',
//   },
//   seeAll: {
//     fontSize: 14,
//     color: '#4F46E5',
//     fontWeight: '500',
//   },

//   /* === Account Card === */
//   accountCard: {
//     width: 140,
//     padding: 14,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     marginRight: 16,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   accountIcon: {
//     fontSize: 34,
//     marginBottom: 8,
//   },
//   accountName: {
//     fontSize: 14,
//     color: '#111827',
//     fontWeight: '500',
//     marginBottom: 4,
//     textAlign: 'center',
//   },
//   accountBalance: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#4F46E5',
//     textAlign: 'center',
//   },

//   /* === Recent Transactions === */
//   loadingText: {
//     textAlign: 'center',
//     color: '#6B7280',
//     marginTop: 20,
//   },
//   emptyState: {
//     alignItems: 'center',
//     paddingVertical: 28,
//   },
//   emptyIcon: {
//     fontSize: 34,
//     marginBottom: 8,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#6B7280',
//     marginBottom: 16,
//   },
//   emptyButton: {
//     backgroundColor: '#4F46E5',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 12,
//   },
//   emptyButtonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '600',
//   },

//   transactionItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   transactionLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   transactionIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 12,
//     backgroundColor: '#E5E7EB',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   transactionCategory: {
//     fontSize: 16,
//     color: '#111827',
//     fontWeight: '500',
//   },
//   transactionDescription: {
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   transactionAmount: {
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   incomeText: {
//     color: '#10B981',
//   },
//   expenseText: {
//     color: '#EF4444',
//   },

//   /* === Floating Button === */
//   fab: {
//     position: 'absolute',
//     bottom: 30,
//     right: 20,
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: '#4F46E5',
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#4F46E5',
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.3,
//     shadowRadius: 10,
//     elevation: 6,
//   },
//   fabIcon: {
//     fontSize: 34,
//     color: '#fff',
//     marginBottom: 2,
//   },
// });

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

const Home = () => {
  // ==== Dummy Data ====
  const user = { name: 'Nabil' };

  const transactions = [
    { id: 1, type: 'INCOME', amount: 1500000, description: 'Gaji', category: { name: 'Gaji', icon: '💼' } },
    { id: 2, type: 'EXPENSE', amount: 25000, description: 'Kopi', category: { name: 'Makanan', icon: '☕' } },
    { id: 3, type: 'EXPENSE', amount: 100000, description: 'Bensin', category: { name: 'Transportasi', icon: '⛽' } },
  ];

  const accounts = [
    { id: 1, name: 'Cash', balance: 500000, icon: '💵' },
    { id: 2, name: 'Bank BCA', balance: 2500000, icon: '🏦' },
    { id: 3, name: 'E-Wallet', balance: 700000, icon: '📱' },
  ];

  const totalIncome = 1500000;
  const totalExpense = 125000;
  const totalBalance = totalIncome - totalExpense;
  const recentTransactions = transactions.slice(0, 5);

  const handleAddTransaction = () => {
    console.log('Tambah transaksi');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Halo,</Text>
          <Text style={styles.userName}>{user.name}</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Saldo</Text>
        <Text style={styles.balanceAmount}>
          Rp {totalBalance.toLocaleString('id-ID')}
        </Text>

        <View style={styles.balanceRow}>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceItemIcon}>📈</Text>
            <View>
              <Text style={styles.balanceItemLabel}>Pemasukan</Text>
              <Text style={styles.incomeAmount}>
                Rp {totalIncome.toLocaleString('id-ID')}
              </Text>
            </View>
          </View>

          <View style={styles.balanceDivider} />

          <View style={styles.balanceItem}>
            <Text style={styles.balanceItemIcon}>📉</Text>
            <View>
              <Text style={styles.balanceItemLabel}>Pengeluaran</Text>
              <Text style={styles.expenseAmount}>
                Rp {totalExpense.toLocaleString('id-ID')}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={handleAddTransaction}
        >
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
          {accounts.map((account) => (
            <View key={account.id} style={styles.accountCard}>
              <Text style={styles.accountIcon}>{account.icon}</Text>
              <Text style={styles.accountName}>{account.name}</Text>
              <Text style={styles.accountBalance}>
                Rp {account.balance.toLocaleString('id-ID')}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Transaksi Terbaru</Text>
          <Text style={styles.seeAll}>Lihat Semua →</Text>
        </View>

        {recentTransactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionItem}>
            <View style={styles.transactionLeft}>
              <View style={styles.transactionIcon}>
                <Text>{transaction.category.icon}</Text>
              </View>
              <View>
                <Text style={styles.transactionCategory}>
                  {transaction.category.name}
                </Text>
                <Text style={styles.transactionDescription}>
                  {transaction.description}
                </Text>
              </View>
            </View>

            <Text
              style={[
                styles.transactionAmount,
                transaction.type === 'INCOME'
                  ? styles.incomeText
                  : styles.expenseText,
              ]}
            >
              {transaction.type === 'INCOME' ? '+' : '-'}Rp{' '}
              {transaction.amount.toLocaleString('id-ID')}
            </Text>
          </View>
        ))}
      </View>

      {/* Floating Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddTransaction}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Home;

// =============================
//         STYLES
// =============================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FA',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  greeting: { fontSize: 16, color: '#6B7280' },
  userName: { fontSize: 28, fontWeight: '700', color: '#111827' },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: { fontSize: 28 },

  balanceCard: {
    margin: 20,
    padding: 24,
    backgroundColor: '#4F46E5',
    borderRadius: 20,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  balanceLabel: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  balanceAmount: { fontSize: 36, fontWeight: '700', color: '#fff', marginBottom: 24 },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-around' },
  balanceItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  balanceItemIcon: { fontSize: 28 },
  balanceItemLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  incomeAmount: { fontSize: 16, fontWeight: '600', color: '#10B981' },
  expenseAmount: { fontSize: 16, fontWeight: '600', color: '#EF4444' },
  balanceDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.3)' },

  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  quickActionButton: { alignItems: 'center' },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 3,
  },
  quickActionEmoji: { fontSize: 26 },
  quickActionText: { fontSize: 14, color: '#6B7280', fontWeight: '500' },

  section: { paddingHorizontal: 20, marginBottom: 32 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#111827' },
  seeAll: { fontSize: 14, color: '#4F46E5', fontWeight: '500' },

  accountCard: {
    width: 140,
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 16,
    alignItems: 'center',
    elevation: 3,
  },
  accountIcon: { fontSize: 34, marginBottom: 8 },
  accountName: { fontSize: 14, color: '#111827', fontWeight: '500', marginBottom: 4, textAlign: 'center' },
  accountBalance: { fontSize: 16, fontWeight: '700', color: '#4F46E5', textAlign: 'center' },

  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  transactionLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  transactionIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  transactionCategory: { fontSize: 16, fontWeight: '500', color: '#111827' },
  transactionDescription: { fontSize: 14, color: '#6B7280' },
  transactionAmount: { fontSize: 16, fontWeight: '600' },
  incomeText: { color: '#10B981' },
  expenseText: { color: '#EF4444' },

  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  fabIcon: { fontSize: 34, color: '#fff' },
});

