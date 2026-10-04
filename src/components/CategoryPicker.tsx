import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text} from 'react-native';
import {Colors, radius, spacing} from '../constants/theme';
import {useTheme} from '../context/ThemeContext';

export default function CategoryPicker({categories, value, onChange}: {categories: string[]; value: string; onChange: (value: string) => void}) {
  const {colors} = useTheme();
  const styles = createStyles(colors);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>
      {categories.map(category => (
        <Pressable key={category} onPress={() => onChange(category)} style={[styles.chip, value === category && styles.selected]}>
          <Text style={[styles.text, value === category && styles.selectedText]}>{category}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const createStyles = (colors: Colors) => StyleSheet.create({
  content: {gap: spacing.sm, paddingVertical: 2},
  chip: {paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.pill, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line},
  selected: {backgroundColor: colors.primary, borderColor: colors.primary},
  text: {color: colors.inkMuted, fontWeight: '600'},
  selectedText: {color: colors.white},
});
