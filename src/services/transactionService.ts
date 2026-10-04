import {supabase} from '../config/supabase';
import {Transaction, TransactionInput} from '../types/transaction';

type TransactionRow = {
  id: string;
  uid: string;
  type: Transaction['type'];
  amount: number | string;
  date: string;
  category: string;
  account: Transaction['account'];
  note: string | null;
  created_at: string | null;
};

const requireCurrentUid = async () => {
  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in to manage transactions.');
  }

  return user.id;
};

const fromRow = (row: TransactionRow): Transaction => ({
  id: row.id,
  uid: row.uid,
  type: row.type,
  amount: Number(row.amount),
  date: new Date(row.date),
  category: row.category,
  account: row.account,
  ...(row.note ? {note: row.note} : {}),
  ...(row.created_at ? {createdAt: new Date(row.created_at)} : {}),
});

const toRow = (transaction: TransactionInput) => ({
  type: transaction.type,
  amount: transaction.amount,
  date: transaction.date.toISOString(),
  category: transaction.category,
  account: transaction.account,
  ...(transaction.note ? {note: transaction.note} : {note: null}),
});

export const addTransaction = async (transaction: TransactionInput) => {
  const uid = await requireCurrentUid();
  const {data, error} = await supabase
    .from('transactions')
    .insert({uid, ...toRow(transaction)})
    .select()
    .single();

  if (error) {
    throw error;
  }

  return fromRow(data as TransactionRow);
};

export const updateTransaction = async (
  id: string,
  transaction: Partial<TransactionInput>,
) => {
  await requireCurrentUid();
  const update = {
    ...(transaction.type !== undefined ? {type: transaction.type} : {}),
    ...(transaction.amount !== undefined ? {amount: transaction.amount} : {}),
    ...(transaction.date !== undefined
      ? {date: transaction.date.toISOString()}
      : {}),
    ...(transaction.category !== undefined
      ? {category: transaction.category}
      : {}),
    ...(transaction.account !== undefined
      ? {account: transaction.account}
      : {}),
    ...(transaction.note !== undefined ? {note: transaction.note || null} : {}),
  };
  const {error} = await supabase.from('transactions').update(update).eq('id', id);

  if (error) {
    throw error;
  }
};

export const deleteTransaction = async (id: string) => {
  await requireCurrentUid();
  const {error} = await supabase.from('transactions').delete().eq('id', id);

  if (error) {
    throw error;
  }
};

const listen = (
  buildQuery: (uid: string) => PromiseLike<{
    data: TransactionRow[] | null;
    error: {message: string} | null;
  }>,
  channelName: string,
  callback: (items: Transaction[]) => void,
  onError?: (error: Error) => void,
) => {
  let active = true;

  const load = async () => {
    try {
      const uid = await requireCurrentUid();
      const {data, error} = await buildQuery(uid);
      if (error) {
        throw error;
      }
      if (active) {
        callback((data ?? []).map(fromRow));
      }
    } catch (error) {
      if (active) {
        onError?.(error instanceof Error ? error : new Error(String(error)));
      }
    }
  };

  load();

  const channel = supabase
    .channel(channelName)
    .on(
      'postgres_changes',
      {event: '*', schema: 'public', table: 'transactions'},
      () => load(),
    )
    .subscribe();

  return () => {
    active = false;
    supabase.removeChannel(channel);
  };
};

export const listenMonth = (
  start: Date,
  end: Date,
  callback: (items: Transaction[]) => void,
  onError?: (error: Error) => void,
) =>
  listen(
    uid =>
      supabase
        .from('transactions')
        .select('*')
        .eq('uid', uid)
        .gte('date', start.toISOString())
        .lt('date', end.toISOString())
        .order('date', {ascending: false}),
    `transactions-month-${start.toISOString()}`,
    callback,
    onError,
  );

export const listenAll = (
  callback: (items: Transaction[]) => void,
  onError?: (error: Error) => void,
) =>
  listen(
    uid =>
      supabase
        .from('transactions')
        .select('*')
        .eq('uid', uid)
        .order('date', {ascending: false}),
    'transactions-all',
    callback,
    onError,
  );
