import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {Moon, Sun} from 'lucide-react-native';
import {useTheme} from '../context/ThemeContext';
import {radius} from '../constants/theme';

export default function ThemeToggle() {
  const {colors, isDark, toggleTheme} = useTheme();
  const Icon = isDark ? Sun : Moon;

  return (
    <Pressable
      accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onPress={toggleTheme}
      style={[styles.button, {backgroundColor: colors.surface}]}
      hitSlop={8}>
      <Icon size={18} color={colors.primary} strokeWidth={2.25} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {height: 40, width: 40, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center'},
});
