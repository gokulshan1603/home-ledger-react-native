import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {GoldHolding} from '../types/gold';
import {FixedDeposit} from '../types/fixedDeposit';
import {Loan} from '../types/loan';
import {Transaction} from '../types/transaction';

export type HomeStackParamList = {
  Home: undefined;
  AddEntry: {transaction?: Transaction} | undefined;
};

export type GoldStackParamList = {
  Gold: undefined;
  AddGold: {holding?: GoldHolding} | undefined;
};

export type FDStackParamList = {
  FD: undefined;
  AddFD: {deposit?: FixedDeposit} | undefined;
};

export type LoansStackParamList = {
  Loans: undefined;
  AddLoan: {loan?: Loan} | undefined;
};

export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
};

export type HomeScreenProps = NativeStackScreenProps<HomeStackParamList, 'Home'>;
export type AddEntryScreenProps = NativeStackScreenProps<HomeStackParamList, 'AddEntry'>;
