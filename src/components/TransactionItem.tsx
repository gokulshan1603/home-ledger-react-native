import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {ArrowDown, ArrowUp} from 'lucide-react-native';
import {Colors, controlHeight, radius, spacing} from '../constants/theme';
import {useTheme} from '../context/ThemeContext';
import {formatCurrency, formatShortDate} from '../utils/format';
import {Transaction} from '../types/transaction';

export default function TransactionItem({transaction, balance, onPress, onLongPress}: {transaction: Transaction; balance: number; onPress: () => void; onLongPress: () => void}) {
  const {colors} = useTheme();
  const styles = createStyles(colors);
  const income = transaction.type === 'income';
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${transaction.category}, ${income ? 'income' : 'expense'} ${formatCurrency(transaction.amount)}, balance ${formatCurrency(balance)}`} accessibilityHint="Tap to edit. Long press to delete." onPress={onPress} onLongPress={onLongPress} delayLongPress={450} style={({pressed}) => [styles.row, pressed && styles.pressed]}>
      <View style={[styles.icon, income ? styles.incomeIcon : styles.expenseIcon]}>{income ? <ArrowUp size={20} color={colors.income} strokeWidth={2.5} /> : <ArrowDown size={20} color={colors.expense} strokeWidth={2.5} />}</View>
      <View style={styles.details}>
        <Text style={styles.category} numberOfLines={1}>{transaction.category}</Text>
        <Text style={styles.meta} numberOfLines={1} ellipsizeMode="tail">{transaction.account === 'bank' ? 'Bank' : 'Cash'} · {formatShortDate(transaction.date)}{transaction.note ? ` · ${transaction.note}` : ''}</Text>
      </View>
      <View style={styles.amounts}>
        <Text style={[styles.amount, income ? styles.incomeText : styles.expenseText]}>{income ? '+' : '-'}{formatCurrency(transaction.amount)}</Text>
        <Text style={styles.balance}>Balance {formatCurrency(balance)}</Text>
      </View>
    </Pressable>
  );
}

const createStyles = (colors: Colors) => StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'center', padding: spacing.md, marginTop: spacing.sm, backgroundColor: colors.surface, borderRadius: radius.md},
  pressed: {backgroundColor: colors.surfaceMuted, transform: [{scale: 0.99}]},
  icon: {height: controlHeight.sm, width: controlHeight.sm, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm},
  incomeIcon: {backgroundColor: colors.incomeSoft},
  expenseIcon: {backgroundColor: colors.expenseSoft},
  details: {flex: 1, minWidth: 0},
  category: {color: colors.ink, fontSize: 14, fontWeight: '700'},
  meta: {color: colors.inkMuted, fontSize: 12, marginTop: spacing.xs},
  amounts: {alignItems: 'flex-end', marginLeft: spacing.sm},
  amount: {fontSize: 14, fontWeight: '800'},
  balance: {color: colors.inkMuted, fontSize: 11, fontWeight: '600', marginTop: spacing.xs},
  incomeText: {color: colors.income},
  expenseText: {color: colors.expense},
});
