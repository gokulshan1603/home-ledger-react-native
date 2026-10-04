import {useEffect, useState} from 'react';
import {addMonths, startOfMonth} from 'date-fns';
import {listenAll, listenMonth} from '../services/transactionService';
import {Transaction} from '../types/transaction';

export const useTransactions = (month: Date) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const start = startOfMonth(month);
    const end = addMonths(start, 1);
    let activeListeners = 0;
    const onReady = () => {
      activeListeners += 1;
      if (activeListeners === 2) {
        setLoading(false);
      }
    };
    const onError = (listenerError: Error) => {
      setLoading(false);
      setError(listenerError.message);
    };

    const stopMonth = listenMonth(start, end, items => {
      setTransactions(items);
      onReady();
    }, onError);
    const stopAll = listenAll(items => {
      setAllTransactions(items);
      onReady();
    }, onError);

    return () => {
      stopMonth();
      stopAll();
    };
  }, [month]);

  return {transactions, allTransactions, loading, error};
};
