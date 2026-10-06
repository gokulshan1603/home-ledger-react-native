import React, {useCallback, useMemo, useRef, useState} from 'react';
import {ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {HandCoins, Plus} from 'lucide-react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LoansStackParamList} from '../navigation/types';
import {useLoans} from '../hooks/useLoans';
import {deleteLoan} from '../services/loanService';
import {LoanDirection} from '../types/loan';
import {formatCurrency, formatShortDate} from '../utils/format';
import {Colors, controlHeight, radius, spacing} from '../constants/theme';
import {useTheme} from '../context/ThemeContext';
import AppHeader from '../components/AppHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import MessageDialog from '../components/MessageDialog';

type Props = NativeStackScreenProps<LoansStackParamList, 'Loans'>;

export default function LoansScreen({navigation}: Props) {
  const {colors} = useTheme();
  const styles = createStyles(colors);
  const {items, loading, error, refresh, reload} = useLoans();
  const [direction, setDirection] = useState<LoanDirection>('given');
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [messageDialog, setMessageDialog] = useState<{title: string; message: string} | null>(null);
  const refreshOnFocus = useRef(false);
  const visible = useMemo(() => items.filter(item => item.direction === direction), [direction, items]);
  const activeItems = useMemo(() => visible.filter(item => item.status === 'active'), [visible]);
  const totalPrincipal = useMemo(() => activeItems.reduce((sum, item) => sum + item.principal, 0), [activeItems]);

  useFocusEffect(useCallback(() => {
    if (refreshOnFocus.current) {
      refreshOnFocus.current = false;
      reload();
    }
  }, [reload]));

  const refreshControl = <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.primary} colors={[colors.primary]} progressBackgroundColor={colors.surface} titleColor={colors.inkMuted} />;

  const confirmDelete = (id: string) => setPendingDeleteId(id);
  const deletePendingLoan = async () => {
    if (!pendingDeleteId) return;
    const id = pendingDeleteId;
    setPendingDeleteId(null);
    try {
      await deleteLoan(id);
      await reload();
    } catch {
      setMessageDialog({title: 'Could not delete loan', message: 'Please check your connection and try again.'});
    }
  };

  const openAddLoan = () => {
    refreshOnFocus.current = true;
    navigation.navigate('AddLoan');
  };
  const openEditLoan = (id: string) => {
    refreshOnFocus.current = true;
    const loan = items.find(item => item.id === id);
    if (loan) navigation.navigate('AddLoan', {loan});
  };

  const directionToggle = <View style={styles.toggle}>{(['given', 'taken'] as LoanDirection[]).map(item => <Pressable key={item} onPress={() => setDirection(item)} style={[styles.toggleOption, direction === item && styles.selected]}><Text style={[styles.toggleText, direction === item && styles.selectedText]}>{item === 'given' ? 'Loans given' : 'Loans taken'}</Text></Pressable>)}</View>;

  return <SafeAreaView style={styles.safeArea} edges={['top']}>
    <AppHeader title="Loans" rightAction={{accessibilityLabel: 'Add loan', onPress: openAddLoan, icon: <Plus size={20} color={colors.white} strokeWidth={2.4} />}} />
    {loading ? <View style={styles.stateArea}>
      <View style={styles.loader}><ActivityIndicator animating size="large" color={colors.primary} /></View>
      <Text style={[styles.emptyTitle, styles.loadingText]}>Loading loans…</Text>
    </View> : error ? <ScrollView style={styles.stateScroll} contentContainerStyle={styles.stateScrollContent} alwaysBounceVertical refreshControl={refreshControl}>
      <View style={styles.stateToggle}>{directionToggle}</View>
      <View style={[styles.stateArea, styles.stateCard]}>
        <View style={styles.emptyIcon}><HandCoins size={25} color={colors.primary} strokeWidth={2.15} /></View>
        <Text style={styles.emptyTitle}>Could not load loans</Text>
        <Text style={styles.emptyCopy}>{error}</Text>
      </View>
    </ScrollView> : visible.length === 0 ? <ScrollView style={styles.stateScroll} contentContainerStyle={styles.stateScrollContent} alwaysBounceVertical refreshControl={refreshControl}>
      <View style={styles.stateToggle}>{directionToggle}</View>
      <View style={[styles.stateArea, styles.stateCard]}>
        <View style={styles.emptyIcon}><HandCoins size={25} color={colors.primary} strokeWidth={2.15} /></View>
        <Text style={styles.emptyTitle}>No loans {direction === 'given' ? 'given' : 'taken'} yet</Text>
        <Text style={styles.emptyCopy}>Add a loan to start tracking it.</Text>
        <Pressable accessibilityRole="button" onPress={openAddLoan} style={({pressed}) => [styles.emptyAction, pressed && styles.actionPressed]}>
          <Plus size={15} color={colors.white} strokeWidth={2.4} />
          <Text style={styles.emptyActionText}>Add loan</Text>
        </Pressable>
      </View>
    </ScrollView> : <ScrollView style={styles.contentScroll} contentContainerStyle={styles.content} alwaysBounceVertical refreshControl={refreshControl}>
      {directionToggle}
      <View style={styles.summaryCard}>
        <View style={styles.summaryTop}>
          <View style={styles.summaryCopy}>
            <Text style={styles.summaryLabel}>{direction === 'given' ? 'Given principal' : 'Taken principal'}</Text>
            <Text style={styles.summaryValue}>{formatCurrency(totalPrincipal)}</Text>
          </View>
          <View style={styles.summaryIcon}><HandCoins size={25} color={colors.primary} strokeWidth={2.1} /></View>
        </View>
        <Text style={styles.summaryMeta}>{activeItems.length} active {activeItems.length === 1 ? 'loan' : 'loans'}</Text>
      </View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{direction === 'given' ? 'Loans given' : 'Loans taken'}</Text>
        <Text style={styles.countBadge}>{visible.length} {visible.length === 1 ? 'item' : 'items'}</Text>
      </View>
      <View style={styles.loansCard}>
        {visible.map((item, index) => <Pressable key={item.id} onPress={() => openEditLoan(item.id)} onLongPress={() => confirmDelete(item.id)} delayLongPress={450} style={({pressed}) => [styles.row, index < visible.length - 1 && styles.rowDivider, pressed && styles.rowPressed]}>
          <View style={styles.itemIcon}><HandCoins size={20} color={colors.primary} strokeWidth={2.15} /></View>
          <View style={styles.details}>
            <Text style={styles.name} numberOfLines={1}>{item.partyName}</Text>
            <Text style={styles.meta} numberOfLines={1}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)} · Started {formatShortDate(item.startedAt)}</Text>
          </View>
          <View style={styles.amount}>
            <Text style={styles.value}>{formatCurrency(item.principal)}</Text>
            <Text style={styles.amountLabel}>Principal</Text>
          </View>
        </Pressable>)}
      </View>
    </ScrollView>}
    <ConfirmDialog visible={pendingDeleteId !== null} title="Delete this loan?" message="This cannot be undone." confirmLabel="Delete" onCancel={() => setPendingDeleteId(null)} onConfirm={deletePendingLoan} />
    <MessageDialog visible={messageDialog !== null} title={messageDialog?.title ?? ''} message={messageDialog?.message ?? ''} onClose={() => setMessageDialog(null)} />
  </SafeAreaView>;
}

const createStyles = (colors: Colors) => StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: colors.canvas},
  contentScroll: {flex: 1},
  content: {paddingHorizontal: spacing.lg, paddingBottom: spacing.xl * 2},
  toggle: {flexDirection: 'row', padding: spacing.xs, backgroundColor: colors.surfaceMuted, borderRadius: radius.md},
  toggleOption: {flex: 1, minHeight: controlHeight.sm, alignItems: 'center', justifyContent: 'center', borderRadius: radius.sm},
  selected: {backgroundColor: colors.surface},
  toggleText: {color: colors.inkMuted, fontWeight: '700', fontSize: 12},
  selectedText: {color: colors.ink},
  summaryCard: {backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginTop: spacing.lg},
  summaryTop: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  summaryCopy: {flex: 1, minWidth: 0},
  summaryLabel: {color: colors.inkMuted, fontSize: 13, fontWeight: '700'},
  summaryValue: {color: colors.ink, fontSize: 24, fontWeight: '800', marginTop: spacing.xs},
  summaryMeta: {color: colors.inkMuted, fontSize: 12, fontWeight: '600', marginTop: spacing.md},
  summaryIcon: {height: 44, width: 44, borderRadius: radius.md, backgroundColor: colors.selectionSoft, alignItems: 'center', justifyContent: 'center', marginLeft: spacing.sm},
  sectionHeader: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.lg, marginBottom: spacing.sm},
  sectionTitle: {color: colors.ink, fontSize: 16, fontWeight: '800'},
  countBadge: {color: colors.inkMuted, fontSize: 11, fontWeight: '700', backgroundColor: colors.surfaceMuted, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs},
  loansCard: {backgroundColor: colors.surface, borderRadius: radius.lg, overflow: 'hidden'},
  row: {flexDirection: 'row', alignItems: 'center', padding: spacing.md},
  rowDivider: {borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line},
  rowPressed: {backgroundColor: colors.surfaceMuted},
  itemIcon: {height: controlHeight.sm, width: controlHeight.sm, borderRadius: radius.sm, backgroundColor: colors.selectionSoft, alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm},
  details: {flex: 1, minWidth: 0},
  name: {color: colors.ink, fontSize: 14, fontWeight: '700'},
  meta: {color: colors.inkMuted, fontSize: 12, marginTop: spacing.xs},
  amount: {alignItems: 'flex-end', marginLeft: spacing.sm},
  value: {color: colors.ink, fontSize: 14, fontWeight: '800'},
  amountLabel: {color: colors.inkMuted, fontSize: 11, fontWeight: '600', marginTop: spacing.xs},
  stateScroll: {flex: 1},
  stateScrollContent: {flexGrow: 1},
  stateToggle: {marginHorizontal: spacing.lg},
  stateArea: {flex: 1, alignItems: 'center', justifyContent: 'center', marginHorizontal: spacing.lg, marginTop: 0, marginBottom: spacing.lg, paddingHorizontal: spacing.lg, backgroundColor: colors.surface, borderRadius: radius.lg},
  stateCard: {marginTop: spacing.lg},
  loader: {height: 52, width: 52, alignItems: 'center', justifyContent: 'center'},
  emptyIcon: {height: controlHeight.md, width: controlHeight.md, marginBottom: spacing.md, borderRadius: radius.pill, backgroundColor: colors.selectionSoft, alignItems: 'center', justifyContent: 'center'},
  emptyTitle: {color: colors.ink, fontSize: 16, fontWeight: '800'},
  loadingText: {marginTop: spacing.sm},
  emptyCopy: {color: colors.inkMuted, fontSize: 13, lineHeight: 20, maxWidth: 260, textAlign: 'center', marginTop: spacing.xs},
  emptyAction: {height: controlHeight.xs, flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.md, borderRadius: radius.pill, backgroundColor: colors.primary, marginTop: spacing.lg},
  emptyActionText: {color: colors.white, fontSize: 12, fontWeight: '800'},
  actionPressed: {backgroundColor: colors.primaryDark, transform: [{scale: 0.96}]},
});
