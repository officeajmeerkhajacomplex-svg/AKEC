export interface Student {
  id: string;
  name: string;
  className: string;
  phone?: string;
  totalPending: number;
  totalPaid: number;
  lastTransactionDate?: string;
}

export type TransactionType = 'DUE' | 'PAID';

export interface Transaction {
  id: string;
  studentId: string;
  amount: number;
  type: TransactionType;
  date: string;
  note?: string;
  runningBalance: number; // Balance after this transaction
}

export interface User {
  id: string;
  name: string;
  phone: string;
  role: 'USTAD';
}
