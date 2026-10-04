import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {IndianRupee} from 'lucide-react-native';
import {Colors, spacing} from '../constants/theme';
import {useTheme} from '../context/ThemeContext';

interface Props {
  value: string;
  onChangeText: (value: string) => void;
}

export default function AmountInput({value, onChangeText}: Props) {
  const {colors} = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.wrapper}>
      <IndianRupee size={28} color={colors.primary} strokeWidth={2.25} />
      <TextInput
        value={value}
        onChangeText={text => onChangeText(text.replace(/[^0-9.]/g, ''))}
        keyboardType="decimal-pad"
        placeholder="0"
        placeholderTextColor={colors.inkMuted}
        style={styles.input}
        autoFocus
      />
    </View>
  );
}

const createStyles = (colors: Colors) => StyleSheet.create({
  wrapper: {flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.primary, paddingVertical: spacing.sm},
  input: {flex: 1, color: colors.ink, fontSize: 36, fontWeight: '700', padding: 0},
});
