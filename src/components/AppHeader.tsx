import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {ChevronLeft} from 'lucide-react-native';
import {Colors, controlHeight, radius, spacing} from '../constants/theme';
import {useTheme} from '../context/ThemeContext';

type AppHeaderProps = {
  title: string;
  onBack?: () => void;
  rightAction?: {accessibilityLabel: string; onPress: () => void; icon: React.ReactNode; variant?: 'primary' | 'danger' | 'plain'};
};

export default function AppHeader({title, onBack, rightAction}: AppHeaderProps) {
  const {colors} = useTheme();
  const styles = createStyles(colors);
  const content = <Text style={styles.title}>{title}</Text>;
  return <View style={styles.header}><View style={styles.headerRow}><View style={styles.leftContent}>{onBack ? <View style={styles.backRow}><Pressable accessibilityLabel="Go back" onPress={onBack} style={({pressed}) => [styles.back, pressed && styles.pressed]}><ChevronLeft size={22} color={colors.ink} strokeWidth={2.4} /></Pressable>{content}</View> : content}</View>{rightAction ? <Pressable accessibilityRole="button" accessibilityLabel={rightAction.accessibilityLabel} onPress={rightAction.onPress} style={({pressed}) => [styles.action, rightAction.variant === 'danger' && styles.actionDanger, rightAction.variant === 'plain' && styles.actionPlain, pressed && styles.pressed]}>{rightAction.icon}</Pressable> : null}</View></View>;
}

const createStyles = (colors: Colors) => StyleSheet.create({
  header: {paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.md},
  headerRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  leftContent: {flex: 1, minWidth: 0},
  backRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  back: {height: controlHeight.sm, width: controlHeight.sm, alignItems: 'center', justifyContent: 'center'},
  action: {height: controlHeight.sm, width: controlHeight.sm, borderRadius: radius.pill, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginLeft: spacing.md},
  actionDanger: {backgroundColor: colors.expense},
  actionPlain: {backgroundColor: 'transparent'},
  pressed: {opacity: 0.78},
  title: {color: colors.ink, fontSize: 20, fontWeight: '800'},
});
