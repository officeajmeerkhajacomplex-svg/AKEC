import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Use a mock client if credentials are not provided
export const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'MY_SUPABASE_URL')
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export type Student = {
  id: string;
  name: string;
  className: string;
  guardianName: string;
  phoneNumber: string;
  monthlyFee: number;
  totalPending: number;
  lastPaymentDate?: string;
  avatarUrl?: string;
  createdAt: string;
};

export type FeePayment = {
  id: string;
  studentId: string;
  amount: number;
  paymentDate: string;
  month: string;
  year: number;
  status: 'paid' | 'partial';
  method: 'cash' | 'online';
  remarks?: string;
};

export type Notice = {
  id: string;
  title: string;
  content: string;
  type: 'event' | 'holiday' | 'exam' | 'ramadan' | 'general';
  publishDate: string;
  expiryDate?: string;
  authorId: string;
};

export type UserRole = 'super_admin' | 'accountant' | 'teacher' | 'parent' | 'student';
