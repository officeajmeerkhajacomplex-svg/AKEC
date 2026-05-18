import { useState, useEffect, FormEvent } from "react";
import { Search, UserPlus, X, Trash2, AlertTriangle, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/src/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/src/lib/supabase";

export default function UsthadStudents() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"ALL" | "HIFZ" | "MADRASSA" | "DARS">("ALL");
  
  const [students, setStudents] = useState<any[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: "", className: "", phone: "", parentName: "", department: "Madrassa" });
  const [errorMsg, setErrorMsg] = useState("");
  const [studentToDelete, setStudentToDelete] = useState<any | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

  const fetchStudents = async () => {
    const { data: studentsData } = await supabase
      .from('students')
      .select('*')
      .order('student_name', { ascending: true });
      
    if (studentsData) {
      setStudents(studentsData);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddStudent = async (e: FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.className || !newStudent.parentName) return;

    let parentId = null;
    let formattedPhone = newStudent.phone ? (newStudent.phone.startsWith('+') ? newStudent.phone : `+91${newStudent.phone}`) : "";
    
    if (formattedPhone) {
      let { data: existingParent, error: selectError } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone_number', formattedPhone)
        .maybeSingle();
        
      if (!existingParent) {
        const { data: newParent, error: insertParentError } = await supabase
          .from('profiles')
          .insert([{ phone_number: formattedPhone, name: newStudent.parentName, role: 'parent', department: newStudent.department }])
          .select()
          .single();
        if (insertParentError) {
          setErrorMsg("Failed to create parent profile. If you see an RLS error, please go to your Supabase SQL Editor and run: 'alter table profiles disable row level security;'");
          return;
        }
        if (newParent) parentId = newParent.id;
      } else {
        parentId = existingParent.id;
      }
    }

    const { error } = await supabase.from('students').insert([{
      student_name: newStudent.name,
      class_name: newStudent.className,
      department: newStudent.department,
      parent_phone: formattedPhone,
      parent_id: parentId
    }]);

    if (!error) {
      await fetchStudents();
      setIsAddOpen(false);
      setNewStudent({ name: "", className: "", phone: "", parentName: "", department: "Madrassa" });
      setErrorMsg("");
    } else {
      setErrorMsg(error.message || "Failed to save student");
    }
  };

  const startPress = (student: any) => {
    const timer = setTimeout(() => {
        setStudentToDelete(student);
    }, 700);
    setLongPressTimer(timer);
  };

  const endPress = () => {
    if (longPressTimer) {
        clearTimeout(longPressTimer);
        setLongPressTimer(null);
    }
  };

  const handleDeleteStudent = async () => {
    if (!studentToDelete) return;
    await supabase.from('ledger_entries').delete().eq('student_id', studentToDelete.id);
    await supabase.from('progress_reports').delete().eq('student_id', studentToDelete.id);
    await supabase.from('students').delete().eq('id', studentToDelete.id);
    await fetchStudents();
    setStudentToDelete(null);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.student_name?.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesFilter = true;
    if (filter !== "ALL") {
      matchesFilter = student.department?.toUpperCase() === filter;
    }
    return matchesSearch && matchesFilter;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col min-h-full pb-20 bg-snow dark:bg-[#121212]">
      {/* Header Area */}
      <div className="relative isolate">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="bg-header-bg text-header-text pt-12 pb-14 px-6 relative z-10 rounded-b-[4rem] shadow-xl overflow-hidden border-b border-gray-100 dark:border-gray-800"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-dodger/5 to-transparent opacity-60"></div>
          <div className="absolute top-1/2 left-0 w-40 h-40 bg-dodger/5 rounded-full blur-2xl -translate-x-1/2"></div>
          <div className="flex justify-between items-center relative z-30">
            <div className="flex flex-col">
              <motion.h1 
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="text-2xl font-black tracking-tighter text-header-text leading-none drop-shadow-sm mb-1"
              >
                Students & Progress
              </motion.h1>
              <motion.p 
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider drop-shadow-sm"
              >
                Manage records
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content List */}
      <div className="px-6 mt-8 z-0">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 mb-6">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-dodger transition-colors" />
            <input 
              type="text" 
              placeholder="Search student Name..."
              className="w-full bg-white dark:bg-[#1C1C1C] border border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-4 focus:ring-dodger/5 focus:border-dodger/50 outline-none placeholder:text-gray-300 font-semibold dark:text-gray-100 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 mb-6 overflow-x-auto pb-1 scrollbar-hide no-scrollbar">
            {["ALL", "HIFZ", "MADRASSA", "DARS"].map((f) => (
              <button 
                key={f}
                onClick={() => setFilter(f as any)}
                className={cn(
                    "whitespace-nowrap px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border",
                    filter === f ? "bg-dodger text-white border-transparent shadow-lg shadow-dodger/30" : "bg-white dark:bg-[#1C1C1C] text-gray-400 border-gray-100 dark:border-gray-800"
                )}
              >
                  {f === "ALL" ? "All" : f}
              </button>
            ))}
        </motion.div>

        {/* Student List */}
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-3 pb-8">
          {filteredStudents.map(student => (
            <motion.div 
              variants={itemVariants}
              key={student.id}
              onClick={() => navigate(`/progress/${student.id}`)}
              onPointerDown={() => startPress(student)}
              onPointerUp={endPress}
              onPointerLeave={endPress}
              whileTap={{ scale: 0.98 }}
              className="bg-white dark:bg-[#1C1C1C] p-4 rounded-2xl shadow-sm border border-gray-100/80 dark:border-gray-800 flex justify-between items-center transition-all cursor-pointer hover:shadow-md select-none touch-none"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-sky/10 flex justify-center items-center text-dodger font-bold text-sm border border-sky/20 shrink-0">
                   {student.student_name?.substring(0, 2).toUpperCase() || 'ST'}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-snow text-[15px] leading-tight line-clamp-1">{student.student_name}</h3>
                  <p className="text-[11px] text-gray-500 font-medium mt-0.5">{student.class_name} • {student.department}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="w-8 h-8 rounded-full bg-dodger/10 flex items-center justify-center text-dodger">
                    <BookOpen className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsAddOpen(true)}
        className="fixed bottom-28 right-5 w-14 h-14 bg-dodger text-snow rounded-full flex justify-center items-center shadow-xl shadow-dodger/40 z-20 border-2 border-white/20 backdrop-blur-md"
      >
        <UserPlus className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-0">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
            onClick={() => setIsAddOpen(false)} 
          />
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-snow dark:bg-[#1C1C1C] w-full max-w-sm rounded-t-[2rem] sm:rounded-3xl p-7 px-6 pb-8 shadow-2xl border-t border-white/20 dark:border-gray-800 h-[80vh] overflow-y-auto no-scrollbar"
          >
            <div className="flex justify-between items-center mb-7">
              <h2 className="text-xl font-bold text-gray-900 dark:text-snow tracking-tight">Add New Student</h2>
              <button onClick={() => setIsAddOpen(false)} className="p-2 -mr-2 text-gray-400 hover:text-gray-900 bg-gray-50 dark:bg-gray-800 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl text-[11px] font-semibold mb-4 mx-1">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleAddStudent} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Student Name</label>
                <input required type="text" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} className="w-full mt-1.5 h-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 text-gray-900 dark:text-snow focus:ring-2 focus:ring-dodger/20 outline-none font-semibold shadow-sm" placeholder="Enter full name" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Parent Name</label>
                <input required type="text" value={newStudent.parentName} onChange={e => setNewStudent({...newStudent, parentName: e.target.value})} className="w-full mt-1.5 h-12 bg-white border border-gray-200 rounded-xl px-4 text-gray-900 focus:ring-2 focus:ring-dodger/20 outline-none font-semibold shadow-sm" placeholder="Enter parent name" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Class / Dars Name</label>
                <input required type="text" value={newStudent.className} onChange={e => setNewStudent({...newStudent, className: e.target.value})} className="w-full mt-1.5 h-12 bg-white border border-gray-200 rounded-xl px-4 text-gray-900 focus:ring-2 focus:ring-dodger/20 outline-none font-semibold shadow-sm" placeholder="e.g. Year 1" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Department</label>
                <select required value={newStudent.department} onChange={e => setNewStudent({...newStudent, department: e.target.value})} className="w-full mt-1.5 h-12 bg-white border border-gray-200 rounded-xl px-4 text-gray-900 focus:ring-2 focus:ring-dodger/20 outline-none font-semibold shadow-sm appearance-none">
                  <option value="Hifz">Hifz</option>
                  <option value="Madrassa">Madrassa</option>
                  <option value="Dars">Dars</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Student/Parent Phone Number</label>
                <input type="tel" value={newStudent.phone} onChange={e => setNewStudent({...newStudent, phone: e.target.value})} className="w-full mt-1.5 h-12 bg-white border border-gray-200 rounded-xl px-4 text-gray-900 focus:ring-2 focus:ring-dodger/20 outline-none font-semibold shadow-sm" placeholder="Phone number for login" />
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full h-14 mt-6 bg-dodger text-snow rounded-xl font-bold uppercase tracking-wide transition-all shadow-lg shadow-dodger/30">
                Save Student
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
      </AnimatePresence>

      <AnimatePresence>
      {studentToDelete && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0" onClick={() => setStudentToDelete(null)} />
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-snow dark:bg-[#1C1C1C] max-w-sm w-full rounded-[2.5rem] p-8 relative z-[110] shadow-2xl border border-white/20 dark:border-gray-800 text-center">
                  <motion.div initial={{ rotate: -15, scale: 0.5 }} animate={{ rotate: 0, scale: 1 }} className="w-16 h-16 bg-rose-50 dark:bg-rose-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <AlertTriangle className="w-8 h-8 text-rose-500" />
                  </motion.div>
                  <h3 className="text-xl font-black text-gray-800 dark:text-snow mb-2">Remove Student?</h3>
                  <p className="text-sm text-gray-400 mb-8 px-4 leading-relaxed font-bold">This will delete {studentToDelete.student_name} and all history.</p>
                  <div className="flex flex-col gap-3">
                      <motion.button whileTap={{ scale: 0.95 }} onClick={handleDeleteStudent} className="w-full py-4.5 rounded-2xl bg-rose-500 text-snow font-black text-[11px] uppercase tracking-widest transition-all">Delete Student</motion.button>
                      <motion.button whileTap={{ scale: 0.95 }} onClick={() => setStudentToDelete(null)} className="w-full py-4.5 rounded-2xl bg-gray-50 text-gray-400 font-black text-[11px] uppercase tracking-widest transition-all">Cancel</motion.button>
                  </div>
              </motion.div>
          </div>
      )}
      </AnimatePresence>
    </div>
  );
}
