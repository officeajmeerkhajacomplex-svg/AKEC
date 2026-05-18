import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { User, Award, BookOpen, Star, TrendingUp, Calendar, UserCheck } from 'lucide-react';

interface ProgressReport {
  exam_score?: number;
  remarks?: string;
  memorization_progress?: string;
}

interface ProgressCardProps {
  studentName: string;
  className?: string;
  department?: string;
  report: ProgressReport;
}

export function ProgressCard({ studentName, className, department, report }: ProgressCardProps) {
  const dept = department?.toUpperCase() || 'MADRASSA';

  const details = useMemo(() => {
    let parsed = {
      attendance_present: 0,
      attendance_absent: 0,
      class_performance: "Good",
      hifz_juz_completed: 0,
      exam_mark: report.exam_score || 0,
      exam_total: 100,
      text_remarks: report.remarks || ''
    };

    if (report.remarks) {
      try {
        const json = JSON.parse(report.remarks);
        parsed = { ...parsed, ...json };
      } catch (e) {
        parsed.text_remarks = report.remarks;
      }
    }
    
    return parsed;
  }, [report]);

  const hifzPercent = Math.min(100, Math.max(0, (details.hifz_juz_completed / 30) * 100));
  const examPercent = Math.min(100, Math.max(0, (details.exam_mark / (details.exam_total || 100)) * 100));
  
  const totalAttendance = details.attendance_present + details.attendance_absent;
  const attendancePercent = totalAttendance > 0 
    ? Math.round((details.attendance_present / totalAttendance) * 100) 
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#1C1C1C] rounded-[2rem] shadow-xl shadow-dodger/5 border border-dodger/10 dark:border-gray-800 overflow-hidden relative"
    >
      <div className="h-24 bg-gradient-to-r from-dodger/90 to-sky-400 opacity-90 relative">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-20 mix-blend-overlay"></div>
      </div>
      
      <div className="px-6 relative pb-6">
        <div className="flex items-end justify-between -mt-10 mb-4">
          <div className="w-20 h-20 bg-snow dark:bg-gray-800 rounded-full border-4 border-white dark:border-[#1C1C1C] flex items-center justify-center shadow-md">
            <User className="w-8 h-8 text-dodger" />
          </div>
          <div className="bg-dodger/10 text-dodger px-3 py-1 rounded-full text-xs font-bold ring-1 ring-dodger/20 flex items-center gap-1.5 mb-1">
             <Award className="w-3.5 h-3.5" />
             {department || 'Student'}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight leading-none mb-1">{studentName}</h2>
          <p className="text-sm font-semibold text-gray-500 flex items-center gap-1.5">
             <BookOpen className="w-4 h-4" /> {className || 'Class not assigned'}
          </p>
        </div>
      </div>

      <div className="px-6 pb-8 space-y-6">
        
        {/* HIFZ SPECIFIC */}
        {dept === 'HIFZ' && (
          <div className="bg-dodger/5 dark:bg-gray-800/50 p-5 rounded-3xl border border-dodger/10 dark:border-gray-700">
            <div className="flex justify-between items-end mb-3">
              <p className="text-[11px] font-black text-dodger uppercase tracking-widest flex items-center gap-1.5">
                <Star className="w-4 h-4" /> Hifz Progress
              </p>
              <div className="text-right">
                 <span className="text-2xl font-black text-dodger">{details.hifz_juz_completed}</span>
                 <span className="text-xs text-gray-400 font-bold ml-1">/ 30 Juz</span>
              </div>
            </div>
            <div className="w-full bg-white dark:bg-gray-900 h-3 rounded-full overflow-hidden shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${hifzPercent}%` }} 
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-dodger h-full rounded-full"
              />
            </div>
          </div>
        )}

        {/* DARS SPECIFIC: EXAM MARK */}
        {dept === 'DARS' && (
           <div className="bg-purple-50 dark:bg-purple-500/10 p-5 rounded-3xl border border-purple-100 dark:border-purple-500/20">
             <div className="flex justify-between items-center">
               <div className="flex gap-4 items-center">
                 <div className="w-12 h-12 bg-white dark:bg-[#1C1C1C] rounded-2xl flex items-center justify-center shadow-sm text-purple-500">
                   <TrendingUp className="w-6 h-6" />
                 </div>
                 <div>
                   <p className="text-[10px] font-black text-purple-500/70 uppercase tracking-widest mb-0.5">Exam Result</p>
                   <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Total Score</p>
                 </div>
               </div>
               <div className="text-right">
                 <p className="text-3xl font-black text-purple-600 dark:text-purple-400 leading-none">
                    {details.exam_mark}
                 </p>
                 <p className="text-[11px] font-bold text-gray-400 mt-1">out of {details.exam_total || 100}</p>
               </div>
             </div>
             <div className="w-full bg-white dark:bg-gray-900 h-2 rounded-full overflow-hidden mt-4 shadow-inner">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${examPercent}%` }} 
                 transition={{ duration: 1, ease: "easeOut" }}
                 className="bg-purple-500 h-full rounded-full"
               />
             </div>
           </div>
        )}

        {/* ALL DEPARTMENTS: ATTENDANCE & PERFORMANCE */}
        <div className="grid grid-cols-2 gap-4">
          
          <div className="border border-gray-100 dark:border-gray-800 p-4 rounded-3xl bg-white dark:bg-gray-900/50 flex flex-col items-center text-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${attendancePercent >= 75 ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
              <Calendar className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
              {attendancePercent}%
            </p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">Attendance</p>
            <div className="w-full flex justify-between text-[10px] font-semibold text-gray-400 mt-3 border-t border-gray-100 dark:border-gray-800 pt-2">
               <span><span className="text-emerald-500">{details.attendance_present}</span> P</span>
               <span><span className="text-rose-500">{details.attendance_absent}</span> A</span>
            </div>
          </div>

          <div className="border border-gray-100 dark:border-gray-800 p-4 rounded-3xl bg-white dark:bg-gray-900/50 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 bg-amber-50 dark:bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mb-2">
              <UserCheck className="w-5 h-5" />
            </div>
            <p className={`text-sm font-black mt-1 capitalize ${
              (details.class_performance || "").toLowerCase() === 'excellent' ? 'text-amber-500' :
              (details.class_performance || "").toLowerCase() === 'needs improvement' ? 'text-rose-500' :
              'text-dodger'
            }`}>
              {details.class_performance}
            </p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1 mb-2">Performance</p>
          </div>

        </div>

      </div>
    </motion.div>
  );
}
