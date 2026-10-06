import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text} from 'react-native';
import {Colors, controlHeight, radius, spacing} from '../constants/theme';
import {useTheme} from '../context/ThemeContext';

export default function CategoryPicker({categories, value, onChange}: {categories: string[]; value: string; onChange: (value: string) => void}) {
  const {colors} = useTheme();
  const styles = createStyles(colors);

  return (
    <ScrollView style={styles.scroll} nestedScrollEnabled showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      {categories.map(category => (
        <Pressable key={category} onPress={() => onChange(category)} style={({pressed}) => [styles.chip, value === category && styles.selected, pressed && styles.pressed]}>
          <Text style={[styles.text, value === category && styles.selectedText]}>{category}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const createStyles = (colors: Colors) => StyleSheet.create({
  scroll: {maxHeight: 136},
  content: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, paddingVertical: 0},
  chip: {paddingHorizontal: spacing.md, paddingVertical: spacing.xs, minHeight: controlHeight.xs, alignItems: 'center', justifyContent: 'center', borderRadius: radius.pill, backgroundColor: colors.surface},
  selected: {backgroundColor: colors.primary},
  pressed: {opacity: 0.78},
  text: {color: colors.inkMuted, fontWeight: '600'},
  selectedText: {color: colors.white},
});
