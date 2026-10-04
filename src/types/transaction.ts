export type TransactionType = 'income' | 'expense';
export type AccountType = 'bank' | 'cash';

export interface Transaction {
  id: string;
  uid: string;
  type: TransactionType;
  amount: number;
  date: Date;
  category: string;
  account: AccountType;
  note?: string;
  createdAt?: Date;
}

export type TransactionInput = Omit<Transaction, 'id' | 'uid' | 'createdAt'>;
