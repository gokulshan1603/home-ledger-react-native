export type LoanDirection = 'given' | 'taken';
export type LoanStatus = 'active' | 'settled' | 'cancelled';

export interface Loan {
  id: string;
  uid: string;
  direction: LoanDirection;
  partyName: string;
  principal: number;
  outstanding?: number;
  interestRate?: number;
  startedAt: Date;
  dueAt?: Date;
  status: LoanStatus;
  note?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type LoanInput = Omit<Loan, 'id' | 'uid' | 'createdAt' | 'updatedAt'>;

export type LoanMovementKind = 'disbursement' | 'repayment' | 'interest';
export interface LoanMovement {id: string; uid: string; loanId: string; kind: LoanMovementKind; amount: number; date: Date; note?: string; createdAt?: Date}
