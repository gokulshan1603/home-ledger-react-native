import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {ChevronLeft} from 'lucide-react-native';
import {Colors, controlHeight, radius, spacing} from '../constants/theme';
import {useTheme} from '../context/ThemeContext';

export default function AppHeader({eyebrow, title, onBack}: {eyebrow: string; title: string; onBack?: () => void}) {
  const {colors} = useTheme();
  const styles = createStyles(colors);
  const content = <View><Text style={styles.eyebrow}>{eyebrow}</Text><Text style={styles.title}>{title}</Text></View>;
  return <View style={styles.header}>{onBack ? <View style={styles.backRow}><Pressable accessibilityLabel="Go back" onPress={onBack} style={({pressed}) => [styles.back, pressed && styles.pressed]}><ChevronLeft size={22} color={colors.primary} strokeWidth={2.4} /></Pressable>{content}</View> : content}</View>;
}

const createStyles = (colors: Colors) => StyleSheet.create({
  header: {paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.md},
  backRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  back: {height: controlHeight.sm, width: controlHeight.sm, borderRadius: radius.pill, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center'},
  pressed: {opacity: 0.78},
  eyebrow: {color: colors.primary, fontSize: 11, fontWeight: '800', letterSpacing: 1.5},
  title: {color: colors.ink, fontSize: 20, fontWeight: '800', marginTop: spacing.xs},
});
