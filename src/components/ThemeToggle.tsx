import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {Moon, Sun} from 'lucide-react-native';
import {useTheme} from '../context/ThemeContext';
import {Colors, controlHeight, radius} from '../constants/theme';

export default function ThemeToggle() {
  const {colors, isDark, toggleTheme} = useTheme();
  const styles = createStyles(colors);
  const Icon = isDark ? Sun : Moon;

  return (
    <Pressable
      accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onPress={toggleTheme}
      style={({pressed}) => [styles.button, pressed && styles.pressed]}
      hitSlop={8}>
      <Icon size={18} color={colors.primary} strokeWidth={2.25} />
    </Pressable>
  );
}

const createStyles = (colors: Colors) => StyleSheet.create({
  button: {height: controlHeight.sm, width: controlHeight.sm, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface},
  pressed: {backgroundColor: colors.surfaceMuted, transform: [{scale: 0.96}]},
});
