import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {Check, Trash2} from 'lucide-react-native';
import {AddEntryScreenProps} from '../navigation/types';
import {CATEGORIES} from '../constants/categories';
import {Colors, controlHeight, radius, spacing} from '../constants/theme';
import {useTheme} from '../context/ThemeContext';
import {addTransaction, deleteTransaction, updateTransaction} from '../services/transactionService';
import {AccountType, TransactionType} from '../types/transaction';
import AmountInput from '../components/AmountInput';
import AccountToggle from '../components/AccountToggle';
import CategoryPicker from '../components/CategoryPicker';
import ThemedDatePicker from '../components/ThemedDatePicker';
import AppHeader from '../components/AppHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import MessageDialog from '../components/MessageDialog';

type Props = AddEntryScreenProps;

export default function AddEntryScreen({navigation, route}: Props) {
  const {colors} = useTheme();
  const styles = createStyles(colors);
  const existing = route.params?.transaction;
  const editing = Boolean(existing);
  const [type, setType] = useState<TransactionType>(existing?.type ?? 'expense');
  const [amount, setAmount] = useState(existing?.amount.toString() ?? '');
  const [category, setCategory] = useState(existing?.category ?? CATEGORIES.expense[0]);
  const [account, setAccount] = useState<AccountType>(existing?.account ?? 'bank');
  const [date, setDate] = useState(existing?.date ?? new Date());
  const [note, setNote] = useState(existing?.note ?? '');
  const [saving, setSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [messageDialog, setMessageDialog] = useState<{title: string; message: string} | null>(null);
  const openDeleteDialog = useCallback(() => {
    if (existing) setShowDeleteDialog(true);
  }, [existing]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: editing ? 'Edit entry' : 'Add entry',
      // This callback is consumed by React Navigation as a header renderer.
      // eslint-disable-next-line react/no-unstable-nested-components
      header: () => <AppHeader title={editing ? 'Edit entry' : 'Add entry'} onBack={() => navigation.goBack()} rightAction={editing ? {accessibilityLabel: 'Delete entry', onPress: openDeleteDialog, variant: 'danger', icon: <Trash2 size={19} color={colors.white} strokeWidth={2.3} />} : undefined} />,
    });
  }, [colors.expense, colors.white, editing, navigation, openDeleteDialog]);

  useEffect(() => {
    if (!CATEGORIES[type].includes(category)) {
      setCategory(CATEGORIES[type][0]);
    }
  }, [category, type]);

  const save = async () => {
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      setMessageDialog({title: 'Enter an amount', message: 'Add a number greater than zero to save this entry.'});
      return;
    }
    setSaving(true);
    try {
      const input = {type, amount: numericAmount, category, account, date, ...(note.trim() ? {note: note.trim()} : {})};
      if (existing) {
        await updateTransaction(existing.id, input);
      } else {
        await addTransaction(input);
      }
      navigation.goBack();
    } catch {
      setMessageDialog({title: 'Could not save entry', message: 'Please check your connection and try again.'});
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!existing) return;
    setShowDeleteDialog(false);
    try {
      await deleteTransaction(existing.id);
      navigation.goBack();
    } catch {
      setMessageDialog({title: 'Could not delete entry', message: 'Please check your connection and try again.'});
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.typeToggle}>
          {(['expense', 'income'] as TransactionType[]).map(item => <Pressable key={item} onPress={() => setType(item)} style={[styles.typeOption, type === item && (item === 'income' ? styles.incomeSelected : styles.expenseSelected)]}><Text style={[styles.typeText, type === item && styles.selectedTypeText]}>{item === 'expense' ? 'Expense' : 'Income'}</Text></Pressable>)}
        </View>
        <Text style={styles.label}>Amount</Text>
        <AmountInput value={amount} onChangeText={setAmount} />
        <Text style={styles.label}>Category</Text>
        <CategoryPicker categories={CATEGORIES[type]} value={category} onChange={setCategory} />
        <Text style={styles.label}>Account</Text>
        <AccountToggle value={account} onChange={setAccount} />
        <Text style={styles.label}>Date</Text>
        <ThemedDatePicker value={date} onChange={setDate} />
        <Text style={styles.label}>Note <Text style={styles.optional}>(optional)</Text></Text>
        <TextInput value={note} onChangeText={setNote} placeholder="What was this for?" placeholderTextColor={colors.inkMuted} style={[styles.input, styles.noteInput]} multiline maxLength={120} />
        <Pressable onPress={save} disabled={saving} style={({pressed}) => [styles.saveButton, pressed && styles.savePressed, saving && styles.disabled]}>{saving ? <Text style={styles.saveText}>Saving…</Text> : <><Text style={styles.saveText}>{editing ? 'Save changes' : 'Save entry'}</Text><Check size={17} color={colors.white} strokeWidth={2.5} /></>}</Pressable>
      </ScrollView>
      <ConfirmDialog visible={showDeleteDialog} title="Delete this entry?" message="This cannot be undone." confirmLabel="Delete" onCancel={() => setShowDeleteDialog(false)} onConfirm={remove} />
      <MessageDialog visible={messageDialog !== null} title={messageDialog?.title ?? ''} message={messageDialog?.message ?? ''} onClose={() => setMessageDialog(null)} />
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors: Colors) => StyleSheet.create({
  flex: {flex: 1, backgroundColor: colors.canvas},
  content: {paddingHorizontal: spacing.lg, paddingTop: 0, paddingBottom: spacing.xl * 3},
  typeToggle: {flexDirection: 'row', padding: spacing.xs, backgroundColor: colors.surface, borderRadius: radius.md},
  typeOption: {flex: 1, minHeight: controlHeight.sm, alignItems: 'center', justifyContent: 'center', borderRadius: radius.sm},
  expenseSelected: {backgroundColor: colors.expense},
  incomeSelected: {backgroundColor: colors.income},
  typeText: {color: colors.inkMuted, fontWeight: '700'},
  selectedTypeText: {color: colors.white},
  label: {color: colors.ink, fontSize: 12, fontWeight: '800', marginTop: spacing.lg, marginBottom: spacing.sm},
  optional: {color: colors.inkMuted, fontWeight: '500'},
  input: {backgroundColor: colors.surface, borderRadius: radius.md, color: colors.ink, fontSize: 14, paddingHorizontal: spacing.md, paddingVertical: spacing.sm},
  noteInput: {minHeight: 68, textAlignVertical: 'top'},
  saveButton: {height: controlHeight.md, borderRadius: radius.md, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, marginTop: spacing.xl},
  savePressed: {backgroundColor: colors.primaryDark, transform: [{scale: 0.99}]},
  saveText: {color: colors.white, fontSize: 14, fontWeight: '800'},
  disabled: {opacity: 0.65},
});
