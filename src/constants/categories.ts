import {TransactionType} from '../types/transaction';

export const CATEGORIES: Record<TransactionType, string[]> = {
  expense: [
    'Rent',
    'Groceries',
    'Utilities',
    'Transport',
    'Dining',
    'Health',
    'Education',
    'Interest',
    'Shopping',
    'Entertainment',
    'Other',
  ],
  income: ['Salary', 'Rent received', 'Business', 'Interest', 'Gift', 'Other'],
};
