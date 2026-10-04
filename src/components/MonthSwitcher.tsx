import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {ChevronLeft, ChevronRight} from 'lucide-react-native';
import {formatMonth} from '../utils/format';
import {Colors, controlHeight, radius, spacing} from '../constants/theme';
import {useTheme} from '../context/ThemeContext';

export default function MonthSwitcher({month, onPrevious, onNext}: {month: Date; onPrevious: () => void; onNext: () => void}) {
  const {colors} = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Pressable accessibilityLabel="Previous month" onPress={onPrevious} style={({pressed}) => [styles.button, pressed && styles.pressed]}><ChevronLeft size={21} color={colors.primary} strokeWidth={2.25} /></Pressable>
      <Text style={styles.month}>{formatMonth(month)}</Text>
      <Pressable accessibilityLabel="Next month" onPress={onNext} style={({pressed}) => [styles.button, pressed && styles.pressed]}><ChevronRight size={21} color={colors.primary} strokeWidth={2.25} /></Pressable>
    </View>
  );
}

const createStyles = (colors: Colors) => StyleSheet.create({
  container: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surface, borderRadius: radius.pill, padding: spacing.xs},
  button: {height: controlHeight.xs, width: controlHeight.xs, alignItems: 'center', justifyContent: 'center', borderRadius: radius.pill, backgroundColor: colors.surfaceMuted},
  pressed: {backgroundColor: colors.primarySoft, transform: [{scale: 0.94}]},
  month: {fontSize: 14, fontWeight: '800', color: colors.ink, letterSpacing: 0.1},
});
