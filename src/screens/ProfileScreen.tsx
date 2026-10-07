import React, {useEffect, useState} from 'react';
import {Modal, NativeModules, Platform, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {LogOut, Monitor, Moon, Sun, UserRound} from 'lucide-react-native';
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
  const [appVersion, setAppVersion] = useState('—');
  const displayName = user?.user_metadata?.display_name ?? user?.user_metadata?.full_name ?? 'User';
  useEffect(() => {
    if (Platform.OS !== 'android' || !NativeModules.AppVersion?.getVersion) return;
    NativeModules.AppVersion.getVersion().then((version: string) => setAppVersion(version)).catch(() => undefined);
  }, []);
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
          <View style={[styles.profileRow, styles.rowDivider]}>
            <View style={styles.avatar}><UserRound size={20} color={colors.primary} strokeWidth={2.2} /></View>
            <View style={styles.profileDetails}>
              <Text style={styles.name} numberOfLines={1}>{displayName}</Text>
              <Text style={styles.email} numberOfLines={1}>{user?.email ?? 'No email available'}</Text>
            </View>
          </View>

          <View style={[styles.themeRow, styles.rowDivider]}>
            <Text style={styles.rowLabel}>Theme</Text>
            <View style={styles.themeOptions}>
              {(['system', 'light', 'dark'] as ThemeMode[]).map(item => (
                <Pressable key={item} accessibilityRole="button" accessibilityLabel={`Use ${item} theme`} accessibilityState={{selected: mode === item}} onPress={() => chooseMode(item)} style={({pressed}) => [styles.themeOption, mode === item && styles.themeSelected, pressed && styles.optionPressed]}>
                  {item === 'system' ? <Monitor size={14} color={mode === item ? colors.white : colors.inkMuted} /> : item === 'light' ? <Sun size={14} color={mode === item ? colors.white : colors.inkMuted} /> : <Moon size={14} color={mode === item ? colors.white : colors.inkMuted} />}
                </Pressable>
              ))}
            </View>
          </View>

          <View style={[styles.versionRow, styles.rowDivider]}>
            <Text style={styles.versionLabel}>App version</Text>
            <Text style={styles.versionValue}>{appVersion}</Text>
          </View>

          <View style={styles.logoutRow}>
            <Pressable accessibilityRole="button" accessibilityLabel="Log out" onPress={confirmLogout} style={({pressed}) => [styles.logout, pressed && styles.pressed]}>
              <LogOut size={18} color={colors.white} strokeWidth={2.2} />
              <Text style={styles.logoutText}>Log out</Text>
            </Pressable>
          </View>
        </View>
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
  profileCard: {backgroundColor: colors.surface, borderRadius: radius.lg, overflow: 'hidden'},
  profileRow: {flexDirection: 'row', alignItems: 'center', padding: spacing.lg},
  rowDivider: {borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line},
  avatar: {height: controlHeight.sm, width: controlHeight.sm, borderRadius: radius.md, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center'},
  profileDetails: {flex: 1, minWidth: 0, marginLeft: spacing.md},
  name: {color: colors.ink, fontSize: 16, fontWeight: '800'},
  email: {color: colors.inkMuted, fontSize: 13, marginTop: spacing.xs},
  themeRow: {padding: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  rowLabel: {color: colors.ink, fontSize: 14, fontWeight: '700'},
  themeOptions: {width: 108, flexDirection: 'row', gap: 2, padding: 2, borderRadius: radius.md, backgroundColor: colors.surfaceMuted},
  themeOption: {flex: 1, height: 28, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center'},
  themeSelected: {backgroundColor: colors.primary},
  optionPressed: {opacity: 0.8},
  versionRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.md},
  versionLabel: {color: colors.ink, fontSize: 14, fontWeight: '700'},
  versionValue: {color: colors.ink, fontSize: 13, fontWeight: '700'},
  logoutRow: {padding: spacing.md},
  logout: {minHeight: controlHeight.md, paddingHorizontal: spacing.md, borderRadius: radius.md, backgroundColor: colors.expense, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs},
  logoutText: {color: colors.white, fontSize: 14, fontWeight: '800'},
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
