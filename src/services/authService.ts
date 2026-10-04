import {User} from '@supabase/supabase-js';
import {supabase} from '../config/supabase';

export const login = async (email: string, password: string) => {
  const {data, error} = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    throw error;
  }

  return data;
};

export const logout = async () => {
  const {error} = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  const {
    data: {subscription},
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });

  return () => subscription.unsubscribe();
};
