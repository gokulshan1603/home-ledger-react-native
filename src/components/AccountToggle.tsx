import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Landmark, Wallet} from 'lucide-react-native';
import {AccountType} from '../types/transaction';
import {Colors, controlHeight, radius, spacing} from '../constants/theme';
import {useTheme} from '../context/ThemeContext';

export default function AccountToggle({value, onChange}: {value: AccountType; onChange: (value: AccountType) => void}) {
  const {colors} = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      {(['bank', 'cash'] as AccountType[]).map(account => (
        <Pressable key={account} onPress={() => onChange(account)} style={({pressed}) => [styles.option, value === account && styles.selected, pressed && styles.pressed]}>
          {account === 'bank' ? <Landmark size={17} color={value === account ? colors.white : colors.inkMuted} strokeWidth={2.25} /> : <Wallet size={17} color={value === account ? colors.white : colors.inkMuted} strokeWidth={2.25} />}
          <Text style={[styles.label, value === account && styles.selectedLabel]}>{account === 'bank' ? 'Bank' : 'Cash'}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const createStyles = (colors: Colors) => StyleSheet.create({
  container: {flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.xs},
  option: {flex: 1, minHeight: controlHeight.sm, borderRadius: radius.sm, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm},
  selected: {backgroundColor: colors.primary},
  pressed: {opacity: 0.78},
  label: {fontSize: 14, fontWeight: '600', color: colors.inkMuted},
  selectedLabel: {color: colors.white},
});
