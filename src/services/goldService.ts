import {supabase} from '../config/supabase';
import {GoldHolding, GoldInput} from '../types/gold';

type GoldRow = {
  id: string; uid: string; name: string; weight: number | null; purity: number | null;
  purchase_amount: number | string; current_value: number | string | null; purchased_at: string;
  sold_at: string | null; status: GoldHolding['status']; note: string | null; created_at: string | null; updated_at: string | null;
};

const requireUid = async () => {
  const {data: {user}} = await supabase.auth.getUser();
  if (!user) throw new Error('You must be logged in to manage gold.');
  return user.id;
};

const fromRow = (row: GoldRow): GoldHolding => ({
  id: row.id, uid: row.uid, name: row.name, ...(row.weight == null ? {} : {weight: Number(row.weight)}),
  ...(row.purity == null ? {} : {purity: Number(row.purity)}), purchaseAmount: Number(row.purchase_amount),
  ...(row.current_value == null ? {} : {currentValue: Number(row.current_value)}), purchasedAt: new Date(row.purchased_at),
  ...(row.sold_at ? {soldAt: new Date(row.sold_at)} : {}), status: row.status, ...(row.note ? {note: row.note} : {}),
  ...(row.created_at ? {createdAt: new Date(row.created_at)} : {}), ...(row.updated_at ? {updatedAt: new Date(row.updated_at)} : {}),
});

const toRow = (input: GoldInput) => ({
  name: input.name, weight: input.weight ?? null, purity: input.purity ?? null, purchase_amount: input.purchaseAmount,
  current_value: input.currentValue ?? null, purchased_at: input.purchasedAt.toISOString(), sold_at: input.soldAt?.toISOString() ?? null,
  status: input.status, note: input.note ?? null,
});

export const listGold = async () => {
  const uid = await requireUid();
  const {data, error} = await supabase.from('gold_holdings').select('*').eq('uid', uid).order('purchased_at', {ascending: false});
  if (error) throw error;
  return (data ?? []).map(row => fromRow(row as GoldRow));
};

export const addGold = async (input: GoldInput) => {
  const uid = await requireUid();
  const {data, error} = await supabase.from('gold_holdings').insert({uid, ...toRow(input)}).select().single();
  if (error) throw error;
  return fromRow(data as GoldRow);
};

export const updateGold = async (id: string, input: Partial<GoldInput>) => {
  await requireUid();
  const update = {...input, ...(input.purchaseAmount === undefined ? {} : {purchase_amount: input.purchaseAmount}), ...(input.currentValue === undefined ? {} : {current_value: input.currentValue}), ...(input.purchasedAt === undefined ? {} : {purchased_at: input.purchasedAt.toISOString()}), ...(input.soldAt === undefined ? {} : {sold_at: input.soldAt?.toISOString() ?? null})};
  delete (update as Record<string, unknown>).purchaseAmount;
  delete (update as Record<string, unknown>).currentValue;
  delete (update as Record<string, unknown>).purchasedAt;
  delete (update as Record<string, unknown>).soldAt;
  const {error} = await supabase.from('gold_holdings').update(update).eq('id', id);
  if (error) throw error;
};

export const deleteGold = async (id: string) => {
  await requireUid();
  const {error} = await supabase.from('gold_holdings').delete().eq('id', id);
  if (error) throw error;
};

export const listenGold = (callback: (items: GoldHolding[]) => void, onError?: (error: Error) => void) => {
  let active = true;
  const load = async () => { try { const items = await listGold(); if (active) callback(items); } catch (error) { if (active) onError?.(error instanceof Error ? error : new Error(String(error))); } };
  load();
  const channel = supabase.channel('gold-holdings').on('postgres_changes', {event: '*', schema: 'public', table: 'gold_holdings'}, load).subscribe();
  return () => { active = false; supabase.removeChannel(channel); };
};
