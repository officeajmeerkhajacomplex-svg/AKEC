import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Student, FeePayment, Notice, UserRole } from './supabase';
import { mockStudents, mockNotices, mockPayments } from './mockData';

interface AppContextType {
  students: Student[];
  notices: Notice[];
  payments: FeePayment[];
  role: UserRole;
  setRole: (role: UserRole) => void;
  addStudent: (student: Omit<Student, 'id' | 'createdAt' | 'totalPending'>) => void;
  addPayment: (payment: Omit<FeePayment, 'id'>) => void;
  addNotice: (notice: Omit<Notice, 'id' | 'publishDate'>) => void;
  deleteStudent: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [notices, setNotices] = useState<Notice[]>(mockNotices);
  const [payments, setPayments] = useState<FeePayment[]>(mockPayments);
  const [role, setRole] = useState<UserRole>('super_admin');

  const addStudent = (studentData: Omit<Student, 'id' | 'createdAt' | 'totalPending'>) => {
    const newStudent: Student = {
      ...studentData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      totalPending: studentData.monthlyFee, // Assume first month pending
    };
    setStudents([...students, newStudent]);
  };

  const addPayment = (paymentData: Omit<FeePayment, 'id'>) => {
    const newPayment: FeePayment = {
      ...paymentData,
      id: Math.random().toString(36).substr(2, 9),
    };
    setPayments([...payments, newPayment]);
    
    // Update student ledger
    setStudents(prev => prev.map(s => {
      if (s.id === paymentData.studentId) {
        return {
          ...s,
          totalPending: Math.max(0, s.totalPending - paymentData.amount),
          lastPaymentDate: paymentData.paymentDate
        };
      }
      return s;
    }));
  };

  const addNotice = (noticeData: Omit<Notice, 'id' | 'publishDate'>) => {
    const newNotice: Notice = {
      ...noticeData,
      id: Math.random().toString(36).substr(2, 9),
      publishDate: new Date().toISOString().split('T')[0],
    };
    setNotices([newNotice, ...notices]);
  };

  const deleteStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
  };

  return (
    <AppContext.Provider value={{ 
      students, 
      notices, 
      payments, 
      role, 
      setRole, 
      addStudent, 
      addPayment, 
      addNotice, 
      deleteStudent 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
