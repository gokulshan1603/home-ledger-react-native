import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Landmark, Wallet} from 'lucide-react-native';
import {AccountType} from '../types/transaction';
import {Colors, radius, spacing} from '../constants/theme';
import {useTheme} from '../context/ThemeContext';

export default function AccountToggle({value, onChange}: {value: AccountType; onChange: (value: AccountType) => void}) {
  const {colors} = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      {(['bank', 'cash'] as AccountType[]).map(account => (
        <Pressable key={account} onPress={() => onChange(account)} style={[styles.option, value === account && styles.selected]}>
          {account === 'bank' ? <Landmark size={17} color={colors.primary} strokeWidth={2.25} /> : <Wallet size={17} color={colors.primary} strokeWidth={2.25} />}
          <Text style={[styles.label, value === account && styles.selectedLabel]}>{account === 'bank' ? 'Bank' : 'Cash'}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const createStyles = (colors: Colors) => StyleSheet.create({
  container: {flexDirection: 'row', backgroundColor: colors.surfaceMuted, borderRadius: radius.md, padding: 4},
  option: {flex: 1, minHeight: 48, borderRadius: radius.sm, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs},
  selected: {backgroundColor: colors.surface, shadowColor: colors.black, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2},
  label: {fontSize: 15, fontWeight: '600', color: colors.inkMuted},
  selectedLabel: {color: colors.ink},
});
