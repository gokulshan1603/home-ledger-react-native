import React from 'react';
import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import {Colors, controlHeight, radius, spacing} from '../constants/theme';
import {useTheme} from '../context/ThemeContext';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
};

export default function MessageDialog({visible, title, message, onClose}: Props) {
  const {colors} = useTheme();
  const styles = createStyles(colors);

  return <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
    <View style={styles.backdrop}>
      <View accessibilityViewIsModal style={styles.dialog}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <Pressable accessibilityRole="button" onPress={onClose} style={({pressed}) => [styles.button, pressed && styles.pressed]}>
          <Text style={styles.buttonText}>OK</Text>
        </Pressable>
      </View>
    </View>
  </Modal>;
}

const createStyles = (colors: Colors) => StyleSheet.create({
  backdrop: {flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg, backgroundColor: colors.modalBackdrop},
  dialog: {width: '100%', maxWidth: 360, backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.xl},
  title: {color: colors.ink, fontSize: 18, fontWeight: '800'},
  message: {color: colors.inkMuted, fontSize: 14, lineHeight: 18, marginTop: spacing.xs},
  button: {minHeight: controlHeight.sm, marginTop: spacing.lg, borderRadius: radius.md, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  buttonText: {color: colors.white, fontSize: 13, fontWeight: '800'},
  pressed: {opacity: 0.78},
});
