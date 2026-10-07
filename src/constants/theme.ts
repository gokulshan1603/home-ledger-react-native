export type Colors = {
  ink: string;
  inkMuted: string;
  canvas: string;
  surface: string;
  surfaceMuted: string;
  line: string;
  primary: string;
  primaryDark: string;
  primarySoft: string;
  selectionSoft: string;
  income: string;
  incomeSoft: string;
  expense: string;
  expenseSoft: string;
  warning: string;
  summaryInk: string;
  summaryEyebrow: string;
  summaryNet: string;
  summaryNegative: string;
  summaryDivider: string;
  summaryLabel: string;
  white: string;
  black: string;
  modalBackdrop: string;
};

export const lightColors: Colors = {
  ink: '#24242B',
  inkMuted: '#60606A',
  canvas: '#F5F5F8',
  surface: '#FFFFFF',
  surfaceMuted: '#EEEEF2',
  line: '#E1E1E7',
  primary: '#4285F4',
  primaryDark: '#185ABC',
  primarySoft: '#E8F0FE',
  selectionSoft: '#C6DAFC',
  income: '#408F63',
  incomeSoft: '#F1F8F4',
  expense: '#C94747',
  expenseSoft: '#FCF3F3',
  warning: '#B98126',
  summaryInk: '#24242B',
  summaryEyebrow: '#E8F0FE',
  summaryNet: '#F1F8F4',
  summaryNegative: '#FCF3F3',
  summaryDivider: '#E1E1E7',
  summaryLabel: '#60606A',
  white: '#FFFFFF',
  black: '#000000',
  modalBackdrop: 'rgba(0,0,0,0.35)',
};

export const darkColors: Colors = {
  ink: '#FFFFFF',
  inkMuted: 'rgba(235,235,245,0.75)',
  canvas: '#000000',
  surface: '#141416',
  surfaceMuted: '#2C2C2E',
  line: 'rgba(84,84,88,0.32)',
  primary: '#4285F4',
  primaryDark: '#185ABC',
  primarySoft: 'rgba(66,133,244,0.16)',
  selectionSoft: '#2C2C2E',
  income: '#27804F',
  incomeSoft: 'rgba(39,128,79,0.16)',
  expense: '#CC4545',
  expenseSoft: 'rgba(204,69,69,0.16)',
  warning: '#A66D00',
  summaryInk: '#FFFFFF',
  summaryEyebrow: '#4285F4',
  summaryNet: 'rgba(39,128,79,0.16)',
  summaryNegative: 'rgba(204,69,69,0.16)',
  summaryDivider: 'rgba(84,84,88,0.32)',
  summaryLabel: 'rgba(235,235,245,0.75)',
  white: '#FFFFFF',
  black: '#000000',
  modalBackdrop: 'rgba(0,0,0,0.62)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
};

export const controlHeight = {
  xs: 32,
  sm: 40,
  md: 48,
  lg: 52,
};
