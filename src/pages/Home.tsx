import { useState, useEffect } from "react";
import { Search, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/src/lib/utils";
import { motion } from "framer-motion";
import { supabase } from "@/src/lib/supabase";

export default function Home() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "RECEIVED">("ALL");
  
  const [students, setStudents] = useState<any[]>([]);
  const [englishDate, setEnglishDate] = useState("");

  const fetchStudents = async () => {
    const { data: studentsData, error } = await supabase
      .from('students')
      .select(`
        *,
        ledger_entries(amount, type)
      `);
      
    if (studentsData) {
      const formatted = studentsData.map(s => {
        let totalPending = 0;
        let totalPaid = 0;
        
        // Ensure sorted by date to calculate running balance correctly if needed
        // but here we just need totals similar to original logic
        s.ledger_entries?.forEach((tx: any) => {
          if (tx.type === 'DUE' || tx.type === 'given') {
            totalPending += Number(tx.amount);
          } else if (tx.type === 'PAID' || tx.type === 'received') {
            totalPaid += Number(tx.amount);
            if (totalPending > 0) {
              if (Number(tx.amount) >= totalPending) {
                totalPending = 0;
              } else {
                totalPending -= Number(tx.amount);
              }
            }
          }
        });
        
        return {
          id: s.id,
          name: s.student_name,
          className: s.class_name,
          department: s.department,
          phone: s.parent_phone,
          totalPending,
          totalPaid
        };
      });
      setStudents(formatted);
    }
  };

  useEffect(() => {
    const now = new Date();
    const engFormatter = new Intl.DateTimeFormat('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      weekday: 'long'
    });
    setEnglishDate(engFormatter.format(now));

    fetchStudents();
  }, []);

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
                  AKEC APP
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
    </div>
  );
}
