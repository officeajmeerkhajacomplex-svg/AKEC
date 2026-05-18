import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Star, TrendingUp, Verified, UserCheck, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function UsthadProgressManager() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [reportId, setReportId] = useState<string | null>(null);
  const [studentName, setStudentName] = useState("Student");
  const [department, setDepartment] = useState("Madrassa");
  
  const [progress, setProgress] = useState({
    attendance_present: 0,
    attendance_absent: 0,
    class_performance: "Good",
    hifz_juz_completed: 0,
    exam_mark: 0,
    exam_total: 100,
    remarks: ""
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchProgress = async () => {
      if (!studentId) return;

      const { data: studentData } = await supabase
        .from('students')
        .select('student_name, department')
        .eq('id', studentId)
        .single();
        
      if (studentData) {
        setStudentName(studentData.student_name);
        setDepartment(studentData.department?.toUpperCase() || "MADRASSA");
      }

      const { data } = await supabase
        .from('progress_reports')
        .select('*')
        .eq('student_id', studentId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();
        
      if (data) {
        setReportId(data.id);
        
        let details = {
          attendance_present: 0,
          attendance_absent: 0,
          class_performance: "Good",
          hifz_juz_completed: 0,
          exam_mark: data.exam_score || 0,
          exam_total: 100,
          remarks: ""
        };

        if (data.remarks) {
          try {
            const parsed = JSON.parse(data.remarks);
            details = { ...details, ...parsed };
          } catch (e) {
            // It's just a text remark from old version
            details.remarks = data.remarks;
          }
        }
        
        // Also capture exam_score directly from DB if available, as a fallback
        if (!details.exam_mark && data.exam_score) {
            details.exam_mark = data.exam_score;
        }

        setProgress(details);
      }
    };
    fetchProgress();
  }, [studentId]);

  const handleSave = async () => {
    setIsSaving(true);
    
    // We store the rich data inside the text 'remarks' column to avoid DB schema mismatches
    const payload: any = {
      student_id: studentId,
      exam_score: progress.exam_mark,
      remarks: JSON.stringify(progress),
      updated_at: new Date().toISOString()
    };
    
    if (reportId) {
      payload.id = reportId;
    }

    const { error } = await supabase
      .from('progress_reports')
      .upsert(payload);

    setIsSaving(false);
    if (error) {
      console.error(error);
      setErrorMsg(error.message || "Failed to save progress");
      return;
    }

    navigate(department === "MADRASSA" || department === "HIFZ" || department === "DARS" ? '/students' : '/');
  };

  return (
    <div className="min-h-screen bg-snow dark:bg-[#121212] pt-8 pb-32 px-6">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center text-gray-500 hover:text-gray-900 dark:hover:text-white font-bold text-sm transition-colors">
        <ArrowLeft className="w-5 h-5 mr-2" /> Back
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight leading-tight">Update Progress</h1>
        <p className="text-gray-500 font-medium mt-1 flex items-center gap-1.5">
          <Verified className="w-4 h-4 text-dodger" /> For {studentName}
          <span className="bg-dodger/10 text-dodger text-[10px] uppercase font-black px-2 py-0.5 rounded-full ml-1">
            {department}
          </span>
        </p>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl text-sm font-semibold mb-6">
          {errorMsg}
        </div>
      )}
      
      <div className="space-y-6">
        
        {/* HIFZ SPECIFIC */}
        {department === 'HIFZ' && (
          <div className="bg-white dark:bg-[#1C1C1C] p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-[0.03] dark:opacity-10 text-dodger">
               <Star className="w-24 h-24" />
            </div>
            <label className="flex items-center gap-2 text-xs font-black text-dodger uppercase tracking-widest mb-4">
              <Star className="w-4 h-4" /> Hifz Progress
            </label>
            <div className="flex items-center gap-3">
              <input 
                type="number" 
                value={progress.hifz_juz_completed || ''}
                onChange={e => setProgress({...progress, hifz_juz_completed: parseInt(e.target.value) || 0})}
                className="w-24 h-16 bg-dodger/5 text-dodger font-black text-2xl border-none rounded-2xl px-4 text-center focus:ring-2 focus:ring-dodger/30 outline-none transition-all"
                placeholder="0"
                max="30"
              />
              <span className="text-gray-400 font-bold text-lg">/ 30 Juz Completed</span>
            </div>
          </div>
        )}

        {/* ALL DEPARTMENTS: Attendance */}
        <div className="bg-white dark:bg-[#1C1C1C] p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-[0.03] dark:opacity-10 text-emerald-500">
             <Calendar className="w-24 h-24" />
          </div>
          <label className="flex items-center gap-2 text-xs font-black text-emerald-500 uppercase tracking-widest mb-4">
            <Calendar className="w-4 h-4" /> Attendance
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Present Days</label>
              <input 
                type="number" 
                value={progress.attendance_present || ''}
                onChange={e => setProgress({...progress, attendance_present: parseInt(e.target.value) || 0})}
                className="w-full h-14 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl px-4 text-2xl font-black focus:ring-2 focus:ring-emerald-500/30 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Absent Days</label>
              <input 
                type="number" 
                value={progress.attendance_absent || ''}
                onChange={e => setProgress({...progress, attendance_absent: parseInt(e.target.value) || 0})}
                className="w-full h-14 bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20 rounded-2xl px-4 text-2xl font-black focus:ring-2 focus:ring-rose-500/30 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* ALL DEPARTMENTS: Class Performance */}
        <div className="bg-white dark:bg-[#1C1C1C] p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-[0.03] dark:opacity-10 text-amber-500">
             <UserCheck className="w-24 h-24" />
          </div>
          <label className="flex items-center gap-2 text-xs font-black text-amber-500 uppercase tracking-widest mb-4">
            <UserCheck className="w-4 h-4" /> Class Performance
          </label>
          <div className="grid grid-cols-2 gap-3">
             {["Excellent", "Good", "Average", "Needs Improvement"].map(status => (
                <button
                  key={status}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setProgress({ ...progress, class_performance: status });
                  }}
                  className={`py-3 px-3 rounded-2xl text-[11px] font-bold uppercase transition-all flex justify-center items-center ${
                    (progress.class_performance || "").toLowerCase() === status.toLowerCase() 
                      ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 scale-[1.02]' 
                      : 'bg-gray-50 text-gray-400 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'
                  }`}
                >
                  {status}
                </button>
             ))}
          </div>
        </div>

        {/* DARS SPECIFIC */}
        {department === 'DARS' && (
          <div className="bg-white dark:bg-[#1C1C1C] p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-[0.03] dark:opacity-10 text-purple-500">
               <TrendingUp className="w-24 h-24" />
            </div>
            <label className="flex items-center gap-2 text-xs font-black text-purple-500 uppercase tracking-widest mb-4">
              <TrendingUp className="w-4 h-4" /> Exam Mark
            </label>
            <div className="flex items-center gap-3">
              <input 
                type="number" 
                value={progress.exam_mark || ''}
                onChange={e => setProgress({...progress, exam_mark: parseInt(e.target.value) || 0})}
                className="w-24 h-16 bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 font-black text-2xl border-none rounded-2xl px-4 text-center focus:ring-2 focus:ring-purple-500/30 outline-none transition-all"
                placeholder="0"
              />
              <span className="text-gray-300 text-3xl font-light">/</span>
              <input 
                type="number" 
                value={progress.exam_total || ''}
                onChange={e => setProgress({...progress, exam_total: parseInt(e.target.value) || 100})}
                className="w-24 h-16 bg-gray-50 text-gray-500 dark:bg-gray-800 font-bold text-xl border-none rounded-2xl px-4 text-center focus:ring-2 focus:ring-gray-300 outline-none transition-all"
                placeholder="100"
              />
            </div>
          </div>
        )}

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={isSaving}
          className="w-full h-14 mt-4 bg-dodger text-snow rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-xl shadow-dodger/30 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <Save className="w-6 h-6" /> {isSaving ? 'Saving...' : 'Publish Update'}
        </motion.button>
      </div>
    </div>
  );
}
