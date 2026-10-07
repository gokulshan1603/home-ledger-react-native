import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Svg, {Defs, LinearGradient, Rect, Stop} from 'react-native-svg';
import {Colors, radius, spacing} from '../constants/theme';
import {useTheme} from '../context/ThemeContext';
import {formatCurrency} from '../utils/format';

export default function SummaryCard({income, expense, net}: {income: number; expense: number; net: number}) {
  const {colors} = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.card}>
      <Svg style={StyleSheet.absoluteFillObject} viewBox="0 0 1 1" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="monthlyOverviewGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={colors.primary} />
            <Stop offset="50%" stopColor={colors.primary} />
            <Stop offset="100%" stopColor={colors.primaryDark} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="1" height="1" fill="url(#monthlyOverviewGradient)" />
      </Svg>
      <View style={styles.content}>
        <View style={styles.netRow}>
          <Text style={styles.netLabel}>Net this month</Text>
          <Text style={[styles.net, net < 0 && styles.negative]}>{net < 0 ? '-' : ''}{formatCurrency(Math.abs(net))}</Text>
        </View>
        <View style={styles.stats}>
          <View style={styles.stat}><Text style={styles.statLabel}>Income</Text><Text style={[styles.amount, styles.income]}>{formatCurrency(income)}</Text></View>
          <View style={styles.stat}><Text style={styles.statLabel}>Expenses</Text><Text style={[styles.amount, styles.expense]}>{formatCurrency(expense)}</Text></View>
        </View>
      </View>
    </View>
  );
}

const createStyles = (colors: Colors) => StyleSheet.create({
  card: {backgroundColor: colors.primaryDark, borderRadius: radius.lg, overflow: 'hidden'},
  content: {padding: spacing.md, zIndex: 1},
  netRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  netLabel: {color: colors.white, fontSize: 15, fontWeight: '600'},
  net: {color: colors.white, fontSize: 24, fontWeight: '800'},
  negative: {color: colors.summaryNegative},
  stats: {flexDirection: 'row', gap: spacing.lg, marginTop: spacing.sm},
  stat: {flex: 1, alignItems: 'flex-start'},
  statLabel: {color: colors.white, fontSize: 13, fontWeight: '600', marginBottom: spacing.xs},
  amount: {alignSelf: 'flex-start', paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: radius.sm, fontSize: 15, fontWeight: '800'},
  income: {color: colors.white, backgroundColor: colors.income},
  expense: {color: colors.white, backgroundColor: colors.expense},
});
