export type LoanDirection = 'given' | 'taken';
export type LoanStatus = 'active' | 'settled' | 'cancelled';

export interface Loan {
  id: string;
  uid: string;
  direction: LoanDirection;
  partyName: string;
  principal: number;
  interestRate?: number;
  startedAt: Date;
  dueAt?: Date;
  status: LoanStatus;
  note?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type LoanInput = Omit<Loan, 'id' | 'uid' | 'createdAt' | 'updatedAt'>;
