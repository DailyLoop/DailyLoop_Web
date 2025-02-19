import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  toast.error(
    'Please connect to Supabase by clicking the "Connect to Supabase" button in the top right corner.',
    { duration: 5000 }
  );
}

export const supabase = createClient(
  supabaseUrl || 'someURL',
  supabaseAnonKey || 'someKey'
);