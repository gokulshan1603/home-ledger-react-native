import {format, isSameMonth} from 'date-fns';

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

export const formatMonth = (date: Date) => format(date, 'MMMM yyyy');
export const formatDate = (date: Date) => format(date, 'dd MMM yyyy');
export const formatShortDate = (date: Date) => format(date, 'dd MMM');
export const isCurrentMonth = (date: Date) => isSameMonth(date, new Date());
