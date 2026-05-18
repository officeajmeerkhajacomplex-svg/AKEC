import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, Download, MessageSquare, Home, FileText, Send, Share2, Trash2, AlertTriangle } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { format, parseISO } from "date-fns";
import { Transaction } from "@/src/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/src/lib/supabase";

export default function StudentLedger() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showTransactionSheet, setShowTransactionSheet] = useState<"DUE" | "PAID" | null>(null);
  const [showRemindSheet, setShowRemindSheet] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [txToDelete, setTxToDelete] = useState<any | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

  const [student, setStudent] = useState<any | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [txAmount, setTxAmount] = useState("");
  const [txNote, setTxNote] = useState("");

  const fetchData = async () => {
    if (!id) return;
    
    const { data: studentData } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single();

    if (studentData) {
      const { data: txsData } = await supabase
        .from('ledger_entries')
        .select('*')
        .eq('student_id', id)
        .order('date', { ascending: true }); // sort ascending to calculate running balance

      let totalPending = 0;
      let totalPaid = 0;
      const formattedTxs = (txsData || []).map(tx => {
        const amount = Number(tx.amount);
        if (tx.type === 'given' || tx.type === 'DUE') {
          totalPending += amount;
        } else if (tx.type === 'PAID' || tx.type === 'received') {
          totalPaid += amount;
          if (totalPending > 0) {
            if (amount >= totalPending) {
              totalPending = 0;
            } else {
              totalPending -= amount;
            }
          }
        }
        return {
          id: tx.id,
          amount,
          type: (tx.type === 'received' || tx.type === 'PAID') ? 'PAID' : 'DUE',
          note: tx.note,
          date: tx.date,
          runningBalance: totalPending
        };
      });

      setTransactions(formattedTxs);
      setStudent({
        id: studentData.id,
        name: studentData.student_name,
        className: studentData.class_name,
        phone: studentData.parent_phone,
        totalPending,
        totalPaid
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleAddTransaction = async () => {
    if (!student || !txAmount || isNaN(Number(txAmount)) || Number(txAmount) <= 0) return;
    
    const amount = Number(txAmount);
    let type = showTransactionSheet;
    if (!type) return;

    const dbType = type === 'PAID' ? 'received' : 'DUE'; // Match database constraint ('given', 'received') wait actually schema says: type in ('given', 'received')? No wait, schema says 'given', 'received', but previous code used 'DUE', 'PAID'. Let's use 'DUE' and 'received' maybe?
    // Let me check database.sql: type in ('given', 'received') oh the schema says 'given', 'received'! Wait! I'll fix that below.

    await supabase.from('ledger_entries').insert([{
      student_id: student.id,
      amount,
      type: type === 'DUE' ? 'given' : 'received', 
      note: txNote,
      date: new Date().toISOString().split('T')[0]
    }]);

    await fetchData();

    setTxAmount("");
    setTxNote("");
    setShowTransactionSheet(null);
  };

  const handleDeleteTransaction = async () => {
    if (!txToDelete || !student) return;
    await supabase.from('ledger_entries').delete().eq('id', txToDelete.id);
    await fetchData();
    setTxToDelete(null);
  };

  const handleClearHistory = async () => {
    if (!student) return;
    await supabase.from('ledger_entries').delete().eq('student_id', student.id);
    await fetchData();
    setShowClearConfirm(false);
  };

  const startPress = (tx: Transaction) => {
    const timer = setTimeout(() => {
        setTxToDelete(tx);
    }, 600); // 600ms hold
    setLongPressTimer(timer);
  };

  const endPress = () => {
    if (longPressTimer) {
        clearTimeout(longPressTimer);
        setLongPressTimer(null);
    }
  };

  const handleSendSMS = () => {
    if (!student?.phone || !student?.name) return;
    const message = `അസ്സലാമു അലൈക്കും 

ഇത് അജ്മീർ ഖാജാ എഡ്യൂക്കേഷണൽ കോംപ്ലക്സിൽ നിന്നുള്ള ഒരു ഓർമ്മപ്പെടുത്തലാണ് .

🎓 *വിദ്യാർത്ഥി:* ${student.name}
💰 *അടയ്ക്കാനുള്ള ബാക്കി തുക:* ₹${student.totalPending}

ദയവായി ഈ തുക എത്രയും വേഗം അടയ്ക്കാൻ ശ്രദ്ധിക്കുമല്ലോ .

ഇൻഷാ അല്ലാഹ് `;
    window.open(`sms:${student.phone}?body=${encodeURIComponent(message)}`, '_blank');
    setShowRemindSheet(false);
  };

  const handleSendWhatsApp = () => {
    if (!student?.phone || !student?.name) return;
    const message = `അസ്സലാമു അലൈക്കും 

ഇത് അജ്മീർ ഖാജാ എഡ്യൂക്കേഷണൽ കോംപ്ലക്സിൽ നിന്നുള്ള ഒരു ഓർമ്മപ്പെടുത്തലാണ് .

🎓 *വിദ്യാർത്ഥി:* ${student.name}
💰 *അടയ്ക്കാനുള്ള ബാക്കി തുക:* ₹${student.totalPending}

ദയവായി ഈ തുക എത്രയും വേഗം അടയ്ക്കാൻ ശ്രദ്ധിക്കുമല്ലോ .

ഇൻഷാ അല്ലാഹ് `;
    
    // Remove non-numeric characters from phone for WhatsApp
    const cleanPhone = student.phone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
    setShowRemindSheet(false);
  };

  const handleShareReceipt = () => {
    if (!student) return;
    const summary = `Ajmeer Khaja Educational Complex - Digital Ledger\nStudent: ${student.name}\nTotal Pending: ₹${student.totalPending}\nTotal Paid: ₹${student.totalPaid}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Student Fee Ledger',
        text: summary,
        url: window.location.href
      }).catch(console.error);
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(summary);
      alert('Ledger summary copied to clipboard');
    }
  };

  // Sort descending by date
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions]);

  if (!student) {
    return <div className="p-4 text-center text-gray-500 mt-20">Student not found. Add them from Home page.</div>;
  }

  // Calculate Net Balance (total pending)
  const isPending = student.totalPending > 0;

  return (
    <div className="flex flex-col min-h-screen bg-snow dark:bg-[#121212] relative">
      {/* Header Wrapper */}
      <div className="relative isolate">
        {/* Header */}
        <div className="bg-header-bg text-header-text pt-20 pb-44 px-6 relative z-10 rounded-b-[4.5rem] shadow-xl overflow-hidden border-b border-gray-100 dark:border-gray-800">
          <div className="absolute inset-0 bg-gradient-to-br from-dodger/5 to-transparent opacity-60"></div>
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-dodger/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-0 w-40 h-40 bg-dodger/5 rounded-full blur-2xl -translate-x-1/2"></div>
          
          <div className="flex justify-between items-center relative z-30">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/')} 
                className="p-3 bg-white/40 dark:bg-white/10 rounded-2xl active:scale-90 transition-all text-header-text hover:bg-white/50 backdrop-blur-md border border-white/20 shadow-lg"
              >
                <Home className="w-5 h-5" />
              </button>
              <div className="w-12 h-12 rounded-2xl bg-white/40 dark:bg-white/10 backdrop-blur-md text-header-text flex justify-center items-center font-black text-xl shadow-inner border border-white/20">
                  {student.name.substring(0, 1).toUpperCase()}
              </div>
              <div className="max-w-[140px] sm:max-w-xs">
                <h1 className="text-xl font-black tracking-tight text-header-text leading-tight drop-shadow-sm truncate">{student.name}</h1>
                <p className="text-[9px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-[0.3em] font-mono">{student.className}</p>
              </div>
            </div>
            {student.phone && (
                <a href={`tel:${student.phone}`} className="p-3 bg-white/40 dark:bg-white/10 rounded-2xl hover:bg-white/50 transition-all active:scale-95 backdrop-blur-md shadow-lg border border-white/20">
                    <Phone className="w-5 h-5 text-dodger" strokeWidth={2.5} />
                </a>
            )}
          </div>
        </div>

        {/* Big Balance Banner - Scaled down and positioned lower to avoid overlap */}
        <div className="absolute -bottom-10 left-6 right-6 bg-white dark:bg-[#1C1C1C] rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(30,144,255,0.3)] dark:shadow-none p-6 flex flex-col border border-white dark:border-gray-800 z-20">
             <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
                 <div className="flex flex-col">
                     <span className="text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1">
                         {isPending ? "Pending Due" : "Advance Paid"}
                     </span>
                     <span className={cn(
                         "font-black text-2xl tracking-tighter drop-shadow-sm",
                         isPending ? "text-rose-500" : "text-emerald-500"
                     )}>
                         ₹{isPending ? student.totalPending.toLocaleString('en-IN') : (student.totalPaid > 0 && student.totalPending === 0 ? student.totalPaid : 0).toLocaleString('en-IN')}
                     </span>
                 </div>
                 <div className="h-8 w-[1px] bg-gray-100 dark:bg-gray-800 mx-3"></div>
                 <div className="flex flex-col items-end">
                     <span className="text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1">
                         Total Paid
                     </span>
                     <span className="font-black text-lg text-gray-700 dark:text-gray-200 tracking-tight">
                         ₹{student.totalPaid.toLocaleString('en-IN')}
                     </span>
                 </div>
             </div>
             
             {/* Action bar below banner */}
             <div className="flex justify-around items-center">
                <button className="flex flex-col items-center gap-1.5 text-gray-400 dark:text-gray-500 hover:text-dodger dark:hover:text-dodger active:scale-90 transition-all group">
                    <div className="p-2.5 rounded-2xl bg-dodger/5 dark:bg-dodger/10 group-hover:bg-dodger/10 transition-colors shadow-inner border border-dodger/10 dark:border-dodger/20">
                        <Download className="w-4 h-4 text-dodger" />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-[0.2em]">Report</span>
                </button>
                <div className="w-px h-6 bg-gray-100 dark:bg-gray-800"></div>
                <button 
                    onClick={() => setShowRemindSheet(true)}
                    className="flex flex-col items-center gap-1.5 text-gray-400 dark:text-gray-500 hover:text-emerald-500 dark:hover:text-emerald-400 active:scale-90 transition-all group"
                >
                    <div className="p-2.5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 group-hover:bg-emerald-500/10 transition-colors shadow-inner border border-emerald-500/10 dark:border-emerald-500/20">
                        <MessageSquare className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-[0.2em]">Remind</span>
                </button>
             </div>
        </div>
      </div>

      {/* Transaction List Area */}
      <div className="mt-32 px-6 pb-48 z-0">
          {/* Table Headers */}
          <div className="flex items-center mb-6 px-4">
              <div className="flex-1 flex items-center gap-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Transaction Ledger</span>
                {transactions.length > 0 && (
                   <button 
                    onClick={() => setShowClearConfirm(true)}
                    className="p-1 text-gray-300 hover:text-rose-500 transition-colors"
                   >
                     <Trash2 className="w-3 h-3" />
                   </button>
                )}
              </div>
              <div className="flex text-[10px] font-black uppercase tracking-[0.2em]">
                <div className="flex flex-col items-center gap-1 w-20">
                  <span className="text-gray-400">Pending</span>
                  <div className="w-8 h-1.5 bg-rose-500 rounded-full shadow-sm shadow-rose-200"></div>
                </div>
                <div className="flex flex-col items-center gap-1 w-20">
                  <span className="text-gray-400">Paid</span>
                  <div className="w-6 h-1.5 bg-emerald-500 rounded-full shadow-sm shadow-emerald-200"></div>
                </div>
              </div>
          </div>

          <div className="space-y-4">
              {sortedTransactions.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-snow dark:bg-[#1C1C1C] rounded-[2rem] p-12 text-center text-gray-300 dark:text-gray-500 border border-white dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-none"
                  >
                      <div className="w-16 h-16 bg-beige dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/50 dark:border-gray-700 overflow-hidden p-3">
                        <img 
                          src="https://github.com/officeajmeerkhajacomplex-svg/akec-dsm/blob/main/logo.png?raw=true" 
                          alt="AKEC Logo" 
                          className="w-full h-full object-contain opacity-40 grayscale"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <p className="text-xs font-black uppercase tracking-widest">No entries yet</p>
                  </motion.div>
              ) : (
                  sortedTransactions.map((tx, index) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        key={tx.id} 
                        onPointerDown={() => startPress(tx)}
                        onPointerUp={endPress}
                        onPointerLeave={endPress}
                        whileTap={{ scale: 0.98 }}
                        className="bg-snow dark:bg-[#1C1C1C] rounded-[2rem] p-5 flex items-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-white dark:border-gray-800 transition-all hover:border-dodger/10 select-none touch-none"
                      >
                          <div className="flex-1">
                              <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-wider">
                                  {format(parseISO(tx.date), "dd MMM yy \u2022 hh:mm a")}
                              </p>
                              <div className="flex items-center gap-3">
                                  <span className="font-black text-gray-900 dark:text-snow text-sm tracking-tight">
                                      {tx.note || (tx.type === 'DUE' ? "Fee Added" : "Payment Received")}
                                  </span>
                              </div>
                              <div className="mt-2 flex items-center gap-1.5">
                                  <div className={cn(
                                      "w-1.5 h-1.5 rounded-full",
                                      tx.type === 'DUE' ? "bg-rose-500" : "bg-emerald-500"
                                  )}></div>
                                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                      Bal: ₹{tx.runningBalance}
                                  </span>
                              </div>
                          </div>
                          
                          <div className="flex">
                              <div className="w-20 flex justify-center">
                                  {tx.type === 'DUE' && (
                                      <span className="bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 px-3 py-1.5 rounded-xl text-xs font-black shadow-inner border border-rose-100 dark:border-rose-500/20 truncate max-w-full">
                                        ₹{tx.amount}
                                      </span>
                                  )}
                              </div>
                              <div className="w-20 flex justify-center">
                                  {tx.type === 'PAID' && (
                                      <span className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-black shadow-inner border border-emerald-100 dark:border-emerald-500/20 truncate max-w-full">
                                        ₹{tx.amount}
                                      </span>
                                  )}
                              </div>
                          </div>
                      </motion.div>
                  ))
              )}
          </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-snow/80 dark:bg-[#1C1C1C]/80 backdrop-blur-xl p-6 flex gap-4 shadow-[0_-20px_50px_-15px_rgba(0,0,0,0.1)] z-50 rounded-t-[3rem] border-t border-white/50 dark:border-gray-800">
          <button 
                onClick={() => setShowTransactionSheet("DUE")}
                className="flex-1 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 py-4.5 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all flex justify-center items-center border border-rose-100 dark:border-rose-500/20 shadow-sm">
              Add Due ₹
          </button>
          <button 
                 onClick={() => setShowTransactionSheet("PAID")}
                 className="flex-1 bg-emerald-500 text-snow py-4.5 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-emerald-500/40 active:scale-95 transition-all flex justify-center items-center">
              Got Payment ₹
          </button>
      </div>

        {/* Remind Bottom Sheet */}
        {showRemindSheet && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] flex flex-col justify-end transition-all duration-300">
                <div className="absolute inset-0" onClick={() => setShowRemindSheet(false)} />
                <div className="bg-snow max-w-md w-full mx-auto rounded-t-[3rem] p-8 pt-4 relative z-[70] shadow-2xl animate-in slide-in-from-bottom duration-300 border-t border-white/20">
                    <div className="w-16 h-1.5 bg-gray-200 rounded-full mx-auto mb-8 opacity-40" />
                    
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-dodger/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
                            <Send className="w-8 h-8 text-dodger" />
                        </div>
                        <h3 className="text-xl font-black text-gray-800 tracking-tight">Send Reminder</h3>
                        <p className="text-xs text-gray-400 font-bold mt-2 uppercase tracking-widest">Select your preferred platform</p>
                    </div>

                    {!student.phone ? (
                        <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl mb-6 text-center">
                            <p className="text-xs font-bold text-amber-700">No phone number added for this student.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 mb-10">
                            <button 
                                onClick={handleSendWhatsApp}
                                className="flex flex-col items-center gap-4 p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 active:scale-95 transition-all group"
                            >
                                <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                                    <MessageSquare className="w-7 h-7" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">WhatsApp</span>
                            </button>
                            
                            <button 
                                onClick={handleSendSMS}
                                className="flex flex-col items-center gap-4 p-6 bg-dodger/5 rounded-[2rem] border border-dodger/10 active:scale-95 transition-all group"
                            >
                                <div className="w-14 h-14 bg-dodger text-white rounded-2xl flex items-center justify-center shadow-lg shadow-dodger/20 group-hover:scale-110 transition-transform">
                                    <Send className="w-7 h-7" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-dodger">Text SMS</span>
                            </button>
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                         <button 
                            onClick={handleShareReceipt}
                            className="w-full py-5 rounded-2xl bg-beige text-gray-600 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all border border-gray-200"
                        >
                            <Share2 className="w-4 h-4" />
                            Share Ledger Summary
                        </button>
                        
                        <button 
                            onClick={() => setShowRemindSheet(false)}
                            className="w-full py-5 rounded-2xl bg-gray-50 text-gray-400 font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Delete Confirmation Popup */}
        {txToDelete && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 transition-all animate-in fade-in duration-200">
                <div className="absolute inset-0" onClick={() => setTxToDelete(null)} />
                <div className="bg-snow dark:bg-[#1C1C1C] max-w-sm w-full rounded-[2.5rem] p-8 relative z-[110] shadow-2xl animate-in zoom-in-95 duration-200 border border-white/20 dark:border-gray-800">
                    <div className="w-16 h-16 bg-rose-50 dark:bg-rose-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-8 h-8 text-rose-500" />
                    </div>
                    <h3 className="text-xl font-black text-gray-800 dark:text-snow text-center mb-2">Delete Entry?</h3>
                    <p className="text-sm text-gray-400 text-center mb-8 px-4 leading-relaxed font-bold">Are you sure you want to delete this transaction? This will affect the student's balance.</p>
                    
                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={handleDeleteTransaction}
                            className="w-full py-4.5 rounded-2xl bg-rose-500 text-snow font-black text-[11px] uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-rose-500/20"
                        >
                            Delete Forever
                        </button>
                        <button 
                            onClick={() => setTxToDelete(null)}
                            className="w-full py-4.5 rounded-2xl bg-gray-50 text-gray-400 font-black text-[11px] uppercase tracking-widest active:scale-95 transition-all"
                        >
                            Keep it
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Clear History Confirmation Popup */}
        {showClearConfirm && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 transition-all animate-in fade-in duration-200">
                <div className="absolute inset-0" onClick={() => setShowClearConfirm(false)} />
                <div className="bg-snow dark:bg-[#1C1C1C] max-w-sm w-full rounded-[2.5rem] p-8 relative z-[110] shadow-2xl animate-in zoom-in-95 duration-200 border border-white/20 dark:border-gray-800">
                    <div className="w-16 h-16 bg-rose-50 dark:bg-rose-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Trash2 className="w-8 h-8 text-rose-500" />
                    </div>
                    <h3 className="text-xl font-black text-gray-800 dark:text-snow text-center mb-2">Clear History?</h3>
                    <p className="text-sm text-gray-400 text-center mb-8 px-4 leading-relaxed font-bold">This will remove ALL transactions for this student and reset their balance to zero.</p>
                    
                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={handleClearHistory}
                            className="w-full py-4.5 rounded-2xl bg-rose-500 text-snow font-black text-[11px] uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-rose-500/20"
                        >
                            Clear All Entries
                        </button>
                        <button 
                            onClick={() => setShowClearConfirm(false)}
                            className="w-full py-4.5 rounded-2xl bg-gray-50 text-gray-400 font-black text-[11px] uppercase tracking-widest active:scale-95 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Simple Bottom Sheet Overlay */}
        {showTransactionSheet && (
           <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex flex-col justify-end no-scrollbar transition-opacity">
                <div className="absolute inset-0" onClick={() => setShowTransactionSheet(null)} />
                <div className="bg-snow dark:bg-[#1C1C1C] max-w-md w-full mx-auto rounded-t-[2.5rem] p-7 relative z-[70] translate-y-0 shadow-2xl animate-in slide-in-from-bottom duration-300 border-t border-white/20 dark:border-gray-800">
                     <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-8" />
                     
                     <h3 className={cn(
                         "text-lg font-black mb-6 text-center uppercase tracking-widest drop-shadow-sm",
                         showTransactionSheet === 'DUE' ? "text-rose-600" : "text-emerald-600"
                     )}>
                         {showTransactionSheet === 'DUE' ? "Add New Due Amount" : "Record Payment Received"}
                     </h3>

                     <div className="space-y-5">
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Amount (₹)</label>
                            <div className="relative mt-2">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xl">₹</span>
                                <input 
                                    type="number" 
                                    value={txAmount}
                                    onChange={e => setTxAmount(e.target.value)}
                                    className={cn(
                                        "w-full text-3xl font-black bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 shadow-sm rounded-2xl pl-12 pr-4 py-4 focus:ring-2 outline-none placeholder:text-gray-200 transition-all text-gray-900 dark:text-snow",
                                        showTransactionSheet === 'DUE' ? "focus:ring-rose-500/30 focus:border-rose-500" : "focus:ring-emerald-500/30 focus:border-emerald-500"
                                    )}
                                    placeholder="0"
                                    autoFocus
                                />
                            </div>
                        </div>

                         <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Note / Description</label>
                            <input 
                                type="text" 
                                value={txNote}
                                onChange={e => setTxNote(e.target.value)}
                                className={cn(
                                    "w-full text-sm font-bold bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 shadow-sm rounded-xl px-5 py-4 mt-2 focus:ring-2 outline-none placeholder:text-gray-300 transition-all text-gray-900 dark:text-snow",
                                    showTransactionSheet === 'DUE' ? "focus:ring-rose-500/30 focus:border-rose-500" : "focus:ring-emerald-500/30 focus:border-emerald-500"
                                )}
                                placeholder="e.g., March Monthly Fee"
                            />
                        </div>

                         <div className="pt-6">
                            <button onClick={handleAddTransaction} className={cn(
                                "w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest text-snow shadow-lg active:scale-[0.98] transition-all",
                                showTransactionSheet === 'DUE' ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/30" : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30"
                            )}>
                                Save Entry
                            </button>
                        </div>
                     </div>
                </div>
           </div>
       )}

    </div>
  );
}
