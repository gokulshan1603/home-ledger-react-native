import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createClient} from '@supabase/supabase-js';

// Replace these values with the URL and publishable key from your Supabase
// project's Connect dialog. Never put a service role key in a mobile app.
const supabaseUrl = 'https://ckmadqdabfitjcxbbees.supabase.co';
const supabasePublishableKey = 'sb_publishable_RHq7EnU0NZoUi2fel-opxg_MOuj_mWY';


export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
