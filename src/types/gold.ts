export type GoldStatus = 'active' | 'sold';

export interface GoldHolding {
  id: string;
  uid: string;
  name: string;
  weight?: number;
  purchasedAt: Date;
  soldAt?: Date;
  status: GoldStatus;
  note?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type GoldInput = Omit<GoldHolding, 'id' | 'uid' | 'createdAt' | 'updatedAt'>;
