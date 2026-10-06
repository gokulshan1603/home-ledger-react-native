import React from 'react';
import {Alert, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {LogOut, Moon, Settings, Sun, UserRound} from 'lucide-react-native';
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
  const displayName = user?.user_metadata?.display_name ?? user?.user_metadata?.full_name ?? 'Paisa user';
  const chooseMode = (nextMode: ThemeMode) => setMode(nextMode);
  const confirmLogout = () => Alert.alert('Log out?', 'You can sign in again anytime.', [{text: 'Cancel', style: 'cancel'}, {text: 'Log out', style: 'destructive', onPress: logout}]);
  return (
    <SafeAreaView style={styles.flex} edges={['top']}>
      <AppHeader eyebrow="PROFILE" title="Your profile" />
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
          <View style={styles.settingHeading}>
            <View style={styles.settingIcon}><Settings size={18} color={colors.primary} strokeWidth={2.2} /></View>
            <View style={styles.settingCopyBlock}>
              <Text style={styles.settingTitle}>Appearance</Text>
              <Text style={styles.settingCopy}>Choose how Paisa looks.</Text>
            </View>
          </View>
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
  themeCard: {backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg},
  settingHeading: {flexDirection: 'row', alignItems: 'center'},
  settingIcon: {height: controlHeight.sm, width: controlHeight.sm, borderRadius: radius.sm, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center'},
  settingCopyBlock: {flex: 1, marginLeft: spacing.sm},
  settingTitle: {color: colors.ink, fontSize: 14, fontWeight: '800'},
  settingCopy: {color: colors.inkMuted, fontSize: 12, marginTop: spacing.xs},
  themeOptions: {flexDirection: 'row', gap: spacing.xs, marginTop: spacing.lg},
  themeOption: {flex: 1, minHeight: controlHeight.sm, paddingHorizontal: spacing.xs, borderRadius: radius.md, backgroundColor: colors.surfaceMuted, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs},
  themeSelected: {backgroundColor: colors.primary},
  themeText: {color: colors.inkMuted, fontSize: 13, fontWeight: '700'},
  themeSelectedText: {color: colors.white},
  optionPressed: {opacity: 0.8},
  logout: {minHeight: controlHeight.md, marginTop: spacing.xl, borderRadius: radius.md, borderWidth: 1, borderColor: colors.expense, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs},
  logoutText: {color: colors.expense, fontSize: 14, fontWeight: '800'},
  pressed: {opacity: 0.75},
});
