import React, {useState} from 'react';
import {ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {WalletCards} from 'lucide-react-native';
import {login} from '../services/authService';
import {Colors, controlHeight, radius, spacing} from '../constants/theme';
import {useTheme} from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

export default function LoginScreen() {
  const {colors} = useTheme();
  const styles = createStyles(colors);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!email.trim() || !password) {
      setError('Enter your email and password to continue.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await login(email, password);
    } catch {
      setError('Those login details did not work. Check them and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.themeRow}><ThemeToggle /></View>
        <View style={styles.brandMark}><WalletCards size={29} color={colors.white} strokeWidth={2.25} /></View>
        <Text style={styles.kicker}>HOME LEDGER</Text>
        <Text style={styles.title}>Your home, in balance.</Text>
        <Text style={styles.subtitle}>Keep every rupee accounted for, across bank and cash.</Text>
        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" placeholder="you@example.com" placeholderTextColor={colors.inkMuted} style={styles.input} />
          <Text style={styles.label}>Password</Text>
          <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="Your password" placeholderTextColor={colors.inkMuted} style={styles.input} />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Pressable onPress={submit} disabled={submitting} style={({pressed}) => [styles.button, pressed && styles.buttonPressed, submitting && styles.disabled]}>
            {submitting ? <ActivityIndicator color={colors.white} /> : <Text style={styles.buttonText}>Log in</Text>}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors: Colors) => StyleSheet.create({
  flex: {flex: 1, backgroundColor: colors.canvas},
  content: {flexGrow: 1, justifyContent: 'center', padding: spacing.lg},
  themeRow: {alignItems: 'flex-end', marginBottom: spacing.lg},
  brandMark: {height: controlHeight.md, width: controlHeight.md, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, marginBottom: spacing.md, shadowColor: colors.primary, shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: {width: 0, height: 5}, elevation: 3},
  kicker: {color: colors.primary, fontSize: 11, fontWeight: '800', letterSpacing: 1.6},
  title: {color: colors.ink, fontSize: 32, lineHeight: 37, fontWeight: '800', marginTop: spacing.sm, maxWidth: 300},
  subtitle: {color: colors.inkMuted, fontSize: 14, lineHeight: 20, marginTop: spacing.sm, maxWidth: 300},
  form: {marginTop: spacing.lg, padding: spacing.md, backgroundColor: colors.surface, borderRadius: radius.lg},
  label: {color: colors.ink, fontSize: 12, fontWeight: '700', marginBottom: spacing.xs, marginTop: spacing.sm},
  input: {height: controlHeight.md, backgroundColor: colors.surfaceMuted, borderRadius: radius.sm, color: colors.ink, fontSize: 14, paddingHorizontal: spacing.md},
  error: {color: colors.expense, fontSize: 12, marginTop: spacing.sm},
  button: {minHeight: controlHeight.lg, backgroundColor: colors.primary, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', marginTop: spacing.md},
  buttonPressed: {backgroundColor: colors.primaryDark},
  disabled: {opacity: 0.7},
  buttonText: {color: colors.white, fontSize: 14, fontWeight: '800'},
});
