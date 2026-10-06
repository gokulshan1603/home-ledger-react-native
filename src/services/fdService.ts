import {supabase} from '../config/supabase';
import {FixedDeposit, FixedDepositInput} from '../types/fixedDeposit';

type FDRow = {
  id: string; uid: string; name: string; principal: number | string; interest_rate: number | string | null;
  started_at: string; maturity_at: string; maturity_amount: number | string | null; status: FixedDeposit['status'];
  note: string | null; created_at: string | null; updated_at: string | null;
};

const requireUid = async () => { const {data: {user}} = await supabase.auth.getUser(); if (!user) throw new Error('You must be logged in to manage fixed deposits.'); return user.id; };

const fromRow = (row: FDRow): FixedDeposit => ({
  id: row.id, uid: row.uid, name: row.name, principal: Number(row.principal), ...(row.interest_rate == null ? {} : {interestRate: Number(row.interest_rate)}),
  startedAt: new Date(row.started_at), maturityAt: new Date(row.maturity_at), ...(row.maturity_amount == null ? {} : {maturityAmount: Number(row.maturity_amount)}),
  status: row.status, ...(row.note ? {note: row.note} : {}), ...(row.created_at ? {createdAt: new Date(row.created_at)} : {}), ...(row.updated_at ? {updatedAt: new Date(row.updated_at)} : {}),
});

const toRow = (input: FixedDepositInput) => ({name: input.name, principal: input.principal, interest_rate: input.interestRate ?? null, started_at: input.startedAt.toISOString(), maturity_at: input.maturityAt.toISOString(), maturity_amount: input.maturityAmount ?? null, status: input.status, note: input.note ?? null});

export const listFixedDeposits = async () => { const uid = await requireUid(); const {data, error} = await supabase.from('fixed_deposits').select('*').eq('uid', uid).order('maturity_at', {ascending: true}); if (error) throw error; return (data ?? []).map(row => fromRow(row as FDRow)); };
export const addFixedDeposit = async (input: FixedDepositInput) => { const uid = await requireUid(); const {data, error} = await supabase.from('fixed_deposits').insert({uid, ...toRow(input)}).select().single(); if (error) throw error; return fromRow(data as FDRow); };
export const updateFixedDeposit = async (id: string, input: Partial<FixedDepositInput>) => { await requireUid(); const update: Record<string, unknown> = {...input}; if (input.interestRate !== undefined) { update.interest_rate = input.interestRate; delete update.interestRate; } if (input.startedAt) { update.started_at = input.startedAt.toISOString(); delete update.startedAt; } if (input.maturityAt) { update.maturity_at = input.maturityAt.toISOString(); delete update.maturityAt; } if (input.maturityAmount !== undefined) { update.maturity_amount = input.maturityAmount; delete update.maturityAmount; } const {error} = await supabase.from('fixed_deposits').update(update).eq('id', id); if (error) throw error; };
export const deleteFixedDeposit = async (id: string) => { await requireUid(); const {error} = await supabase.from('fixed_deposits').delete().eq('id', id); if (error) throw error; };
export const listenFixedDeposits = (callback: (items: FixedDeposit[]) => void, onError?: (error: Error) => void) => { let active = true; const load = async () => { try { const items = await listFixedDeposits(); if (active) callback(items); } catch (error) { if (active) onError?.(error instanceof Error ? error : new Error(String(error))); } }; load(); const channel = supabase.channel('fixed-deposits').on('postgres_changes', {event: '*', schema: 'public', table: 'fixed_deposits'}, load).subscribe(); return () => { active = false; supabase.removeChannel(channel); }; };
