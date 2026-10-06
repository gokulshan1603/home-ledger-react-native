import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {IndianRupee} from 'lucide-react-native';
import {Colors, controlHeight, radius, spacing} from '../constants/theme';
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
      <IndianRupee size={28} color={colors.ink} strokeWidth={2.25} />
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
  wrapper: {height: controlHeight.md, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: spacing.md},
  input: {flex: 1, color: colors.ink, fontSize: 32, fontWeight: '800', padding: 0, marginLeft: spacing.sm},
});
