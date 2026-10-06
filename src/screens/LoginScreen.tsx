import React, {useState} from 'react';
import {ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {Eye, EyeOff, LogIn} from 'lucide-react-native';
import {login} from '../services/authService';
import {Colors, controlHeight, radius, spacing} from '../constants/theme';
import {useTheme} from '../context/ThemeContext';
import PaisaMark from '../components/PaisaMark';

export default function LoginScreen() {
  const {colors} = useTheme();
  const styles = createStyles(colors);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
        <View style={styles.brandMark}><PaisaMark colors={colors} size={controlHeight.md} /></View>
        <Text style={styles.kicker}>PAISA</Text>
        <Text style={styles.title}>Every rupee, clearly.</Text>
        <Text style={styles.subtitle}>See your cash, savings, gold, deposits, and loans in one calm place.</Text>
        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" placeholder="you@example.com" placeholderTextColor={colors.inkMuted} style={styles.input} />
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordField}>
            <TextInput value={password} onChangeText={setPassword} secureTextEntry={!showPassword} placeholder="Your password" placeholderTextColor={colors.inkMuted} style={[styles.input, styles.passwordInput]} />
            <Pressable accessibilityRole="button" accessibilityLabel={showPassword ? 'Hide password' : 'Show password'} onPress={() => setShowPassword(current => !current)} style={({pressed}) => [styles.passwordToggle, pressed && styles.passwordTogglePressed]} hitSlop={6}>
              {showPassword ? <EyeOff size={18} color={colors.inkMuted} strokeWidth={2.2} /> : <Eye size={18} color={colors.inkMuted} strokeWidth={2.2} />}
            </Pressable>
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Pressable onPress={submit} disabled={submitting} style={({pressed}) => [styles.button, pressed && styles.buttonPressed, submitting && styles.disabled]}>
            {submitting ? <ActivityIndicator color={colors.white} /> : <><Text style={styles.buttonText}>Log in</Text><LogIn size={17} color={colors.white} strokeWidth={2.25} /></>}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors: Colors) => StyleSheet.create({
  flex: {flex: 1, backgroundColor: colors.canvas},
  content: {flexGrow: 1, justifyContent: 'center', padding: spacing.lg},
  brandMark: {height: controlHeight.md, width: controlHeight.md, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md},
  kicker: {color: colors.primary, fontSize: 11, fontWeight: '800', letterSpacing: 1.6},
  title: {color: colors.ink, fontSize: 28, lineHeight: 34, fontWeight: '800', marginTop: spacing.sm, maxWidth: 300},
  subtitle: {color: colors.inkMuted, fontSize: 14, lineHeight: 20, marginTop: spacing.sm, maxWidth: 300},
  form: {marginTop: spacing.xl},
  label: {color: colors.ink, fontSize: 12, fontWeight: '700', marginBottom: spacing.xs, marginTop: spacing.md},
  input: {height: controlHeight.lg, backgroundColor: colors.surface, borderRadius: radius.md, color: colors.ink, fontSize: 14, paddingHorizontal: spacing.md},
  passwordField: {height: controlHeight.lg, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.md, paddingRight: spacing.sm},
  passwordInput: {flex: 1, paddingRight: spacing.xs},
  passwordToggle: {height: controlHeight.sm, width: controlHeight.sm, alignItems: 'center', justifyContent: 'center', borderRadius: radius.pill},
  passwordTogglePressed: {backgroundColor: colors.surfaceMuted},
  error: {color: colors.expense, fontSize: 12, marginTop: spacing.sm},
  button: {minHeight: controlHeight.lg, backgroundColor: colors.primary, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, marginTop: spacing.lg},
  buttonPressed: {backgroundColor: colors.primaryDark},
  disabled: {opacity: 0.7},
  buttonText: {color: colors.white, fontSize: 14, fontWeight: '800'},
});
