import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Colors, radius, spacing} from '../constants/theme';
import {useTheme} from '../context/ThemeContext';
import {formatCurrency} from '../utils/format';

export default function SummaryCard({income, expense, net}: {income: number; expense: number; net: number}) {
  const {colors} = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>MONTHLY OVERVIEW</Text>
      <View style={styles.netRow}>
        <Text style={styles.netLabel}>Net this month</Text>
        <Text style={[styles.net, net < 0 && styles.negative]}>{net < 0 ? '-' : ''}{formatCurrency(Math.abs(net))}</Text>
      </View>
      <View style={styles.stats}>
        <View style={styles.stat}><Text style={styles.statLabel}>Income</Text><Text style={[styles.amount, styles.income]}>{formatCurrency(income)}</Text></View>
        <View style={styles.stat}><Text style={styles.statLabel}>Expenses</Text><Text style={[styles.amount, styles.expense]}>{formatCurrency(expense)}</Text></View>
      </View>
    </View>
  );
}

const createStyles = (colors: Colors) => StyleSheet.create({
  card: {backgroundColor: colors.summaryInk, borderRadius: radius.lg, padding: spacing.lg, shadowColor: colors.black, shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: {width: 0, height: 6}, elevation: 3},
  eyebrow: {color: colors.summaryEyebrow, fontSize: 11, fontWeight: '800', letterSpacing: 1.2},
  netRow: {marginTop: spacing.sm, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between'},
  netLabel: {color: colors.white, fontSize: 15, fontWeight: '600'},
  net: {color: colors.summaryNet, fontSize: 24, fontWeight: '800'},
  negative: {color: colors.summaryNegative},
  stats: {flexDirection: 'row', gap: spacing.lg},
  stat: {flex: 1},
  statLabel: {color: colors.summaryLabel, fontSize: 13, marginBottom: spacing.xs},
  amount: {fontSize: 15, fontWeight: '700'},
  income: {color: colors.summaryNet},
  expense: {color: colors.summaryNegative},
});
