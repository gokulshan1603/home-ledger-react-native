import {useEffect, useState} from 'react';
import {GoldHolding} from '../types/gold';
import {listenGold} from '../services/goldService';

export const useGold = () => { const [items, setItems] = useState<GoldHolding[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null); useEffect(() => { setLoading(true); return listenGold(next => { setItems(next); setLoading(false); }, nextError => { setError(nextError.message); setLoading(false); }); }, []); return {items, loading, error}; };
