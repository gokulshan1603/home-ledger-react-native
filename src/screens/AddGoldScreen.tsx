import React, {useCallback, useLayoutEffect, useState} from 'react';
import {ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput} from 'react-native';
import {Check, Trash2} from 'lucide-react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {GoldStackParamList} from '../navigation/types';
import {addGold, deleteGold, updateGold} from '../services/goldService';
import {GoldStatus} from '../types/gold';
import {Colors, controlHeight, radius, spacing} from '../constants/theme';
import {useTheme} from '../context/ThemeContext';
import ThemedDatePicker from '../components/ThemedDatePicker';
import AppHeader from '../components/AppHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import MessageDialog from '../components/MessageDialog';

type Props = NativeStackScreenProps<GoldStackParamList, 'AddGold'>;

export default function AddGoldScreen({navigation, route}: Props) {
  const {colors} = useTheme();
  const styles = createStyles(colors);
  const existing = route.params?.holding;
  const editing = Boolean(existing);
  const [name, setName] = useState(existing?.name ?? '');
  const [weight, setWeight] = useState(existing?.weight?.toString() ?? '');
  const [date, setDate] = useState(existing?.purchasedAt ?? new Date());
  const [note, setNote] = useState(existing?.note ?? '');
  const [saving, setSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [messageDialog, setMessageDialog] = useState<{title: string; message: string} | null>(null);
  const openDeleteDialog = useCallback(() => {
    if (existing) setShowDeleteDialog(true);
  }, [existing]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: editing ? 'Edit gold' : 'Add gold',
      // This callback is consumed by React Navigation as a header renderer.
      // eslint-disable-next-line react/no-unstable-nested-components
      header: () => <AppHeader title={editing ? 'Edit gold' : 'Add gold'} onBack={() => navigation.goBack()} rightAction={editing ? {accessibilityLabel: 'Delete gold holding', onPress: openDeleteDialog, variant: 'danger', icon: <Trash2 size={19} color={colors.white} strokeWidth={2.3} />} : undefined} />,
    });
  }, [colors.expense, colors.white, editing, navigation, openDeleteDialog]);

  const save = async () => {
    const numericWeight = Number(weight);
    if (!name.trim() || !numericWeight || numericWeight <= 0) {
      setMessageDialog({title: 'Enter holding details', message: 'Add a name and a weight greater than zero.'});
      return;
    }
    setSaving(true);
    try {
      const input = {
        name: name.trim(),
        weight: numericWeight,
        purchasedAt: date,
        status: (existing?.status ?? 'active') as GoldStatus,
        soldAt: existing?.soldAt,
        ...(note.trim() ? {note: note.trim()} : {}),
      };
      if (existing) {
        await updateGold(existing.id, input);
      } else {
        await addGold(input);
      }
      navigation.goBack();
    } catch {
      setMessageDialog({title: 'Could not save gold holding', message: 'Please check your connection and try again.'});
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!existing) return;
    setShowDeleteDialog(false);
    try {
      await deleteGold(existing.id);
      navigation.goBack();
    } catch {
      setMessageDialog({title: 'Could not delete gold holding', message: 'Please check your connection and try again.'});
    }
  };

  return <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={[styles.label, styles.firstLabel]}>Name</Text>
      <TextInput value={name} onChangeText={setName} placeholder="Gold coins" placeholderTextColor={colors.inkMuted} style={styles.input} />
      <Text style={styles.label}>Weight (g)</Text>
      <TextInput value={weight} onChangeText={text => setWeight(text.replace(/[^0-9.]/g, ''))} keyboardType="decimal-pad" placeholder="0" placeholderTextColor={colors.inkMuted} style={styles.input} />
      <Text style={styles.label}>Purchase date</Text>
      <ThemedDatePicker value={date} onChange={setDate} />
      <Text style={styles.label}>Note <Text style={styles.optional}>(optional)</Text></Text>
      <TextInput value={note} onChangeText={setNote} placeholder="Optional note" placeholderTextColor={colors.inkMuted} style={[styles.input, styles.note]} multiline maxLength={120} />
      <Pressable onPress={save} disabled={saving} style={({pressed}) => [styles.saveButton, pressed && styles.savePressed, saving && styles.disabled]}>
        {saving ? <ActivityIndicator color={colors.white} /> : <><Text style={styles.saveText}>{editing ? 'Save changes' : 'Save holding'}</Text><Check size={17} color={colors.white} strokeWidth={2.5} /></>}
      </Pressable>
    </ScrollView>
    <ConfirmDialog visible={showDeleteDialog} title="Delete this gold holding?" message="This cannot be undone." confirmLabel="Delete" onCancel={() => setShowDeleteDialog(false)} onConfirm={remove} />
    <MessageDialog visible={messageDialog !== null} title={messageDialog?.title ?? ''} message={messageDialog?.message ?? ''} onClose={() => setMessageDialog(null)} />
  </KeyboardAvoidingView>;
}

const createStyles = (colors: Colors) => StyleSheet.create({
  flex: {flex: 1, backgroundColor: colors.canvas},
  content: {paddingHorizontal: spacing.lg, paddingTop: 0, paddingBottom: spacing.xl * 3},
  firstLabel: {marginTop: 0},
  label: {color: colors.ink, fontSize: 12, fontWeight: '800', marginTop: spacing.lg, marginBottom: spacing.sm},
  optional: {color: colors.inkMuted, fontWeight: '500'},
  input: {height: controlHeight.md, backgroundColor: colors.surface, borderRadius: radius.md, color: colors.ink, fontSize: 14, paddingHorizontal: spacing.md},
  note: {height: 80, paddingVertical: spacing.sm, textAlignVertical: 'top'},
  saveButton: {height: controlHeight.md, borderRadius: radius.md, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, marginTop: spacing.xl},
  savePressed: {backgroundColor: colors.primaryDark, transform: [{scale: 0.99}]},
  saveText: {color: colors.white, fontSize: 14, fontWeight: '800'},
  disabled: {opacity: 0.7},
});
