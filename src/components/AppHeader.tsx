import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {ChevronLeft} from 'lucide-react-native';
import {Colors, controlHeight, radius, spacing} from '../constants/theme';
import {useTheme} from '../context/ThemeContext';

export default function AppHeader({title, onBack}: {title: string; onBack?: () => void}) {
  const {colors} = useTheme();
  const styles = createStyles(colors);
  const content = <Text style={styles.title}>{title}</Text>;
  return <View style={styles.header}>{onBack ? <View style={styles.backRow}><Pressable accessibilityLabel="Go back" onPress={onBack} style={({pressed}) => [styles.back, pressed && styles.pressed]}><ChevronLeft size={22} color={colors.primary} strokeWidth={2.4} /></Pressable>{content}</View> : content}</View>;
}

const createStyles = (colors: Colors) => StyleSheet.create({
  header: {paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.md},
  backRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  back: {height: controlHeight.sm, width: controlHeight.sm, borderRadius: radius.pill, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center'},
  pressed: {opacity: 0.78},
  title: {color: colors.ink, fontSize: 20, fontWeight: '800'},
});
