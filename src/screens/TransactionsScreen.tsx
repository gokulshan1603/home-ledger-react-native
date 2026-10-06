import React, {useCallback, useMemo, useRef, useState} from 'react';
import {ActivityIndicator, FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Landmark, Plus, ReceiptText, Wallet} from 'lucide-react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {addMonths} from 'date-fns';
import {TransactionsScreenProps} from '../navigation/types';
import {useTransactions} from '../hooks/useTransactions';
import {useMonthSummary} from '../hooks/useMonthSummary';
import {accountBalance} from '../utils/summary';
import {formatCurrency} from '../utils/format';
import {deleteTransaction as removeTransaction} from '../services/transactionService';
import SummaryCard from '../components/SummaryCard';
import MonthSwitcher from '../components/MonthSwitcher';
import TransactionItem from '../components/TransactionItem';
import AppHeader from '../components/AppHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import {Colors, controlHeight, radius, spacing} from '../constants/theme';
import {useTheme} from '../context/ThemeContext';

type Props = TransactionsScreenProps;

export default function TransactionsScreen({navigation}: Props) {
  const {colors} = useTheme();
  const styles = createStyles(colors);
  const [month, setMonth] = useState(new Date());
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const {transactions, allTransactions, loading, error, refresh, reload} = useTransactions(month);
  const hasFocused = useRef(false);
  useFocusEffect(useCallback(() => {
    if (hasFocused.current) {
      reload();
    }
    hasFocused.current = true;
  }, [reload]));
  const summary = useMonthSummary(transactions);
  const balances = useMemo(() => ({bank: accountBalance(allTransactions, 'bank'), cash: accountBalance(allTransactions, 'cash')}), [allTransactions]);
  const transactionBalances = useMemo(() => {
    const running = {bank: 0, cash: 0};
    const result = new Map<string, number>();
    [...allTransactions].reverse().forEach(transaction => {
      running[transaction.account] += transaction.type === 'income' ? transaction.amount : -transaction.amount;
      result.set(transaction.id, running[transaction.account]);
    });
    return result;
  }, [allTransactions]);
  const now = new Date();
  const isLatestMonth = month.getFullYear() === now.getFullYear() && month.getMonth() === now.getMonth();
  const refreshControl = <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.primary} colors={[colors.primary]} progressBackgroundColor={colors.surface} titleColor={colors.inkMuted} />;

  const confirmDelete = (id: string) => setPendingDeleteId(id);
  const deletePendingTransaction = async () => {
    if (!pendingDeleteId) return;
    const id = pendingDeleteId;
    setPendingDeleteId(null);
    await removeTransaction(id);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader title="Transactions" rightAction={{accessibilityLabel: 'Add entry', onPress: () => navigation.navigate('AddEntry'), icon: <Plus size={20} color={colors.white} strokeWidth={2.4} />}} />
      {loading ? <View style={styles.stateArea}>
        <View style={styles.loader}><ActivityIndicator animating size="large" color={colors.primary} /></View>
        <Text style={[styles.emptyTitle, styles.loadingText]}>Loading transactions…</Text>
      </View> : error ? <View style={styles.stateArea}>
        <Text style={styles.emptyTitle}>Could not load transactions</Text>
        <Text style={styles.emptyCopy}>{error}</Text>
      </View> : transactions.length === 0 ? <ScrollView style={styles.stateScroll} contentContainerStyle={styles.stateScrollContent} alwaysBounceVertical refreshControl={refreshControl}>
        <View style={styles.stateArea}>
          <View style={styles.emptyIcon}><ReceiptText size={24} color={colors.primary} strokeWidth={2.2} /></View>
          <Text style={styles.emptyTitle}>Nothing logged yet</Text>
          <Text style={styles.emptyCopy}>Add your first income or expense for this month.</Text>
          <Pressable accessibilityRole="button" onPress={() => navigation.navigate('AddEntry')} style={({pressed}) => [styles.emptyAction, pressed && styles.actionPressed]}>
            <Plus size={15} color={colors.white} strokeWidth={2.4} />
            <Text style={styles.emptyActionText}>Add entry</Text>
          </Pressable>
        </View>
      </ScrollView> : <>
        <ScrollView style={styles.overviewScroll} contentContainerStyle={styles.overview} alwaysBounceVertical refreshControl={refreshControl}>
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
        </ScrollView>
        <View style={styles.transactionsSection}>
          <View style={styles.transactionsHeader}><Text style={styles.sectionTitle}>Transactions</Text><Text style={styles.countBadge}>{transactions.length} {transactions.length === 1 ? 'entry' : 'entries'}</Text></View>
        </View>
        <View style={styles.transactionsCard}>
          <FlatList
            data={transactions}
            keyExtractor={item => item.id}
            renderItem={({item, index}) => <TransactionItem transaction={item} balance={transactionBalances.get(item.id) ?? 0} isLast={index === transactions.length - 1} onPress={() => navigation.navigate('AddEntry', {transaction: item})} onLongPress={() => confirmDelete(item.id)} />}
            style={styles.transactionsList}
            contentContainerStyle={styles.listContent}
            ListFooterComponent={<View style={styles.footer} />}
          />
        </View>
      </>}
      <ConfirmDialog visible={pendingDeleteId !== null} title="Delete this entry?" message="This cannot be undone." confirmLabel="Delete" onCancel={() => setPendingDeleteId(null)} onConfirm={deletePendingTransaction} />
    </SafeAreaView>
  );
}

function Balance({label, amount, icon: Icon}: {label: string; amount: number; icon: typeof Landmark}) {
  const {colors} = useTheme();
  const styles = createStyles(colors);

  return <View style={styles.balance}><View style={styles.balanceContent}><View style={styles.balanceCopy}><Text style={styles.balanceLabel}>{label}</Text><Text style={[styles.balanceAmount, amount < 0 && styles.negative]}>{formatCurrency(amount)}</Text></View><View style={styles.balanceIcon}><Icon size={24} color={colors.primary} strokeWidth={2.25} /></View></View></View>;
}

const createStyles = (colors: Colors) => StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: colors.canvas},
  overviewScroll: {flexGrow: 0},
  overview: {paddingHorizontal: spacing.lg},
  listContent: {paddingHorizontal: 0},
  stateScroll: {flex: 1},
  stateScrollContent: {flexGrow: 1},
  stateArea: {flex: 1, alignItems: 'center', justifyContent: 'center', marginHorizontal: spacing.lg, marginVertical: spacing.lg, paddingHorizontal: spacing.lg, backgroundColor: colors.surface, borderRadius: radius.lg},
  loader: {height: 52, width: 52, alignItems: 'center', justifyContent: 'center'},
  emptyIcon: {height: controlHeight.md, width: controlHeight.md, marginBottom: spacing.md, borderRadius: radius.pill, backgroundColor: colors.selectionSoft, alignItems: 'center', justifyContent: 'center'},
  summarySpacing: {marginTop: spacing.md},
  balanceSection: {marginTop: spacing.lg},
  sectionTitle: {color: colors.ink, fontSize: 16, fontWeight: '800'},
  balanceRow: {flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm},
  balance: {flex: 1, backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md},
  balanceContent: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  balanceCopy: {flex: 1, minWidth: 0},
  balanceIcon: {height: 44, width: 44, borderRadius: radius.md, backgroundColor: colors.selectionSoft, alignItems: 'center', justifyContent: 'center', marginLeft: spacing.sm},
  balanceLabel: {color: colors.inkMuted, fontSize: 12},
  balanceAmount: {color: colors.ink, fontSize: 16, fontWeight: '800', marginTop: spacing.xs},
  negative: {color: colors.expense},
  totalBalance: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm, padding: spacing.md, backgroundColor: colors.surface, borderRadius: radius.md},
  totalLabel: {color: colors.inkMuted, fontSize: 13, fontWeight: '600'},
  totalAmount: {color: colors.ink, fontSize: 18, fontWeight: '800'},
  transactionsSection: {marginTop: spacing.lg, marginHorizontal: spacing.lg},
  transactionsHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  transactionsCard: {flex: 1, marginHorizontal: spacing.lg, marginVertical: spacing.lg, backgroundColor: colors.surface, borderRadius: radius.lg, overflow: 'hidden'},
  transactionsList: {flex: 1},
  countBadge: {color: colors.inkMuted, fontSize: 11, fontWeight: '700', backgroundColor: colors.surfaceMuted, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs},
  emptyTitle: {color: colors.ink, fontSize: 16, fontWeight: '800'},
  loadingText: {marginTop: spacing.sm},
  emptyCopy: {color: colors.inkMuted, fontSize: 13, lineHeight: 20, maxWidth: 260, textAlign: 'center', marginTop: spacing.xs},
  emptyAction: {height: controlHeight.xs, flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.md, borderRadius: radius.pill, backgroundColor: colors.primary, marginTop: spacing.lg},
  emptyActionText: {color: colors.white, fontSize: 12, fontWeight: '800'},
  footer: {height: spacing.xl * 3},
  actionPressed: {backgroundColor: colors.primaryDark, transform: [{scale: 0.96}]},
});
