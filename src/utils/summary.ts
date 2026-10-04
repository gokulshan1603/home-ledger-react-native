import {Transaction, AccountType} from '../types/transaction';

export const monthSummary = (items: Transaction[]) => {
  const income = items
    .filter(transaction => transaction.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const expense = items
    .filter(transaction => transaction.type === 'expense')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  return {income, expense, net: income - expense};
};

export const accountBalance = (
  all: Transaction[],
  account: AccountType,
  start = 0,
) =>
  all
    .filter(transaction => transaction.account === account)
    .reduce(
      (sum, transaction) =>
        sum +
        (transaction.type === 'income'
          ? transaction.amount
          : -transaction.amount),
      start,
    );
