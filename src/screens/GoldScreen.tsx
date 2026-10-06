import React, {useMemo} from 'react';
import {Alert, FlatList, Pressable, RefreshControl, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {Plus, Trash2} from 'lucide-react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {GoldStackParamList} from '../navigation/types';
import {useGold} from '../hooks/useGold';
import {deleteGold} from '../services/goldService';
import {formatCurrency, formatShortDate} from '../utils/format';
import {Colors, controlHeight, radius, spacing} from '../constants/theme';
import {useTheme} from '../context/ThemeContext';
import AppHeader from '../components/AppHeader';

type Props = NativeStackScreenProps<GoldStackParamList, 'Gold'>;

export default function GoldScreen({navigation}: Props) {
  const {colors} = useTheme(); const styles = createStyles(colors); const {items, loading, error} = useGold();
  const total = useMemo(() => items.filter(item => item.status === 'active').reduce((sum, item) => sum + (item.currentValue ?? item.purchaseAmount), 0), [items]);
  const remove = (id: string) => Alert.alert('Delete gold holding?', 'This cannot be undone.', [{text: 'Cancel', style: 'cancel'}, {text: 'Delete', style: 'destructive', onPress: () => deleteGold(id)}]);
  return <SafeAreaView style={styles.safe}>
    <AppHeader title="Gold holdings" />
    <View style={styles.actions}><Pressable accessibilityLabel="Add gold holding" onPress={() => navigation.navigate('AddGold')} style={({pressed}) => [styles.add, pressed && styles.pressed]}><Plus size={20} color={colors.white} strokeWidth={2.4} /></Pressable></View>
    <FlatList data={items} keyExtractor={item => item.id} contentContainerStyle={styles.list} refreshControl={<RefreshControl refreshing={loading} tintColor={colors.primary} />} ListHeaderComponent={<View style={styles.summary}><Text style={styles.summaryLabel}>Total gold value</Text><Text style={styles.summaryValue}>{formatCurrency(total)}</Text></View>} ListEmptyComponent={!loading ? <View style={styles.empty}><Text style={styles.emptyTitle}>{error ? 'Could not load gold' : 'No gold holdings yet'}</Text><Text style={styles.emptyCopy}>{error ?? 'Add your first gold holding to start tracking it.'}</Text></View> : null} renderItem={({item}) => <Pressable onPress={() => navigation.navigate('AddGold', {holding: item})} onLongPress={() => remove(item.id)} style={({pressed}) => [styles.row, pressed && styles.rowPressed]}><View style={styles.details}><Text style={styles.name}>{item.name}</Text><Text style={styles.meta}>{item.status === 'active' ? 'Active' : 'Sold'} · {formatShortDate(item.purchasedAt)}{item.weight ? ` · ${item.weight}g` : ''}</Text></View><View style={styles.amount}><Text style={styles.value}>{formatCurrency(item.currentValue ?? item.purchaseAmount)}</Text><Text style={styles.editHint}><Trash2 size={12} color={colors.inkMuted} /> Hold to delete</Text></View></Pressable>} />
  </SafeAreaView>;
}

const createStyles = (colors: Colors) => StyleSheet.create({safe: {flex: 1, backgroundColor: colors.canvas}, actions: {alignItems: 'flex-end', paddingHorizontal: spacing.lg, marginTop: -spacing.sm, marginBottom: spacing.sm}, add: {height: controlHeight.sm, width: controlHeight.sm, borderRadius: radius.pill, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'}, pressed: {opacity: 0.78}, list: {paddingHorizontal: spacing.lg, paddingBottom: spacing.xl * 2}, summary: {backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.lg}, summaryLabel: {color: colors.inkMuted, fontSize: 13, fontWeight: '700'}, summaryValue: {color: colors.ink, fontSize: 24, fontWeight: '800', marginTop: spacing.xs}, row: {flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm}, rowPressed: {backgroundColor: colors.surfaceMuted}, details: {flex: 1, minWidth: 0}, name: {color: colors.ink, fontSize: 15, fontWeight: '800'}, meta: {color: colors.inkMuted, fontSize: 12, marginTop: spacing.xs}, amount: {alignItems: 'flex-end', marginLeft: spacing.sm}, value: {color: colors.ink, fontSize: 15, fontWeight: '800'}, editHint: {color: colors.inkMuted, fontSize: 10, marginTop: spacing.xs}, empty: {alignItems: 'center', padding: spacing.xl, backgroundColor: colors.surface, borderRadius: radius.lg}, emptyTitle: {color: colors.ink, fontSize: 16, fontWeight: '800'}, emptyCopy: {color: colors.inkMuted, textAlign: 'center', marginTop: spacing.xs, lineHeight: 20}});
