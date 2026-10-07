import React, {useCallback, useMemo, useRef, useState} from 'react';
import {ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import Svg, {Defs, LinearGradient, Rect, Stop} from 'react-native-svg';
import {useFocusEffect} from '@react-navigation/native';
import {BadgeIndianRupee, CalendarClock, CalendarDays, CalendarRange, Plus} from 'lucide-react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FDStackParamList} from '../navigation/types';
import {useFixedDeposits} from '../hooks/useFixedDeposits';
import {deleteFixedDeposit} from '../services/fdService';
import {formatCurrency, formatDate} from '../utils/format';
import {Colors, controlHeight, radius, spacing} from '../constants/theme';
import {useTheme} from '../context/ThemeContext';
import AppHeader from '../components/AppHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import MessageDialog from '../components/MessageDialog';

type Props = NativeStackScreenProps<FDStackParamList, 'FD'>;

export default function FixedDepositScreen({navigation}: Props) {
  const {colors} = useTheme();
  const styles = createStyles(colors);
  const {items, loading, error, refresh, reload} = useFixedDeposits();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [messageDialog, setMessageDialog] = useState<{title: string; message: string} | null>(null);
  const refreshOnFocus = useRef(false);
  const activeItems = useMemo(() => items.filter(item => item.status === 'active'), [items]);
  const totalPrincipal = useMemo(() => activeItems.reduce((sum, item) => sum + item.principal, 0), [activeItems]);
  const annualInterest = useMemo(() => activeItems.reduce((sum, item) => sum + (item.principal * (item.interestRate ?? 0)) / 100, 0), [activeItems]);
  const monthlyInterest = annualInterest / 12;
  const quarterlyInterest = annualInterest / 4;
  const maturityAmount = useMemo(() => activeItems.reduce((sum, item) => sum + item.maturityAmount, 0), [activeItems]);

  useFocusEffect(useCallback(() => {
    if (refreshOnFocus.current) {
      refreshOnFocus.current = false;
      reload();
    }
  }, [reload]));

  const refreshControl = <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.primary} colors={[colors.primary]} progressBackgroundColor={colors.surface} titleColor={colors.inkMuted} />;

  const confirmDelete = (id: string) => setPendingDeleteId(id);
  const deletePendingDeposit = async () => {
    if (!pendingDeleteId) return;
    const id = pendingDeleteId;
    setPendingDeleteId(null);
    try {
      await deleteFixedDeposit(id);
      await reload();
    } catch {
      setMessageDialog({title: 'Could not delete fixed deposit', message: 'Please check your connection and try again.'});
    }
  };

  const openAddDeposit = () => {
    refreshOnFocus.current = true;
    navigation.navigate('AddFD');
  };
  const openEditDeposit = (id: string) => {
    refreshOnFocus.current = true;
    const deposit = items.find(item => item.id === id);
    if (deposit) navigation.navigate('AddFD', {deposit});
  };

  return <SafeAreaView style={styles.safeArea} edges={['top']}>
    <AppHeader title="Fixed deposits" rightAction={{accessibilityLabel: 'Add fixed deposit', onPress: openAddDeposit, icon: <Plus size={20} color={colors.white} strokeWidth={2.4} />}} />
    {loading ? <View style={styles.stateArea}>
      <View style={styles.loader}><ActivityIndicator animating size="large" color={colors.primary} /></View>
      <Text style={[styles.emptyTitle, styles.loadingText]}>Loading fixed deposits…</Text>
    </View> : error ? <ScrollView style={styles.stateScroll} contentContainerStyle={styles.stateScrollContent} alwaysBounceVertical refreshControl={refreshControl}>
      <View style={styles.stateArea}>
        <View style={styles.emptyIcon}><BadgeIndianRupee size={25} color={colors.primary} strokeWidth={2.15} /></View>
        <Text style={styles.emptyTitle}>Could not load fixed deposits</Text>
        <Text style={styles.emptyCopy}>{error}</Text>
      </View>
    </ScrollView> : items.length === 0 ? <ScrollView style={styles.stateScroll} contentContainerStyle={styles.stateScrollContent} alwaysBounceVertical refreshControl={refreshControl}>
      <View style={styles.stateArea}>
        <View style={styles.emptyIcon}><BadgeIndianRupee size={25} color={colors.primary} strokeWidth={2.15} /></View>
        <Text style={styles.emptyTitle}>No fixed deposits yet</Text>
        <Text style={styles.emptyCopy}>Add an FD to start tracking maturity and interest.</Text>
        <Pressable accessibilityRole="button" onPress={openAddDeposit} style={({pressed}) => [styles.emptyAction, pressed && styles.actionPressed]}>
          <Plus size={15} color={colors.white} strokeWidth={2.4} />
          <Text style={styles.emptyActionText}>Add deposit</Text>
        </Pressable>
      </View>
    </ScrollView> : <ScrollView style={styles.contentScroll} contentContainerStyle={styles.content} alwaysBounceVertical refreshControl={refreshControl}>
      <View style={styles.principalCard}>
        <Svg style={StyleSheet.absoluteFillObject} viewBox="0 0 1 1" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="fixedDepositSummaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={colors.primary} />
              <Stop offset="100%" stopColor={colors.primaryDark} />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="1" height="1" fill="url(#fixedDepositSummaryGradient)" />
        </Svg>
        <View style={styles.principalContent}>
          <Text style={styles.principalLabel}>Active principal</Text>
          <Text style={styles.principalValue}>{formatCurrency(totalPrincipal)}</Text>
        </View>
      </View>
      <View style={styles.statsGrid}>
        <DepositStat label="Monthly interest" amount={monthlyInterest} icon={CalendarClock} />
        <DepositStat label="Quarterly interest" amount={quarterlyInterest} icon={CalendarDays} />
        <DepositStat label="Annual interest" amount={annualInterest} icon={CalendarRange} />
        <DepositStat label="Maturity amount" amount={maturityAmount} icon={BadgeIndianRupee} />
      </View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Deposits</Text>
        <Text style={styles.countBadge}>{items.length} {items.length === 1 ? 'item' : 'items'}</Text>
      </View>
      <View style={styles.depositsCard}>
        {items.map((item, index) => <Pressable key={item.id} onPress={() => openEditDeposit(item.id)} onLongPress={() => confirmDelete(item.id)} delayLongPress={450} style={({pressed}) => [styles.row, index < items.length - 1 && styles.rowDivider, pressed && styles.rowPressed]}>
          <View style={styles.itemIcon}><BadgeIndianRupee size={20} color={colors.primary} strokeWidth={2.15} /></View>
          <View style={styles.details}>
            <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.meta} numberOfLines={1}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)} · {item.interestFrequency === 'on_maturity' ? 'On maturity' : item.interestFrequency.charAt(0).toUpperCase() + item.interestFrequency.slice(1)}{item.interestRate ? ` · ${item.interestRate}%` : ''}</Text>
            <Text style={styles.meta} numberOfLines={1}>Starts {formatDate(item.startedAt)} · Matures {formatDate(item.maturityAt)}</Text>
          </View>
          <View style={styles.amount}>
            <Text style={styles.value}>{formatCurrency(item.maturityAmount)}</Text>
            <Text style={styles.amountLabel}>Maturity amount</Text>
          </View>
        </Pressable>)}
      </View>
    </ScrollView>}
    <ConfirmDialog visible={pendingDeleteId !== null} title="Delete this fixed deposit?" message="This cannot be undone." confirmLabel="Delete" onCancel={() => setPendingDeleteId(null)} onConfirm={deletePendingDeposit} />
    <MessageDialog visible={messageDialog !== null} title={messageDialog?.title ?? ''} message={messageDialog?.message ?? ''} onClose={() => setMessageDialog(null)} />
  </SafeAreaView>;
}

function DepositStat({label, amount, icon: Icon}: {label: string; amount: number; icon: typeof CalendarClock}) {
  const {colors} = useTheme();
  const styles = createStyles(colors);

  return <View style={styles.statCard}><View style={styles.statCopy}><Text style={styles.statLabel}>{label}</Text><Text style={styles.statAmount}>{formatCurrency(amount)}</Text></View><View style={styles.statIcon}><Icon size={24} color={colors.primary} strokeWidth={2.25} /></View></View>;
}

const createStyles = (colors: Colors) => StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: colors.canvas},
  contentScroll: {flex: 1},
  content: {paddingHorizontal: spacing.lg, paddingBottom: spacing.xl * 2},
  principalCard: {backgroundColor: colors.primaryDark, borderRadius: radius.lg, overflow: 'hidden', shadowColor: colors.ink, shadowOpacity: 0.14, shadowRadius: 12, shadowOffset: {width: 0, height: 5}, elevation: 3},
  principalContent: {padding: spacing.md, zIndex: 1},
  principalLabel: {color: colors.white, fontSize: 15, fontWeight: '600'},
  principalValue: {color: colors.white, fontSize: 26, fontWeight: '800', marginTop: spacing.xs},
  statsGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm},
  statCard: {width: '48%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md},
  statCopy: {flex: 1, minWidth: 0},
  statIcon: {height: 44, width: 44, borderRadius: radius.md, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginLeft: spacing.sm},
  statLabel: {color: colors.inkMuted, fontSize: 12},
  statAmount: {color: colors.ink, fontSize: 16, fontWeight: '800', marginTop: spacing.xs},
  sectionHeader: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.lg, marginBottom: spacing.sm},
  sectionTitle: {color: colors.ink, fontSize: 16, fontWeight: '800'},
  countBadge: {color: colors.inkMuted, fontSize: 12, backgroundColor: colors.surface, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs},
  depositsCard: {backgroundColor: colors.surface, borderRadius: radius.lg, overflow: 'hidden'},
  row: {flexDirection: 'row', alignItems: 'center', padding: spacing.md},
  rowDivider: {borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line},
  rowPressed: {backgroundColor: colors.surfaceMuted},
  itemIcon: {height: controlHeight.sm, width: controlHeight.sm, borderRadius: radius.sm, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm},
  details: {flex: 1, minWidth: 0},
  name: {color: colors.ink, fontSize: 14, fontWeight: '700'},
  meta: {color: colors.inkMuted, fontSize: 12, marginTop: spacing.xs},
  amount: {alignItems: 'flex-end', marginLeft: spacing.sm},
  value: {color: colors.ink, fontSize: 14, fontWeight: '800'},
  amountLabel: {color: colors.inkMuted, fontSize: 12,  marginTop: spacing.xs},
  stateScroll: {flex: 1},
  stateScrollContent: {flexGrow: 1},
  stateArea: {flex: 1, alignItems: 'center', justifyContent: 'center', marginHorizontal: spacing.lg, marginTop: 0, marginBottom: spacing.lg, paddingHorizontal: spacing.lg, backgroundColor: colors.surface, borderRadius: radius.lg},
  loader: {height: 52, width: 52, alignItems: 'center', justifyContent: 'center'},
  emptyIcon: {height: controlHeight.md, width: controlHeight.md, marginBottom: spacing.md, borderRadius: radius.pill, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center'},
  emptyTitle: {color: colors.ink, fontSize: 16, fontWeight: '800'},
  loadingText: {marginTop: spacing.sm},
  emptyCopy: {color: colors.inkMuted, fontSize: 13, lineHeight: 20, maxWidth: 260, textAlign: 'center', marginTop: spacing.xs},
  emptyAction: {height: controlHeight.xs, flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.md, borderRadius: radius.pill, backgroundColor: colors.primary, marginTop: spacing.lg},
  emptyActionText: {color: colors.white, fontSize: 12, fontWeight: '800'},
  actionPressed: {backgroundColor: colors.primaryDark, transform: [{scale: 0.96}]},
});
