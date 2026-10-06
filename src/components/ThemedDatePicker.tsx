import React, {useState} from 'react';
import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import {addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, isToday, startOfMonth, startOfWeek} from 'date-fns';
import {CalendarDays, ChevronLeft, ChevronRight} from 'lucide-react-native';
import {Colors, controlHeight, radius, spacing} from '../constants/theme';
import {useTheme} from '../context/ThemeContext';
import {formatDate} from '../utils/format';

const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function ThemedDatePicker({value, onChange}: {value: Date; onChange: (value: Date) => void}) {
  const {colors} = useTheme();
  const styles = createStyles(colors);
  const [visible, setVisible] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(startOfMonth(value));
  const calendarDays = eachDayOfInterval({
    start: startOfWeek(calendarMonth, {weekStartsOn: 1}),
    end: endOfWeek(endOfMonth(calendarMonth), {weekStartsOn: 1}),
  });

  const open = () => {
    setCalendarMonth(startOfMonth(value));
    setVisible(true);
  };

  const chooseDate = (date: Date) => {
    onChange(date);
    setVisible(false);
  };

  return <>
    <Pressable accessibilityRole="button" accessibilityLabel={`Date, ${formatDate(value)}`} onPress={open} style={({pressed}) => [styles.field, pressed && styles.fieldPressed]}>
      <Text style={styles.fieldText}>{formatDate(value)}</Text>
      <CalendarDays size={19} color={colors.ink} strokeWidth={2.25} />
    </Pressable>
    <Modal transparent visible={visible} animationType="slide" onRequestClose={() => setVisible(false)}>
      <View style={styles.backdrop}>
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Choose date</Text>
              <Text style={styles.selectedDate}>{format(value, 'dd MMM yyyy')}</Text>
            </View>
            <Pressable accessibilityRole="button" onPress={() => setVisible(false)} style={({pressed}) => [styles.doneButton, pressed && styles.pressed]}>
              <Text style={styles.done}>Done</Text>
            </Pressable>
          </View>
          <View style={styles.monthHeader}>
            <Pressable accessibilityLabel="Previous month" onPress={() => setCalendarMonth(current => addMonths(current, -1))} style={({pressed}) => [styles.monthButton, pressed && styles.pressed]}>
              <ChevronLeft size={20} color={colors.ink} strokeWidth={2.3} />
            </Pressable>
            <Text style={styles.monthTitle}>{format(calendarMonth, 'MMMM yyyy')}</Text>
            <Pressable accessibilityLabel="Next month" onPress={() => setCalendarMonth(current => addMonths(current, 1))} style={({pressed}) => [styles.monthButton, pressed && styles.pressed]}>
              <ChevronRight size={20} color={colors.ink} strokeWidth={2.3} />
            </Pressable>
          </View>
          <View style={styles.weekHeader}>
            {WEEK_DAYS.map((day, index) => <Text key={`${day}-${index}`} style={styles.weekDay}>{day}</Text>)}
          </View>
          <View style={styles.calendarGrid}>
            {calendarDays.map(day => {
              const selected = isSameDay(day, value);
              return <View key={day.toISOString()} style={styles.dayCell}>
                <Pressable accessibilityRole="button" accessibilityLabel={format(day, 'dd MMMM yyyy')} onPress={() => chooseDate(day)} style={({pressed}) => [styles.day, !isSameMonth(day, calendarMonth) && styles.outsideDay, isToday(day) && !selected && styles.today, selected && styles.selectedDay, pressed && styles.pressed]}>
                  <Text style={[styles.dayText, !isSameMonth(day, calendarMonth) && styles.outsideDayText, selected && styles.selectedDayText]}>{format(day, 'd')}</Text>
                </Pressable>
              </View>;
            })}
          </View>
        </View>
      </View>
    </Modal>
  </>;
}

const createStyles = (colors: Colors) => StyleSheet.create({
  field: {height: controlHeight.md, paddingHorizontal: spacing.md, backgroundColor: colors.surface, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  fieldPressed: {backgroundColor: colors.surfaceMuted},
  fieldText: {color: colors.ink, fontSize: 14, fontWeight: '600'},
  backdrop: {flex: 1, justifyContent: 'flex-end', backgroundColor: colors.modalBackdrop},
  modal: {backgroundColor: colors.surface, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, padding: spacing.xl},
  modalHeader: {flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between'},
  modalTitle: {color: colors.ink, fontSize: 17, fontWeight: '800'},
  selectedDate: {color: colors.inkMuted, fontSize: 13, fontWeight: '600', marginTop: spacing.xs},
  doneButton: {minHeight: controlHeight.xs, justifyContent: 'center', paddingHorizontal: spacing.sm},
  done: {color: colors.primary, fontSize: 14, fontWeight: '800'},
  monthHeader: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.xl},
  monthButton: {height: controlHeight.xs, width: controlHeight.xs, borderRadius: radius.pill, backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center'},
  monthTitle: {color: colors.ink, fontSize: 15, fontWeight: '800'},
  weekHeader: {flexDirection: 'row', marginTop: spacing.lg, marginBottom: spacing.xs},
  weekDay: {width: '14.2857%', color: colors.inkMuted, fontSize: 11, fontWeight: '800', textAlign: 'center'},
  calendarGrid: {flexDirection: 'row', flexWrap: 'wrap'},
  dayCell: {width: '14.2857%', height: 40, alignItems: 'center', justifyContent: 'center'},
  day: {height: 36, width: 36, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center'},
  today: {borderWidth: 1, borderColor: colors.primary},
  selectedDay: {backgroundColor: colors.primary},
  dayText: {color: colors.ink, fontSize: 13, fontWeight: '700'},
  outsideDay: {opacity: 0.45},
  outsideDayText: {color: colors.inkMuted},
  selectedDayText: {color: colors.white},
  pressed: {opacity: 0.75},
});
