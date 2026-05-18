import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { error } = await supabase.from('progress_reports').update({
    attendance_present: 0,
    attendance_absent: 0,
    class_performance: 'Good',
    hifz_juz_completed: 0,
    exam_mark: 0,
    exam_total: 100
  }).eq('id', '00000000-0000-0000-0000-000000000000');
  console.log("Error:", error);
}

test();
