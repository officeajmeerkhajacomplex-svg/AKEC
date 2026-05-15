import { useState, useEffect, FormEvent } from "react";
import { Search, UserPlus, FileText, X, Trash2, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/src/lib/utils";
import { Student } from "@/src/lib/types";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "RECEIVED">("ALL");
  
  const [students, setStudents] = useState<Student[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: "", className: "", phone: "" });
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [englishDate, setEnglishDate] = useState("");

  useEffect(() => {
    const now = new Date();
    
    // Formatting English Date
    const engFormatter = new Intl.DateTimeFormat('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      weekday: 'long'
    });
    setEnglishDate(engFormatter.format(now));

    const saved = localStorage.getItem('akec_students');
    if (saved) {
      setStudents(JSON.parse(saved));
    }

    // Optional: Request geolocation to satisfy user request for geolocation usage
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(() => {}, () => {});
    }
  }, []);

  const handleAddStudent = (e: FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.className) return;

    const student: Student = {
      id: crypto.randomUUID(),
      name: newStudent.name,
      className: newStudent.className,
      phone: newStudent.phone,
      totalPending: 0,
      totalPaid: 0,
    };

    const updated = [...students, student];
    setStudents(updated);
    localStorage.setItem('akec_students', JSON.stringify(updated));
    setIsAddOpen(false);
    setNewStudent({ name: "", className: "", phone: "" });
  };

  const startPress = (student: Student) => {
    const timer = setTimeout(() => {
        setStudentToDelete(student);
    }, 700); // 700ms hold
    setLongPressTimer(timer);
  };

  const endPress = () => {
    if (longPressTimer) {
        clearTimeout(longPressTimer);
        setLongPressTimer(null);
    }
  };

  const handleDeleteStudent = () => {
    if (!studentToDelete) return;
    
    // Remove student
    const updated = students.filter(s => s.id !== studentToDelete.id);
    setStudents(updated);
    localStorage.setItem('akec_students', JSON.stringify(updated));

    // Remove transactions for this student
    const allTxsStr = localStorage.getItem('akec_transactions');
    if (allTxsStr) {
      const allTxs = JSON.parse(allTxsStr);
      delete allTxs[studentToDelete.id];
      localStorage.setItem('akec_transactions', JSON.stringify(allTxs));
    }

    setStudentToDelete(null);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesFilter = true;
    if (filter === "PENDING") {
      matchesFilter = student.totalPending > 0;
    } else if (filter === "RECEIVED") {
      matchesFilter = student.totalPaid > 0 && student.totalPending === 0;
    }
    return matchesSearch && matchesFilter;
  });

  const totalPending = students.reduce((acc, curr) => acc + curr.totalPending, 0);
  const totalReceived = students.reduce((acc, curr) => acc + curr.totalPaid, 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
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
          className="bg-header-bg text-header-text pt-12 pb-32 px-6 relative z-10 rounded-b-[4rem] shadow-xl overflow-hidden border-b border-gray-100 dark:border-gray-800"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-dodger/5 to-transparent opacity-60"></div>
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-dodger/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-0 w-40 h-40 bg-dodger/5 rounded-full blur-2xl -translate-x-1/2"></div>
          
          <div className="flex justify-between items-center mb-6 relative z-30">
            <div className="flex items-center gap-3">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/40 dark:bg-white/10 p-1.5 rounded-2xl backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-center overflow-hidden w-12 h-12"
              >
                <img 
                  src="https://github.com/officeajmeerkhajacomplex-svg/akec-dsm/blob/main/logo.png?raw=true" 
                  alt="AKEC Logo" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              <div className="flex flex-col">
                <motion.h1 
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl font-black tracking-tighter text-header-text leading-none drop-shadow-sm mb-0.5"
                >
                  AKEC LEDGER
                </motion.h1>
                <motion.p 
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider drop-shadow-sm"
                >
                  {englishDate}
                </motion.p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Cards (Summary) */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute -bottom-8 left-6 right-6 bg-white dark:bg-[#1C1C1C] rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(30,144,255,0.3)] dark:shadow-none p-5 flex justify-between items-center border border-white dark:border-gray-800 z-20"
        >
            <div className="text-center flex-1 border-r border-gray-100 dark:border-gray-800 pr-3">
                <p className="text-[8px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1.5 px-1 truncate">Total Pending</p>
                <div className="relative inline-block">
                    <motion.p 
                      key={totalPending}
                      initial={{ scale: 1.1, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-2xl font-black text-rose-500 tracking-tighter"
                    >
                      ₹{totalPending.toLocaleString('en-IN')}
                    </motion.p>
                    <div className="absolute -bottom-1 left-0 w-full h-1 bg-rose-500/10 rounded-full"></div>
                </div>
            </div>
            <div className="text-center flex-1 pl-3">
                <p className="text-[8px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1.5 px-1 truncate">Total Got</p>
                <div className="relative inline-block">
                    <motion.p 
                      key={totalReceived}
                      initial={{ scale: 1.1, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-2xl font-black text-emerald-500 tracking-tighter"
                    >
                      ₹{totalReceived.toLocaleString('en-IN')}
                    </motion.p>
                    <div className="absolute -bottom-1 right-0 w-full h-1 bg-emerald-500/10 rounded-full"></div>
                </div>
            </div>
        </motion.div>
      </div>

      {/* Main Content List */}
      <div className="px-6 mt-32 z-0">
        {/* Search & Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex gap-2 mb-6"
        >
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-dodger transition-colors" />
            <input 
              type="text" 
              placeholder="Search student Name..."
              className="w-full bg-snow dark:bg-[#1C1C1C] border border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-4 focus:ring-dodger/5 focus:border-dodger/50 outline-none placeholder:text-gray-300 font-semibold dark:text-gray-100 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex gap-3 mb-6 overflow-x-auto pb-1 scrollbar-hide no-scrollbar"
        >
            {["ALL", "PENDING", "RECEIVED"].map((f) => (
              <button 
                key={f}
                onClick={() => setFilter(f as any)}
                className={cn(
                    "whitespace-nowrap px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border",
                    filter === f ? (
                      f === "ALL" ? "bg-dodger text-snow border-transparent shadow-lg shadow-dodger/30" :
                      f === "PENDING" ? "bg-rose-500 text-snow border-transparent shadow-lg shadow-rose-500/30" :
                      "bg-emerald-500 text-snow border-transparent shadow-lg shadow-emerald-500/30"
                    ) : "bg-snow dark:bg-[#1C1C1C] text-gray-400 border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                )}
              >
                  {f === "ALL" ? "All Students" : f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
        </motion.div>

        {/* List Headings */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex justify-between items-center text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] px-3 mb-4 mt-6"
        >
            <span>Student & Class</span>
            <span className="text-right">Amount (₹)</span>
        </motion.div>

        {/* Student List */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-3 pb-8"
        >
          {filteredStudents.map(student => (
            <motion.div 
              variants={itemVariants}
              key={student.id}
              onClick={() => navigate(`/student/${student.id}`)}
              onPointerDown={() => startPress(student)}
              onPointerUp={endPress}
              onPointerLeave={endPress}
              whileTap={{ scale: 0.98 }}
              className="bg-snow dark:bg-[#1C1C1C] p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100/80 dark:border-gray-800 flex justify-between items-center transition-all cursor-pointer hover:shadow-md dark:hover:bg-gray-800/20 select-none touch-none"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-sky/10 dark:bg-sky-500/10 flex justify-center items-center text-dodger dark:text-sky-400 font-bold text-sm border border-sky/20 dark:border-sky-500/20 shrink-0 shadow-inner">
                   {student.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-snow text-[15px] leading-tight line-clamp-1">{student.name}</h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-0.5">{student.className}</p>
                </div>
              </div>

              <div className="text-right shrink-0 ml-2">
                {student.totalPending > 0 ? (
                  <>
                    <p className="text-[15px] font-black text-rose-500 tracking-tight">₹{student.totalPending.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5 uppercase">Pending Due</p>
                  </>
                ) : student.totalPaid > 0 ? (
                  <>
                     <p className="text-[15px] font-black text-emerald-500 tracking-tight">₹{student.totalPaid.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5 uppercase">Adv/Paid</p>
                  </>
                ) : (
                  <>
                     <p className="text-[15px] font-black text-gray-400 tracking-tight">₹0</p>
                    <p className="text-[10px] text-gray-300 font-semibold mt-0.5 uppercase">Clear</p>
                  </>
                )}
              </div>
            </motion.div>
          ))}
          {filteredStudents.length === 0 && (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="text-center py-24 text-gray-400 flex flex-col items-center"
             >
                <div className="bg-white/50 p-6 rounded-full mb-5 shadow-inner border border-gray-100">
                    <Search className="w-8 h-8 text-gray-200" />
                </div>
                <p className="font-black text-[13px] text-gray-400 uppercase tracking-[0.2em]">No students found</p>
                <p className="text-[11px] mt-2 font-bold text-gray-300">Try another search term</p>
             </motion.div>
          )}
        </motion.div>
      </div>

      {/* Floating Action Button */}
      <motion.button 
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsAddOpen(true)}
        className="fixed bottom-28 right-5 w-14 h-14 bg-dodger text-snow rounded-full flex justify-center items-center shadow-xl shadow-dodger/40 z-20 border-2 border-white/20 backdrop-blur-md"
      >
        <UserPlus className="w-6 h-6" />
      </motion.button>

      {/* Add Student Bottom Sheet */}
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
            className="relative bg-snow dark:bg-[#1C1C1C] w-full max-w-sm rounded-t-[2rem] sm:rounded-3xl p-7 px-6 pb-8 shadow-2xl border-t border-white/20 dark:border-gray-800"
          >
            <div className="flex justify-between items-center mb-7">
              <h2 className="text-xl font-bold text-gray-900 dark:text-snow tracking-tight">Add New Student</h2>
              <button onClick={() => setIsAddOpen(false)} className="p-2 -mr-2 text-gray-400 hover:text-gray-900 dark:hover:text-snow bg-gray-50 dark:bg-gray-800 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Student Name</label>
                <input 
                  required
                  type="text" 
                  value={newStudent.name}
                  onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                  className="w-full mt-1.5 h-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 text-gray-900 dark:text-snow focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-dodger/20 focus:border-dodger transition-all outline-none font-semibold shadow-sm"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Class / Department</label>
                <input 
                  required
                  type="text" 
                  value={newStudent.className}
                  onChange={e => setNewStudent({...newStudent, className: e.target.value})}
                  className="w-full mt-1.5 h-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 text-gray-900 dark:text-snow focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-dodger/20 focus:border-dodger transition-all outline-none font-semibold shadow-sm"
                  placeholder="e.g. 5th Standard, Hifz"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Guardian Phone (Optional)</label>
                <input 
                  type="tel" 
                  value={newStudent.phone}
                  onChange={e => setNewStudent({...newStudent, phone: e.target.value})}
                  className="w-full mt-1.5 h-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 text-gray-900 dark:text-snow focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-dodger/20 focus:border-dodger transition-all outline-none font-semibold shadow-sm"
                  placeholder="Parent's number"
                />
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full h-14 mt-6 bg-dodger text-snow rounded-xl font-bold uppercase tracking-wide transition-all shadow-lg shadow-dodger/30"
              >
                Save Student
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
      </AnimatePresence>

      {/* Delete Confirmation Popup */}
      <AnimatePresence>
      {studentToDelete && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0" 
                onClick={() => setStudentToDelete(null)} 
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-snow dark:bg-[#1C1C1C] max-w-sm w-full rounded-[2.5rem] p-8 relative z-[110] shadow-2xl border border-white/20 dark:border-gray-800 text-center"
              >
                  <motion.div 
                    initial={{ rotate: -15, scale: 0.5 }}
                    animate={{ rotate: 0, scale: 1 }}
                    className="w-16 h-16 bg-rose-50 dark:bg-rose-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6"
                  >
                      <AlertTriangle className="w-8 h-8 text-rose-500" />
                  </motion.div>
                  <h3 className="text-xl font-black text-gray-800 dark:text-snow mb-2">Remove Student?</h3>
                  <p className="text-sm text-gray-400 dark:text-gray-400 mb-8 px-4 leading-relaxed font-bold">
                    This will delete <span className="text-gray-700 dark:text-gray-200">{studentToDelete.name}</span> and all their ledger history. This cannot be undone.
                  </p>
                  
                  <div className="flex flex-col gap-3">
                      <motion.button 
                          whileTap={{ scale: 0.95 }}
                          onClick={handleDeleteStudent}
                          className="w-full py-4.5 rounded-2xl bg-rose-500 text-snow font-black text-[11px] uppercase tracking-widest transition-all shadow-xl shadow-rose-500/20"
                      >
                          Delete Student
                      </motion.button>
                      <motion.button 
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setStudentToDelete(null)}
                          className="w-full py-4.5 rounded-2xl bg-gray-50 text-gray-400 font-black text-[11px] uppercase tracking-widest transition-all"
                      >
                          Cancel
                      </motion.button>
                  </div>
              </motion.div>
          </div>
      )}
      </AnimatePresence>
    </div>
  );
}
