import { User, LogOut, Globe, Moon, Shield, ChevronRight, X, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/src/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const DEPARTMENTS = ["Hifz", "Madrassa", "Dars"];

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, signOut, login } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.ustad_name || "",
    department: user?.department || ""
  });

  const handleSave = () => {
    if (user) {
      login({
        ...user,
        ustad_name: editForm.name,
        department: editForm.department
      });
      setIsEditing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-snow dark:bg-[#121212] pb-24 relative">
        {/* Header Area */}
        <div className="relative isolate">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-header-bg text-header-text pt-14 pb-20 px-6 relative z-10 rounded-b-[3.5rem] shadow-xl overflow-hidden border-b border-gray-100 dark:border-gray-800"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-dodger/5 to-transparent opacity-60"></div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-dodger/5 rounded-full blur-3xl"></div>
            <h1 className="text-2xl font-black tracking-tight text-header-text leading-tight drop-shadow-sm relative z-20">{t('settings.title')}</h1>
          </motion.div>
        </div>

      <div className="px-6 -mt-6 z-20 relative">
          {/* Profile Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-snow dark:bg-[#1C1C1C] rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100/80 dark:border-gray-800 p-5 flex items-start gap-4 mb-6"
          >
              <div className="w-14 h-14 bg-sky/20 dark:bg-sky-500/10 rounded-full flex justify-center items-center text-dodger dark:text-sky-400 shrink-0 mt-1 shadow-inner border border-sky/30 dark:border-sky-500/20">
                  <User className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.div 
                      key="editing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('settings.name')}</label>
                        <input 
                          type="text" 
                          value={editForm.name}
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                          className="w-full h-10 border-b border-gray-200 dark:border-gray-700 focus:border-dodger outline-none text-sm font-bold text-gray-900 dark:text-snow bg-transparent px-0 transition-all focus:ring-0"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('settings.department')}</label>
                        <select 
                          value={editForm.department}
                          onChange={(e) => setEditForm({...editForm, department: e.target.value})}
                          className="w-full h-10 border-b border-gray-200 dark:border-gray-700 focus:border-dodger outline-none text-sm font-bold text-gray-900 dark:text-snow bg-transparent px-0 transition-all focus:ring-0 appearance-none"
                        >
                          {DEPARTMENTS.map(dept => (
                            <option key={dept} value={dept} className="dark:bg-gray-900 text-gray-900 dark:text-snow">{dept}</option>
                          ))}
                        </select>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="viewing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <h2 className="text-lg font-bold text-gray-900 dark:text-snow leading-tight drop-shadow-sm">
                        {user?.ustad_name || "Ustad"}
                      </h2>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                        {user?.department || "Department"}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold mt-1">{user?.phone_number || ""}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="shrink-0 flex items-center justify-end">
                {isEditing ? (
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={handleSave}
                      className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600 transition-colors active:bg-green-100"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        setIsEditing(false);
                        setEditForm({ name: user?.ustad_name || "", department: user?.department || "" });
                      }}
                       className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600 transition-colors active:bg-red-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="text-dodger text-[10px] tracking-widest font-bold uppercase py-2 px-3 bg-sky/10 rounded-xl active:bg-sky/20 transition-colors shadow-sm"
                  >
                    {t('settings.edit')}
                  </button>
                )}
              </div>
          </motion.div>

          {/* Setting Options */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-snow dark:bg-[#1C1C1C] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden divide-y divide-gray-100 dark:divide-gray-800"
          >
              <div onClick={() => setIsLangOpen(true)} className="p-4 flex items-center justify-between active:bg-gray-50 dark:active:bg-gray-800/50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                      <div className="bg-orange-50 dark:bg-orange-500/10 p-2.5 rounded-xl border border-orange-100/50 dark:border-orange-500/20">
                        <Globe className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <span className="font-bold text-gray-700 dark:text-gray-200 text-[13px] tracking-wide">{t('settings.language')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                       <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider font-ml">{language === 'en' ? 'English' : 'മലയാളം'}</span>
                       <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                  </div>
              </div>

               <div 
                  onClick={toggleDarkMode}
                  className="p-4 flex items-center justify-between active:bg-gray-50 dark:active:bg-gray-800/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                      <div className="bg-purple-50 dark:bg-purple-500/10 p-2.5 rounded-xl border border-purple-100/50 dark:border-purple-500/20">
                        <Moon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="font-bold text-gray-700 dark:text-gray-200 text-[13px] tracking-wide">{t('settings.darkMode')}</span>
                  </div>
                  <div className={cn(
                    "w-10 h-6 rounded-full relative transition-colors duration-200",
                    isDarkMode ? "bg-purple-500" : "bg-gray-200 shadow-inner"
                  )}>
                      <motion.div 
                        initial={false}
                        animate={{ x: isDarkMode ? 20 : 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md" 
                      />
                  </div>
              </div>

              <div 
                onClick={() => navigate('/privacy-security')}
                className="p-4 flex items-center justify-between active:bg-gray-50 dark:active:bg-gray-800/50 cursor-pointer transition-colors"
              >
                  <div className="flex items-center gap-3">
                      <div className="bg-sky/10 dark:bg-dodger/10 p-2.5 rounded-xl border border-sky/20 dark:border-dodger/20">
                        <Shield className="w-5 h-5 text-dodger dark:text-sky-400" />
                      </div>
                      <span className="font-bold text-gray-700 dark:text-gray-200 text-[13px] tracking-wide">{t('settings.privacy')}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600" />
              </div>
          </motion.div>

           {/* Log out block */}
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.3 }}
             className="mt-8"
           >
               <button 
                onClick={() => signOut()}
                className="w-full bg-snow dark:bg-[#1C1C1C] border border-rose-100 dark:border-rose-900 text-rose-600 dark:text-rose-400 font-black uppercase tracking-widest text-[11px] rounded-2xl py-4 flex items-center justify-center gap-2 active:bg-rose-50 dark:active:bg-rose-900/10 transition-colors shadow-sm"
               >
                   <LogOut className="w-5 h-5" />
                   {t('settings.signOut')}
               </button>
           </motion.div>
           
           <div className="text-center mt-6">
               <p className="text-xs text-gray-400 font-medium">Ajmeer Khaja Ledger v1.0.0</p>
           </div>
      </div>

      {/* Language Selector Popup */}
      <AnimatePresence>
        {isLangOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLangOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-snow dark:bg-[#1C1C1C] rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-lg font-black text-gray-900 dark:text-snow mb-4">{t('settings.language')}</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => { setLanguage('en'); setIsLangOpen(false); }}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-2xl border transition-all",
                      language === 'en' 
                        ? "bg-dodger/10 border-dodger text-dodger" 
                        : "border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    )}
                  >
                    <span className="font-bold">English</span>
                    {language === 'en' && <Check className="w-5 h-5" />}
                  </button>
                  <button 
                    onClick={() => { setLanguage('ml'); setIsLangOpen(false); }}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-2xl border transition-all",
                      language === 'ml' 
                        ? "bg-dodger/10 border-dodger text-dodger" 
                        : "border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    )}
                  >
                    <span className="font-bold font-ml">മലയാളം</span>
                    {language === 'ml' && <Check className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

