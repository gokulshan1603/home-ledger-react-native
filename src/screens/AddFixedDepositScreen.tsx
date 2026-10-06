import React, {useCallback, useLayoutEffect, useState} from 'react';
import {ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {Check, Trash2} from 'lucide-react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FDStackParamList} from '../navigation/types';
import {addFixedDeposit, deleteFixedDeposit, updateFixedDeposit} from '../services/fdService';
import {FixedDepositInterestFrequency, FixedDepositStatus} from '../types/fixedDeposit';
import {Colors, controlHeight, radius, spacing} from '../constants/theme';
import {useTheme} from '../context/ThemeContext';
import AmountInput from '../components/AmountInput';
import ThemedDatePicker from '../components/ThemedDatePicker';
import AppHeader from '../components/AppHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import MessageDialog from '../components/MessageDialog';

type Props = NativeStackScreenProps<FDStackParamList, 'AddFD'>;

export default function AddFixedDepositScreen({navigation, route}: Props) {
  const {colors} = useTheme();
  const styles = createStyles(colors);
  const existing = route.params?.deposit;
  const editing = Boolean(existing);
  const [name, setName] = useState(existing?.name ?? '');
  const [principal, setPrincipal] = useState(existing?.principal.toString() ?? '');
  const [interestFrequency, setInterestFrequency] = useState<FixedDepositInterestFrequency>(existing?.interestFrequency ?? 'on_maturity');
  const [rate, setRate] = useState(existing?.interestRate?.toString() ?? '');
  const [maturityAmount, setMaturityAmount] = useState(existing?.maturityAmount?.toString() ?? '');
  const [startedAt, setStartedAt] = useState(existing?.startedAt ?? new Date());
  const [maturityAt, setMaturityAt] = useState(existing?.maturityAt ?? new Date());
  const [note, setNote] = useState(existing?.note ?? '');
  const [saving, setSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [messageDialog, setMessageDialog] = useState<{title: string; message: string} | null>(null);
  const openDeleteDialog = useCallback(() => {
    if (existing) setShowDeleteDialog(true);
  }, [existing]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: editing ? 'Edit fixed deposit' : 'Add fixed deposit',
      // This callback is consumed by React Navigation as a header renderer.
      // eslint-disable-next-line react/no-unstable-nested-components
      header: () => <AppHeader title={editing ? 'Edit fixed deposit' : 'Add fixed deposit'} onBack={() => navigation.goBack()} rightAction={editing ? {accessibilityLabel: 'Delete fixed deposit', onPress: openDeleteDialog, variant: 'danger', icon: <Trash2 size={19} color={colors.white} strokeWidth={2.3} />} : undefined} />,
    });
  }, [colors.expense, colors.white, editing, navigation, openDeleteDialog]);

  const save = async () => {
    const amount = Number(principal);
    const maturity = Number(maturityAmount);
    if (!name.trim() || !amount || amount <= 0 || !maturity || maturity <= 0) {
      setMessageDialog({title: 'Enter deposit details', message: 'Add a name, principal amount, and maturity amount greater than zero.'});
      return;
    }
    if (maturityAt < startedAt) {
      setMessageDialog({title: 'Check the dates', message: 'Maturity date must be after the start date.'});
      return;
    }
    setSaving(true);
    try {
      const input = {name: name.trim(), principal: amount, interestFrequency, interestRate: rate ? Number(rate) : undefined, maturityAmount: maturity, startedAt, maturityAt, status: (existing?.status ?? 'active') as FixedDepositStatus, ...(note.trim() ? {note: note.trim()} : {})};
      if (existing) {
        await updateFixedDeposit(existing.id, input);
      } else {
        await addFixedDeposit(input);
      }
      navigation.goBack();
    } catch {
      setMessageDialog({title: 'Could not save fixed deposit', message: 'Please check your connection and try again.'});
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!existing) return;
    setShowDeleteDialog(false);
    try {
      await deleteFixedDeposit(existing.id);
      navigation.goBack();
    } catch {
      setMessageDialog({title: 'Could not delete fixed deposit', message: 'Please check your connection and try again.'});
    }
  };

  return <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={[styles.label, styles.firstLabel]}>Name</Text>
      <TextInput value={name} onChangeText={setName} placeholder="SBI FD" placeholderTextColor={colors.inkMuted} style={styles.input} />
      <Text style={styles.label}>Principal</Text>
      <AmountInput value={principal} onChangeText={setPrincipal} />
      <Text style={styles.label}>Receive interest</Text>
      <View style={styles.interestToggle}>{(['monthly', 'quarterly', 'annual', 'on_maturity'] as FixedDepositInterestFrequency[]).map(item => <Pressable key={item} onPress={() => setInterestFrequency(item)} style={[styles.interestOption, interestFrequency === item && styles.interestSelected]}><Text style={[styles.interestText, interestFrequency === item && styles.interestSelectedText]}>{item === 'on_maturity' ? 'On maturity' : item.charAt(0).toUpperCase() + item.slice(1)}</Text></Pressable>)}</View>
      <Text style={styles.label}>Start date</Text>
      <ThemedDatePicker value={startedAt} onChange={setStartedAt} />
      <Text style={styles.label}>Maturity date</Text>
      <ThemedDatePicker value={maturityAt} onChange={setMaturityAt} />
      <Text style={styles.label}>Interest rate (%) <Text style={styles.optional}>(optional)</Text></Text>
      <TextInput value={rate} onChangeText={text => setRate(text.replace(/[^0-9.]/g, ''))} keyboardType="decimal-pad" placeholder="0" placeholderTextColor={colors.inkMuted} style={styles.input} />
      <Text style={styles.label}>Maturity amount</Text>
      <AmountInput value={maturityAmount} onChangeText={setMaturityAmount} />
      <Text style={styles.label}>Note <Text style={styles.optional}>(optional)</Text></Text>
      <TextInput value={note} onChangeText={setNote} placeholder="Optional note" placeholderTextColor={colors.inkMuted} style={[styles.input, styles.note]} multiline maxLength={120} />
      <Pressable onPress={save} disabled={saving} style={({pressed}) => [styles.saveButton, pressed && styles.savePressed, saving && styles.disabled]}>
        {saving ? <ActivityIndicator color={colors.white} /> : <><Text style={styles.saveText}>{editing ? 'Save changes' : 'Save deposit'}</Text><Check size={17} color={colors.white} strokeWidth={2.5} /></>}
      </Pressable>
    </ScrollView>
    <ConfirmDialog visible={showDeleteDialog} title="Delete this fixed deposit?" message="This cannot be undone." confirmLabel="Delete" onCancel={() => setShowDeleteDialog(false)} onConfirm={remove} />
    <MessageDialog visible={messageDialog !== null} title={messageDialog?.title ?? ''} message={messageDialog?.message ?? ''} onClose={() => setMessageDialog(null)} />
  </KeyboardAvoidingView>;
}

const createStyles = (colors: Colors) => StyleSheet.create({
  flex: {flex: 1, backgroundColor: colors.canvas},
  content: {paddingHorizontal: spacing.lg, paddingTop: 0, paddingBottom: spacing.xl * 3},
  firstLabel: {marginTop: 0},
  label: {color: colors.ink, fontSize: 12, fontWeight: '800', marginTop: spacing.lg, marginBottom: spacing.sm},
  optional: {color: colors.inkMuted, fontWeight: '500'},
  interestToggle: {flexDirection: 'row', padding: spacing.xs, backgroundColor: colors.surface, borderRadius: radius.md},
  interestOption: {flex: 1, minHeight: controlHeight.sm, alignItems: 'center', justifyContent: 'center', borderRadius: radius.sm},
  interestSelected: {backgroundColor: colors.surfaceMuted},
  interestText: {color: colors.inkMuted, fontSize: 12, fontWeight: '700'},
  interestSelectedText: {color: colors.ink},
  input: {height: controlHeight.md, backgroundColor: colors.surface, borderRadius: radius.md, color: colors.ink, fontSize: 14, paddingHorizontal: spacing.md},
  note: {height: 80, paddingVertical: spacing.sm, textAlignVertical: 'top'},
  saveButton: {height: controlHeight.md, borderRadius: radius.md, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, marginTop: spacing.xl},
  savePressed: {backgroundColor: colors.primaryDark, transform: [{scale: 0.99}]},
  saveText: {color: colors.white, fontSize: 14, fontWeight: '800'},
  disabled: {opacity: 0.7},
});
