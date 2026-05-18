import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data, error } = await supabase.from('students').insert([{
    student_name: "Test",
    class_name: "Test",
    department: "Dars",
    parent_phone: "123",
    parent_id: null
  }]);
  console.log("Error:", error);
  console.log("Data:", data);
}

test();
