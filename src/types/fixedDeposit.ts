export type FixedDepositStatus = 'active' | 'matured' | 'closed' | 'renewed';
export type FixedDepositInterestFrequency = 'monthly' | 'quarterly' | 'annual' | 'on_maturity';

export interface FixedDeposit {
  id: string;
  uid: string;
  name: string;
  principal: number;
  interestFrequency: FixedDepositInterestFrequency;
  interestRate?: number;
  startedAt: Date;
  maturityAt: Date;
  maturityAmount: number;
  status: FixedDepositStatus;
  note?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type FixedDepositInput = Omit<FixedDeposit, 'id' | 'uid' | 'createdAt' | 'updatedAt'>;
