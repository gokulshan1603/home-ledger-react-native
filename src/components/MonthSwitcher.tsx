import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {ChevronLeft, ChevronRight} from 'lucide-react-native';
import {formatMonth} from '../utils/format';
import {Colors, radius} from '../constants/theme';
import {useTheme} from '../context/ThemeContext';

export default function MonthSwitcher({month, onPrevious, onNext}: {month: Date; onPrevious: () => void; onNext: () => void}) {
  const {colors} = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Pressable accessibilityLabel="Previous month" onPress={onPrevious} style={styles.button}><ChevronLeft size={21} color={colors.primary} strokeWidth={2.25} /></Pressable>
      <Text style={styles.month}>{formatMonth(month)}</Text>
      <Pressable accessibilityLabel="Next month" onPress={onNext} style={styles.button}><ChevronRight size={21} color={colors.primary} strokeWidth={2.25} /></Pressable>
    </View>
  );
}

const createStyles = (colors: Colors) => StyleSheet.create({
  container: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surface, borderRadius: radius.pill, padding: 4},
  button: {height: 36, width: 36, alignItems: 'center', justifyContent: 'center', borderRadius: radius.pill, backgroundColor: colors.surfaceMuted},
  month: {fontSize: 16, fontWeight: '700', color: colors.ink},
});
