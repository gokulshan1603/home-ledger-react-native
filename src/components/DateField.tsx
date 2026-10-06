import React, {useState} from 'react';
import {Modal, Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import DateTimePicker, {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import {CalendarDays} from 'lucide-react-native';
import {Colors, controlHeight, radius, spacing} from '../constants/theme';
import {useTheme} from '../context/ThemeContext';
import {formatDate} from '../utils/format';

export default function DateField({value, onChange}: {value: Date; onChange: (value: Date) => void}) {
  const {colors} = useTheme();
  const styles = createStyles(colors);
  const [visible, setVisible] = useState(false);
  const onDateChange = (event: DateTimePickerEvent, selected?: Date) => { if (Platform.OS === 'android') setVisible(false); if (event.type !== 'dismissed' && selected) onChange(selected); };
  return <>
    <Pressable onPress={() => setVisible(true)} style={({pressed}) => [styles.field, pressed && styles.pressed]}><Text style={styles.text}>{formatDate(value)}</Text><CalendarDays size={18} color={colors.primary} strokeWidth={2.25} /></Pressable>
    {Platform.OS === 'android' && visible ? <DateTimePicker value={value} mode="date" onChange={onDateChange} /> : null}
    {Platform.OS === 'ios' ? <Modal transparent visible={visible} animationType="slide" onRequestClose={() => setVisible(false)}><View style={styles.backdrop}><View style={styles.modal}><View style={styles.header}><Text style={styles.modalTitle}>Choose date</Text><Pressable onPress={() => setVisible(false)}><Text style={styles.done}>Done</Text></Pressable></View><DateTimePicker value={value} mode="date" display="spinner" onChange={onDateChange} /></View></View></Modal> : null}
  </>;
}

const createStyles = (colors: Colors) => StyleSheet.create({
  field: {minHeight: controlHeight.md, paddingHorizontal: spacing.md, backgroundColor: colors.surface, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  pressed: {backgroundColor: colors.surfaceMuted}, text: {color: colors.ink, fontSize: 14, fontWeight: '600'},
  backdrop: {flex: 1, justifyContent: 'flex-end', backgroundColor: colors.modalBackdrop}, modal: {backgroundColor: colors.surface, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, padding: spacing.lg},
  header: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}, modalTitle: {color: colors.ink, fontSize: 15, fontWeight: '800'}, done: {color: colors.primary, fontWeight: '800'},
});
