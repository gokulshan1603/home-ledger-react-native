import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {ArrowDown, ArrowUp} from 'lucide-react-native';
import {Colors, controlHeight, radius, spacing} from '../constants/theme';
import {useTheme} from '../context/ThemeContext';
import {formatCurrency, formatShortDate} from '../utils/format';
import {Transaction} from '../types/transaction';

export default function TransactionItem({transaction, onPress, onLongPress}: {transaction: Transaction; onPress: () => void; onLongPress: () => void}) {
  const {colors} = useTheme();
  const styles = createStyles(colors);
  const income = transaction.type === 'income';
  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} delayLongPress={450} style={({pressed}) => [styles.row, pressed && styles.pressed]}>
      <View style={[styles.icon, income ? styles.incomeIcon : styles.expenseIcon]}>{income ? <ArrowUp size={20} color={colors.income} strokeWidth={2.5} /> : <ArrowDown size={20} color={colors.expense} strokeWidth={2.5} />}</View>
      <View style={styles.details}>
        <Text style={styles.category}>{transaction.category}</Text>
        <Text style={styles.meta}>{transaction.account === 'bank' ? 'Bank' : 'Cash'} · {formatShortDate(transaction.date)}{transaction.note ? ` · ${transaction.note}` : ''}</Text>
      </View>
      <Text style={[styles.amount, income ? styles.incomeText : styles.expenseText]}>{income ? '+' : '-'}{formatCurrency(transaction.amount)}</Text>
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
  amount: {fontSize: 14, fontWeight: '800', marginLeft: spacing.sm},
  incomeText: {color: colors.income},
  expenseText: {color: colors.expense},
});
