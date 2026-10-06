import React from 'react';
import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import {Colors, controlHeight, radius, spacing} from '../constants/theme';
import {useTheme} from '../context/ThemeContext';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmDialog({visible, title, message, confirmLabel, onCancel, onConfirm}: Props) {
  const {colors} = useTheme();
  const styles = createStyles(colors);

  return <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
    <View style={styles.backdrop}>
      <View accessibilityViewIsModal style={styles.dialog}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.actions}>
          <Pressable accessibilityRole="button" onPress={onCancel} style={({pressed}) => [styles.cancel, pressed && styles.pressed]}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={onConfirm} style={({pressed}) => [styles.confirm, pressed && styles.pressed]}>
            <Text style={styles.confirmText}>{confirmLabel}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  </Modal>;
}

const createStyles = (colors: Colors) => StyleSheet.create({
  backdrop: {flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg, backgroundColor: colors.modalBackdrop},
  dialog: {width: '100%', maxWidth: 360, backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.xl},
  title: {color: colors.ink, fontSize: 18, fontWeight: '800'},
  message: {color: colors.inkMuted, fontSize: 14, lineHeight: 18, marginTop: spacing.xs},
  actions: {flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg},
  cancel: {flex: 1, minHeight: controlHeight.sm, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center'},
  cancelText: {color: colors.ink, fontSize: 13, fontWeight: '800'},
  confirm: {flex: 1, minHeight: controlHeight.sm, borderRadius: radius.md, backgroundColor: colors.expense, alignItems: 'center', justifyContent: 'center'},
  confirmText: {color: colors.white, fontSize: 13, fontWeight: '800'},
  pressed: {opacity: 0.78},
});
