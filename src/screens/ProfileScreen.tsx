import React, {useEffect, useState} from 'react';
import {Modal, NativeModules, Platform, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {ChevronRight, LogOut, Monitor, Moon, Sun} from 'lucide-react-native';
import Svg, {Defs, LinearGradient, Rect, Stop} from 'react-native-svg';
import {useAuth} from '../context/AuthContext';
import {ThemeMode, useTheme} from '../context/ThemeContext';
import {logout} from '../services/authService';
import AppHeader from '../components/AppHeader';
import {Colors, controlHeight, fontWeights, lineHeights, radius, spacing, typeScale} from '../constants/theme';

const DEFAULT_APP_VERSION = '1.0';

export default function ProfileScreen() {
  const {user} = useAuth();
  const {colors, mode, setMode} = useTheme();
  const styles = createStyles(colors);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [appVersion, setAppVersion] = useState(DEFAULT_APP_VERSION);
  const displayName = user?.user_metadata?.display_name ?? user?.user_metadata?.full_name ?? 'User';
  const initials = getInitials(displayName, user?.email);
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
    <View style={styles.flex}>
      <AppHeader title="Profile" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHero}>
          <Svg style={StyleSheet.absoluteFillObject} viewBox="0 0 1 1" preserveAspectRatio="none">
            <Defs>
              <LinearGradient id="profileHeroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={colors.primary} />
                <Stop offset="100%" stopColor={colors.primaryDark} />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="1" height="1" fill="url(#profileHeroGradient)" />
          </Svg>
          <View style={styles.profileHeroContent}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text></View>
            <Text style={styles.name} numberOfLines={1}>{displayName}</Text>
            <Text style={styles.email} numberOfLines={1}>{user?.email ?? 'No email available'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Preferences</Text>
          <View style={styles.sectionCard}>
            <View style={styles.themeRow}>
              <View style={styles.rowCopy}>
                <Text style={styles.rowLabel}>Theme</Text>
                <Text style={styles.rowHint}>{mode === 'system' ? 'Follow device settings' : mode === 'light' ? 'Always use light mode' : 'Always use dark mode'}</Text>
              </View>
              <View style={styles.themeOptions}>
                {(['system', 'light', 'dark'] as ThemeMode[]).map(item => (
                  <Pressable key={item} accessibilityRole="button" accessibilityLabel={`Use ${item} theme`} accessibilityState={{selected: mode === item}} onPress={() => chooseMode(item)} style={({pressed}) => [styles.themeOption, mode === item && styles.themeSelected, pressed && styles.optionPressed]}>
                    {item === 'system' ? <Monitor size={14} color={mode === item ? colors.white : colors.inkMuted} /> : item === 'light' ? <Sun size={14} color={mode === item ? colors.white : colors.inkMuted} /> : <Moon size={14} color={mode === item ? colors.white : colors.inkMuted} />}
                    <Text style={[styles.themeOptionText, mode === item && styles.themeSelectedText]}>{item === 'system' ? 'System' : item === 'light' ? 'Light' : 'Dark'}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeading}>About</Text>
          <View style={styles.sectionCard}>
            <View style={styles.versionRow}>
              <View style={styles.rowCopy}>
                <Text style={styles.versionLabel}>Paisa</Text>
                <Text style={styles.rowHint}>App version</Text>
              </View>
              <Text style={styles.versionValue}>{appVersion}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Account</Text>
          <View style={styles.sectionCard}>
            <Pressable accessibilityRole="button" accessibilityLabel="Sign out" onPress={confirmLogout} style={({pressed}) => [styles.logoutRow, pressed && styles.rowPressed]}>
              <View style={styles.logoutIcon}><LogOut size={17} color={colors.white} strokeWidth={2.2} /></View>
              <View style={styles.rowCopy}>
                <Text style={styles.logoutTitle}>Sign out</Text>
                <Text style={styles.rowHint}>End your current session</Text>
              </View>
              <ChevronRight size={19} color={colors.inkMuted} strokeWidth={2.1} />
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <Modal transparent visible={showLogoutDialog} animationType="fade" onRequestClose={() => setShowLogoutDialog(false)}>
        <View style={styles.modalBackdrop}>
          <View accessibilityViewIsModal style={styles.logoutDialog}>
            <Text style={styles.dialogTitle}>Sign out?</Text>
            <Text style={styles.dialogMessage}>You can sign in again anytime.</Text>
            <View style={styles.dialogActions}>
              <Pressable accessibilityRole="button" onPress={() => setShowLogoutDialog(false)} style={({pressed}) => [styles.cancelButton, pressed && styles.dialogPressed]}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable accessibilityRole="button" onPress={finishLogout} style={({pressed}) => [styles.confirmButton, pressed && styles.dialogPressed]}>
                <Text style={styles.confirmButtonText}>Sign out</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function getInitials(name: string, email?: string) {
  const source = name !== 'User' ? name : email?.split('@')[0] ?? name;
  const words = source.trim().split(/\s+/).filter(Boolean);
  return words.slice(0, 2).map(word => word[0]).join('').toUpperCase() || 'U';
}

const createStyles = (colors: Colors) => StyleSheet.create({
  flex: {flex: 1, backgroundColor: colors.canvas},
  content: {paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xl * 3},
  profileHero: {backgroundColor: colors.primaryDark, borderRadius: radius.lg, overflow: 'hidden'},
  profileHeroContent: {alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.xl, zIndex: 1},
  avatar: {height: 64, width: 64, borderRadius: radius.pill, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md},
  avatarText: {color: colors.primaryDark, fontSize: typeScale.title, fontWeight: fontWeights.bold},
  name: {color: colors.white, fontSize: typeScale.title, fontWeight: fontWeights.bold, maxWidth: '100%'},
  email: {color: colors.onPrimaryMuted, fontSize: typeScale.label, marginTop: spacing.xs, maxWidth: '100%'},
  section: {marginTop: spacing.xl},
  sectionHeading: {color: colors.inkMuted, fontSize: typeScale.body, fontWeight: fontWeights.bold, marginBottom: spacing.sm},
  sectionCard: {backgroundColor: colors.surface, borderRadius: radius.lg, overflow: 'hidden'},
  themeRow: {padding: spacing.md, gap: spacing.md},
  rowCopy: {flex: 1},
  rowLabel: {color: colors.ink, fontSize: typeScale.body, fontWeight: fontWeights.semibold},
  rowHint: {color: colors.inkMuted, fontSize: typeScale.caption, lineHeight: lineHeights.caption, marginTop: spacing.xs},
  themeOptions: {width: '100%', flexDirection: 'row', gap: spacing.xs, padding: spacing.xs, borderRadius: radius.md, backgroundColor: colors.surfaceMuted},
  themeOption: {flex: 1, minHeight: controlHeight.sm, borderRadius: radius.sm, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs},
  themeSelected: {backgroundColor: colors.primary},
  themeOptionText: {color: colors.ink, fontSize: typeScale.caption, fontWeight: fontWeights.semibold},
  themeSelectedText: {color: colors.white},
  optionPressed: {opacity: 0.8},
  versionRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.md},
  versionLabel: {color: colors.ink, fontSize: typeScale.body, fontWeight: fontWeights.semibold},
  versionValue: {color: colors.inkMuted, fontSize: typeScale.label, fontWeight: fontWeights.semibold},
  logoutRow: {minHeight: 64, padding: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.md},
  logoutIcon: {height: controlHeight.sm, width: controlHeight.sm, borderRadius: radius.md, backgroundColor: colors.expense, alignItems: 'center', justifyContent: 'center'},
  logoutTitle: {color: colors.expense, fontSize: typeScale.body, fontWeight: fontWeights.bold},
  rowPressed: {backgroundColor: colors.surfaceMuted},
  modalBackdrop: {flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg, backgroundColor: colors.modalBackdrop},
  logoutDialog: {width: '100%', maxWidth: 360, backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.xl},
  dialogTitle: {color: colors.ink, fontSize: typeScale.large, fontWeight: fontWeights.bold},
  dialogMessage: {color: colors.inkMuted, fontSize: typeScale.body, lineHeight: lineHeights.body, marginTop: spacing.xs},
  dialogActions: {flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg},
  cancelButton: {flex: 1, minHeight: controlHeight.sm, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center'},
  cancelButtonText: {color: colors.ink, fontSize: typeScale.label, fontWeight: fontWeights.bold},
  confirmButton: {flex: 1, minHeight: controlHeight.sm, borderRadius: radius.md, backgroundColor: colors.expense, alignItems: 'center', justifyContent: 'center'},
  confirmButtonText: {color: colors.white, fontSize: typeScale.label, fontWeight: fontWeights.bold},
  dialogPressed: {opacity: 0.78},
});
