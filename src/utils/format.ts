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

const ones = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

const underThousandToWords = (value: number): string => {
  if (value < 10) return ones[value];
  if (value < 20) return teens[value - 10];
  if (value < 100) return `${tens[Math.floor(value / 10)]}${value % 10 ? ` ${ones[value % 10]}` : ''}`;
  return `${ones[Math.floor(value / 100)]} hundred${value % 100 ? ` ${underThousandToWords(value % 100)}` : ''}`;
};

const indianNumberToWords = (value: number): string => {
  if (value === 0) return 'zero';
  const parts: string[] = [];
  const crore = Math.floor(value / 10000000);
  const lakh = Math.floor((value % 10000000) / 100000);
  const thousand = Math.floor((value % 100000) / 1000);
  const remainder = value % 1000;
  if (crore) parts.push(`${underThousandToWords(crore)} crore`);
  if (lakh) parts.push(`${underThousandToWords(lakh)} lakh`);
  if (thousand) parts.push(`${underThousandToWords(thousand)} thousand`);
  if (remainder) parts.push(underThousandToWords(remainder));
  return parts.join(' ');
};

export const amountToWords = (value: string | number) => {
  const amount = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return '';
  const totalPaise = Math.round(amount * 100);
  const rupees = Math.floor(totalPaise / 100);
  const paise = totalPaise % 100;
  const rupeeText = `${indianNumberToWords(rupees)} ${rupees === 1 ? 'rupee' : 'rupees'}`;
  const paiseText = paise ? ` and ${indianNumberToWords(paise)} ${paise === 1 ? 'paise' : 'paise'}` : '';
  return `${rupeeText}${paiseText}`.replace(/^./, character => character.toUpperCase());
};
