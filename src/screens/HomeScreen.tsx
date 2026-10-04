import React, {useMemo, useState} from 'react';
import {Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, View} from 'react-native';
import {Landmark, LogOut, Plus, Wallet, WalletCards} from 'lucide-react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {addMonths} from 'date-fns';
import {RootStackParamList} from '../navigation/types';
import {useAuth} from '../context/AuthContext';
import {useTransactions} from '../hooks/useTransactions';
import {useMonthSummary} from '../hooks/useMonthSummary';
import {accountBalance} from '../utils/summary';
import {formatCurrency} from '../utils/format';
import {logout} from '../services/authService';
import {deleteTransaction as removeTransaction} from '../services/transactionService';
import SummaryCard from '../components/SummaryCard';
import MonthSwitcher from '../components/MonthSwitcher';
import TransactionItem from '../components/TransactionItem';
import ThemeToggle from '../components/ThemeToggle';
import {Colors, controlHeight, radius, spacing} from '../constants/theme';
import {useTheme} from '../context/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({navigation}: Props) {
  const {user} = useAuth();
  const {colors} = useTheme();
  const styles = createStyles(colors);
  const [month, setMonth] = useState(new Date());
  const {transactions, allTransactions, loading, error} = useTransactions(month);
  const summary = useMonthSummary(transactions);
  const balances = useMemo(() => ({bank: accountBalance(allTransactions, 'bank'), cash: accountBalance(allTransactions, 'cash')}), [allTransactions]);
  const now = new Date();
  const isLatestMonth = month.getFullYear() === now.getFullYear() && month.getMonth() === now.getMonth();

  const confirmDelete = (id: string) => Alert.alert('Delete this entry?', 'This cannot be undone.', [{text: 'Cancel', style: 'cancel'}, {text: 'Delete', style: 'destructive', onPress: () => removeTransaction(id)}]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <View><Text style={styles.greeting}>HOME LEDGER</Text><Text style={styles.title}>Good to see you{user?.user_metadata?.display_name ? `, ${user.user_metadata.display_name}` : ''}.</Text></View>
        <View style={styles.headerActions}>
          <ThemeToggle />
          <Pressable accessibilityLabel="Log out" onPress={() => logout()} style={({pressed}) => [styles.logout, pressed && styles.actionPressed]}><LogOut size={19} color={colors.primary} strokeWidth={2.25} /></Pressable>
        </View>
      </View>
      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={({item}) => <TransactionItem transaction={item} onPress={() => navigation.navigate('AddEntry', {transaction: item})} onLongPress={() => confirmDelete(item.id)} />}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={loading} tintColor={colors.primary} />}
        ListHeaderComponent={<View>
          <MonthSwitcher month={month} onPrevious={() => setMonth(current => addMonths(current, -1))} onNext={() => setMonth(current => addMonths(current, 1))} nextDisabled={isLatestMonth} />
          <View style={styles.summarySpacing}><SummaryCard {...summary} /></View>
          <View style={styles.balanceSection}>
            <Text style={styles.sectionTitle}>Balances</Text>
            <View style={styles.balanceRow}>
              <Balance label="Bank" amount={balances.bank} icon={Landmark} />
              <Balance label="Cash" amount={balances.cash} icon={Wallet} />
            </View>
            <View style={styles.totalBalance}><Text style={styles.totalLabel}>Total balance</Text><Text style={styles.totalAmount}>{formatCurrency(balances.bank + balances.cash)}</Text></View>
          </View>
          <View style={styles.transactionsSection}>
            <View style={styles.transactionsHeader}><Text style={styles.sectionTitle}>Transactions</Text><Text style={styles.countBadge}>{transactions.length} {transactions.length === 1 ? 'entry' : 'entries'}</Text></View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            {!loading && !error && transactions.length === 0 ? <View style={styles.emptyState}>
              <View style={styles.emptyIcon}><WalletCards size={22} color={colors.primary} strokeWidth={2.1} /></View>
              <Text style={styles.emptyTitle}>Nothing logged yet</Text>
              <Text style={styles.emptyCopy}>Add your first income or expense for this month.</Text>
              <Pressable accessibilityRole="button" onPress={() => navigation.navigate('AddEntry')} style={({pressed}) => [styles.emptyAction, pressed && styles.fabPressed]}>
                <Plus size={17} color={colors.white} strokeWidth={2.4} />
                <Text style={styles.emptyActionText}>Add entry</Text>
              </Pressable>
            </View> : null}
          </View>
        </View>}
        ListFooterComponent={<View style={styles.footer} />}
      />
      <Pressable accessibilityLabel="Add entry" onPress={() => navigation.navigate('AddEntry')} style={({pressed}) => [styles.fab, pressed && styles.fabPressed]}><Plus size={28} color={colors.white} strokeWidth={2.25} /></Pressable>
    </SafeAreaView>
  );
}

function Balance({label, amount, icon: Icon}: {label: string; amount: number; icon: typeof Landmark}) {
  const {colors} = useTheme();
  const styles = createStyles(colors);

  return <View style={styles.balance}><View style={styles.balanceIcon}><Icon size={15} color={colors.primary} strokeWidth={2.25} /></View><Text style={styles.balanceLabel}>{label}</Text><Text style={[styles.balanceAmount, amount < 0 && styles.negative]}>{formatCurrency(amount)}</Text></View>;
}

const createStyles = (colors: Colors) => StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: colors.canvas},
  header: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.md},
  headerActions: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  greeting: {fontSize: 11, letterSpacing: 1.5, fontWeight: '800', color: colors.primary},
  title: {fontSize: 20, fontWeight: '800', color: colors.ink, marginTop: spacing.xs},
  logout: {height: controlHeight.sm, width: controlHeight.sm, borderRadius: radius.pill, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center'},
  actionPressed: {backgroundColor: colors.surfaceMuted, transform: [{scale: 0.96}]},
  listContent: {paddingHorizontal: spacing.lg},
  summarySpacing: {marginTop: spacing.md},
  balanceSection: {marginTop: spacing.lg},
  sectionTitle: {color: colors.ink, fontSize: 16, fontWeight: '800'},
  balanceRow: {flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm},
  balance: {flex: 1, backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md},
  balanceIcon: {height: 24, width: 24, borderRadius: radius.sm, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center'},
  balanceLabel: {color: colors.inkMuted, fontSize: 12, marginTop: spacing.sm},
  balanceAmount: {color: colors.ink, fontSize: 16, fontWeight: '800', marginTop: spacing.xs},
  negative: {color: colors.expense},
  totalBalance: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm, padding: spacing.md, backgroundColor: colors.surface, borderRadius: radius.md},
  totalLabel: {color: colors.inkMuted, fontSize: 13, fontWeight: '600'},
  totalAmount: {color: colors.ink, fontSize: 18, fontWeight: '800'},
  transactionsSection: {marginTop: spacing.lg},
  transactionsHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  countBadge: {color: colors.inkMuted, fontSize: 11, fontWeight: '700', backgroundColor: colors.surfaceMuted, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs},
  error: {color: colors.expense, fontSize: 12, marginTop: spacing.sm},
  emptyState: {alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.xl},
  emptyIcon: {height: 48, width: 48, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primarySoft},
  emptyTitle: {color: colors.ink, fontSize: 15, fontWeight: '800', marginTop: spacing.md},
  emptyCopy: {color: colors.inkMuted, fontSize: 12, lineHeight: 18, maxWidth: 260, textAlign: 'center', marginTop: spacing.xs},
  emptyAction: {height: controlHeight.sm, flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.md, borderRadius: radius.pill, backgroundColor: colors.primary, marginTop: spacing.md},
  emptyActionText: {color: colors.white, fontSize: 13, fontWeight: '800'},
  footer: {height: spacing.xl * 3},
  fab: {position: 'absolute', right: spacing.lg, bottom: spacing.lg, height: controlHeight.lg, width: controlHeight.lg, borderRadius: radius.pill, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', shadowColor: colors.primary, shadowOpacity: 0.25, shadowRadius: 8, elevation: 5},
  fabPressed: {backgroundColor: colors.primaryDark, transform: [{scale: 0.96}]},
});
