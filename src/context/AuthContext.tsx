import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {User} from '@supabase/supabase-js';
import {onAuthChange} from '../services/authService';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({user: null, loading: true});

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(nextUser => {
      setUser(nextUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = useMemo(() => ({user, loading}), [loading, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
