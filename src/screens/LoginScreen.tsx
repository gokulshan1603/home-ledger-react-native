import React, {useState} from 'react';
import {ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {WalletCards} from 'lucide-react-native';
import {login} from '../services/authService';
import {Colors, radius, spacing} from '../constants/theme';
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
  content: {flexGrow: 1, justifyContent: 'center', padding: spacing.xl},
  themeRow: {alignItems: 'flex-end', marginBottom: spacing.lg},
  brandMark: {height: 56, width: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, marginBottom: spacing.lg},
  kicker: {color: colors.primary, fontSize: 12, fontWeight: '800', letterSpacing: 1.8},
  title: {color: colors.ink, fontSize: 38, lineHeight: 43, fontWeight: '800', marginTop: spacing.sm, maxWidth: 330},
  subtitle: {color: colors.inkMuted, fontSize: 16, lineHeight: 23, marginTop: spacing.sm, maxWidth: 330},
  form: {marginTop: spacing.xl},
  label: {color: colors.ink, fontSize: 13, fontWeight: '700', marginBottom: spacing.xs, marginTop: spacing.md},
  input: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.sm, color: colors.ink, fontSize: 16, paddingHorizontal: spacing.md, paddingVertical: 14},
  error: {color: colors.expense, fontSize: 13, marginTop: spacing.md},
  button: {minHeight: 54, backgroundColor: colors.primary, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', marginTop: spacing.lg},
  buttonPressed: {backgroundColor: colors.primaryDark},
  disabled: {opacity: 0.7},
  buttonText: {color: colors.white, fontSize: 16, fontWeight: '800'},
});
