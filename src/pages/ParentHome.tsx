import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProgressCard } from '../components/ProgressCard';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

export default function ParentHome() {
  const { user } = useAuth();
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChildren = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          progress_reports(*)
        `)
        .eq('parent_id', user.id)
        .order('updated_at', { referencedTable: 'progress_reports', ascending: false });

      if (data) {
        setChildren(data);
      }
      setLoading(false);
    };

    fetchChildren();
  }, [user]);

  if (loading) {
     return (
        <div className="min-h-screen flex items-center justify-center bg-snow dark:bg-[#121212]">
           <Loader2 className="w-8 h-8 text-dodger animate-spin" />
        </div>
     )
  }

  return (
    <div className="flex flex-col min-h-screen bg-snow dark:bg-[#121212] pt-8 pb-32">
      <div className="px-6 mb-8">
         <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight mb-2">My Children</h1>
         <p className="text-gray-500 text-sm font-medium">Swipe to view progress reports</p>
      </div>

      {children.length === 0 ? (
         <div className="px-6">
            <div className="bg-white dark:bg-[#1C1C1C] p-8 rounded-3xl text-center shadow-sm border border-gray-100 dark:border-gray-800">
               <p className="text-gray-500 font-bold">No children linked to this account yet.</p>
               <p className="text-xs text-gray-400 mt-2">Please contact the Usthad to link your phone number.</p>
            </div>
         </div>
      ) : (
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 px-6 scrollbar-hide">
          {children.map(child => (
            <div key={child.id} className="snap-center shrink-0 w-[85vw] max-w-sm">
              <ProgressCard 
                studentName={child.student_name} 
                className={child.class_name}
                department={child.department}
                report={child.progress_reports?.[0] || {}} 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
