import {useEffect, useState} from 'react';
import {FixedDeposit} from '../types/fixedDeposit';
import {listenFixedDeposits} from '../services/fdService';

export const useFixedDeposits = () => { const [items, setItems] = useState<FixedDeposit[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null); useEffect(() => { setLoading(true); return listenFixedDeposits(next => { setItems(next); setLoading(false); }, nextError => { setError(nextError.message); setLoading(false); }); }, []); return {items, loading, error}; };
