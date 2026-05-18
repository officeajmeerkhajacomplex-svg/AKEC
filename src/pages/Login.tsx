import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Phone, User, Building2, ChevronRight, Loader2, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import { cn } from "@/src/lib/utils";

const DEPARTMENTS = ["Hifz", "Madrassa", "Dars"];

export default function Login() {
  const navigate = useNavigate();
  const { user, loginUsthad, loginParent } = useAuth();
  
  React.useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const [role, setRole] = useState<'usthad' | 'parent'>('usthad');
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (role === 'usthad') {
        if (!formData.name || !formData.password) {
          throw new Error("Please fill all required fields");
        }
        if (isFirstLogin && !formData.department) {
           throw new Error("Please select a department");
        }
        await loginUsthad(formData.name, formData.password, isFirstLogin, formData.department);
      } else {
        if (!formData.phone) {
          throw new Error("Please enter your phone number");
        }
        const phoneNumber = formData.phone.startsWith('+') ? formData.phone : `+91${formData.phone}`;
        await loginParent(phoneNumber);
      }
      // navigation is handled by useEffect when user state is truthy
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to authenticate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-snow dark:bg-[#121212] relative overflow-hidden transition-colors duration-300">
      {/* Spiritual Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none text-dodger">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="islamic-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M50 0L65 35L100 50L65 65L50 100L35 65L0 50L35 35Z" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
        </svg>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-snow dark:bg-[#1C1C1C] rounded-[2.5rem] p-8 shadow-2xl relative z-10 border border-white/80 dark:border-gray-800 backdrop-blur-md"
      >
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-dodger rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-xl shadow-dodger/30 border border-white/20 overflow-hidden p-3"
          >
            <img 
              src="https://github.com/officeajmeerkhajacomplex-svg/akec-dsm/blob/main/logo.png?raw=true" 
              alt="AKEC Logo" 
              className="w-full h-full object-contain brightness-0 invert"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-snow tracking-tighter drop-shadow-sm uppercase">AKEC Ledger</h1>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2 font-bold uppercase tracking-widest">{role === 'usthad' ? 'Digital Account Ledger for Ustads' : 'Parent Access Portal'}</p>
        </div>

        {/* Role Tab Switcher */}
        <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-6">
          <button 
            type="button"
            onClick={() => setRole('usthad')} 
            className={cn("flex-1 py-3 text-sm font-black rounded-lg transition-all", role === 'usthad' ? 'bg-white dark:bg-[#1C1C1C] text-dodger shadow-sm shadow-black/5' : 'text-gray-400')}
          >
            Usthad
          </button>
          <button 
            type="button"
            onClick={() => setRole('parent')} 
            className={cn("flex-1 py-3 text-sm font-black rounded-lg transition-all", role === 'parent' ? 'bg-white dark:bg-[#1C1C1C] text-dodger shadow-sm shadow-black/5' : 'text-gray-400')}
          >
            Parent
          </button>
        </div>

        <motion.form
          key={role}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onSubmit={handleLogin}
          className="space-y-6"
        >
          <div className="space-y-4">
            
            {role === 'usthad' ? (
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={isFirstLogin ? 'first' : 'returning'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-widest uppercase ml-1">Usthad Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-dodger transition-colors" />
                      <input 
                        required
                        type="text" 
                        placeholder="Enter usthad name"
                        className="w-full h-14 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl pl-12 pr-4 text-gray-900 dark:text-snow focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-dodger/20 focus:border-dodger transition-all outline-none font-bold"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>

                  {isFirstLogin && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-widest uppercase ml-1">Department</label>
                      <div className="relative group">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-dodger transition-colors" />
                        <select 
                          required={isFirstLogin}
                          className="w-full h-14 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl pl-12 pr-4 text-gray-900 dark:text-snow focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-dodger/20 focus:border-dodger transition-all outline-none font-bold appearance-none"
                          value={formData.department}
                          onChange={e => setFormData({...formData, department: e.target.value})}
                        >
                          <option value="" disabled className="text-gray-400">Select your department</option>
                          {DEPARTMENTS.map(dept => (
                            <option key={dept} value={dept} className="bg-white dark:bg-gray-900">{dept}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-widest uppercase ml-1">Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-dodger transition-colors" />
                      <input 
                        required
                        type={showPassword ? "text" : "password"}
                        placeholder={isFirstLogin ? "Create password" : "Enter password"}
                        className="w-full h-14 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl pl-12 pr-12 text-gray-900 dark:text-snow focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-dodger/20 focus:border-dodger transition-all outline-none font-bold"
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dodger transition-colors"
                      >
                         {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <AnimatePresence mode="popLayout">
                <motion.div
                  key="parent-login"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-widest uppercase ml-1">Student Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-dodger transition-colors" />
                      <input 
                        required
                        type="text" 
                        placeholder="Enter student name"
                        className="w-full h-14 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl pl-12 pr-4 text-gray-900 dark:text-snow focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-dodger/20 focus:border-dodger transition-all outline-none font-bold"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-widest uppercase ml-1">Phone Number</label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-dodger transition-colors" />
                      <span className="absolute left-11 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-[13px] font-black border-r border-gray-200 dark:border-gray-800 pr-2">+91</span>
                      <input 
                        required
                        type="tel" 
                        placeholder="Enter phone number"
                        className="w-full h-14 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl pl-[4.5rem] pr-4 text-gray-900 dark:text-snow focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-dodger/20 focus:border-dodger transition-all outline-none font-bold tracking-wider"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs font-bold text-center">
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-dodger text-snow rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-70 shadow-xl shadow-dodger/30"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Continue <ChevronRight className="w-5 h-5" /></>}
          </button>
        </motion.form>
      </motion.div>
      
      <div className="absolute bottom-10 text-gray-400 text-xs font-medium tracking-wide">
        &copy; 2024 AJMEER KHAJA EDUCATIONAL COMPLEX
      </div>
    </div>
  );
}
