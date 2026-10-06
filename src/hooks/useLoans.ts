import {useEffect, useState} from 'react';
import {Loan} from '../types/loan';
import {listenLoans} from '../services/loanService';

export const useLoans = () => { const [items, setItems] = useState<Loan[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null); useEffect(() => { setLoading(true); return listenLoans(next => { setItems(next); setLoading(false); }, nextError => { setError(nextError.message); setLoading(false); }); }, []); return {items, loading, error}; };
