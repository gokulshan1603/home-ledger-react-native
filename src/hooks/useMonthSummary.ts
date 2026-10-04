import {useMemo} from 'react';
import {monthSummary} from '../utils/summary';
import {Transaction} from '../types/transaction';

export const useMonthSummary = (transactions: Transaction[]) =>
  useMemo(() => monthSummary(transactions), [transactions]);
