import React, {useState} from 'react';
import {Modal, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {LogOut, Moon, Sun, UserRound} from 'lucide-react-native';
import {useAuth} from '../context/AuthContext';
import {ThemeMode, useTheme} from '../context/ThemeContext';
import {logout} from '../services/authService';
import AppHeader from '../components/AppHeader';
import {Colors, controlHeight, radius, spacing} from '../constants/theme';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const {user} = useAuth();
  const {colors, mode, setMode} = useTheme();
  const styles = createStyles(colors);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const displayName = user?.user_metadata?.display_name ?? user?.user_metadata?.full_name ?? 'Paisa user';
  const chooseMode = (nextMode: ThemeMode) => setMode(nextMode);
  const confirmLogout = () => setShowLogoutDialog(true);
  const finishLogout = () => {
    setShowLogoutDialog(false);
    logout().catch(() => undefined);
  };
  return (
    <SafeAreaView style={styles.flex} edges={['top']}>
      <AppHeader title="Profile" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}><UserRound size={24} color={colors.primary} strokeWidth={2.2} /></View>
          <View style={styles.profileDetails}>
            <Text style={styles.name} numberOfLines={1}>{displayName}</Text>
            <Text style={styles.email} numberOfLines={1}>{user?.email ?? 'No email available'}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Theme</Text>
        <View style={styles.themeCard}>
          <View style={styles.themeOptions}>
            {(['system', 'light', 'dark'] as ThemeMode[]).map(item => (
              <Pressable key={item} accessibilityRole="button" accessibilityState={{selected: mode === item}} onPress={() => chooseMode(item)} style={({pressed}) => [styles.themeOption, mode === item && styles.themeSelected, pressed && styles.optionPressed]}>
                <Text style={[styles.themeText, mode === item && styles.themeSelectedText]}>{item === 'system' ? 'System' : item === 'light' ? 'Light' : 'Dark'}</Text>
                {item === 'system' ? <UserRound size={16} color={mode === item ? colors.white : colors.inkMuted} /> : item === 'light' ? <Sun size={16} color={mode === item ? colors.white : colors.inkMuted} /> : <Moon size={16} color={mode === item ? colors.white : colors.inkMuted} />}
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable accessibilityRole="button" accessibilityLabel="Log out" onPress={confirmLogout} style={({pressed}) => [styles.logout, pressed && styles.pressed]}>
          <LogOut size={18} color={colors.expense} strokeWidth={2.2} />
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
      </ScrollView>
      <Modal transparent visible={showLogoutDialog} animationType="fade" onRequestClose={() => setShowLogoutDialog(false)}>
        <View style={styles.modalBackdrop}>
          <View accessibilityViewIsModal style={styles.logoutDialog}>
            <Text style={styles.dialogTitle}>Log out?</Text>
            <Text style={styles.dialogMessage}>You can sign in again anytime.</Text>
            <View style={styles.dialogActions}>
              <Pressable accessibilityRole="button" onPress={() => setShowLogoutDialog(false)} style={({pressed}) => [styles.cancelButton, pressed && styles.dialogPressed]}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable accessibilityRole="button" onPress={finishLogout} style={({pressed}) => [styles.confirmButton, pressed && styles.dialogPressed]}>
                <Text style={styles.confirmButtonText}>Log out</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (colors: Colors) => StyleSheet.create({
  flex: {flex: 1, backgroundColor: colors.canvas},
  content: {paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xl * 3},
  profileCard: {flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg},
  avatar: {height: controlHeight.md, width: controlHeight.md, borderRadius: radius.pill, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center'},
  profileDetails: {flex: 1, minWidth: 0, marginLeft: spacing.md},
  name: {color: colors.ink, fontSize: 16, fontWeight: '800'},
  email: {color: colors.inkMuted, fontSize: 12, marginTop: spacing.xs},
  sectionTitle: {color: colors.ink, fontSize: 16, fontWeight: '800', marginTop: spacing.xl, marginBottom: spacing.sm},
  themeCard: {backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.sm},
  themeOptions: {flexDirection: 'row', gap: 2, padding: 3, borderRadius: radius.md, backgroundColor: colors.surfaceMuted},
  themeOption: {flex: 1, minHeight: controlHeight.sm, paddingHorizontal: spacing.xs, borderRadius: radius.sm, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs},
  themeSelected: {backgroundColor: colors.primary},
  themeText: {color: colors.inkMuted, fontSize: 12, fontWeight: '700'},
  themeSelectedText: {color: colors.white},
  optionPressed: {opacity: 0.8},
  logout: {minHeight: controlHeight.md, marginTop: spacing.xl, paddingHorizontal: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.expense, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs},
  logoutText: {color: colors.expense, fontSize: 14, fontWeight: '800'},
  pressed: {opacity: 0.75},
  modalBackdrop: {flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg, backgroundColor: colors.modalBackdrop},
  logoutDialog: {width: '100%', maxWidth: 360, backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.xl},
  dialogTitle: {color: colors.ink, fontSize: 18, fontWeight: '800'},
  dialogMessage: {color: colors.inkMuted, fontSize: 14, lineHeight: 18, marginTop: spacing.xs},
  dialogActions: {flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg},
  cancelButton: {flex: 1, minHeight: controlHeight.sm, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center'},
  cancelButtonText: {color: colors.ink, fontSize: 13, fontWeight: '800'},
  confirmButton: {flex: 1, minHeight: controlHeight.sm, borderRadius: radius.md, backgroundColor: colors.expense, alignItems: 'center', justifyContent: 'center'},
  confirmButtonText: {color: colors.white, fontSize: 13, fontWeight: '800'},
  dialogPressed: {opacity: 0.78},
});
