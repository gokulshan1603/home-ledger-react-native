import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {IndianRupee} from 'lucide-react-native';
import {Colors, controlHeight, radius, spacing} from '../constants/theme';
import {useTheme} from '../context/ThemeContext';
import {amountToWords} from '../utils/format';

interface Props {
  value: string;
  onChangeText: (value: string) => void;
}

export default function AmountInput({value, onChangeText}: Props) {
  const {colors} = useTheme();
  const styles = createStyles(colors);
  const words = amountToWords(value);

  return (
    <View>
      <View style={styles.wrapper}>
        <IndianRupee size={18} color={colors.ink} strokeWidth={2.25} />
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
      {words ? <Text style={styles.words}>{words}</Text> : null}
    </View>
  );
}

const createStyles = (colors: Colors) => StyleSheet.create({
  wrapper: {height: controlHeight.md, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: spacing.md},
  input: {flex: 1, color: colors.ink, fontSize: 14, fontWeight: '600', padding: 0, marginLeft: spacing.sm},
  words: {color: colors.inkMuted, fontSize: 11, fontWeight: '600', lineHeight: 16, marginTop: spacing.xs, paddingHorizontal: spacing.sm},
});
