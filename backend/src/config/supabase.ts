import { createClient } from '@supabase/supabase-js';
import { ApiError } from '../middleware/errorHandler';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new ApiError(
    500,
    'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables'
  );
}

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export const verifySupabaseConnection = async (): Promise<void> => {
  const { error } = await supabase.from('respondents').select('id').limit(1);
  if (error) {
    throw new ApiError(503, `Supabase connection check failed: ${error.message}`);
  }
};
