import {Transaction} from '../types/transaction';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  AddEntry: {transaction?: Transaction} | undefined;
};
