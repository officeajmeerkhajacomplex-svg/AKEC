import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Phone, User, Building2, ChevronRight, Loader2 } from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";

const DEPARTMENTS = ["Hifz", "Madrassa", "Dars"];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    phone: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.department || !formData.phone) {
      setError("Please fill all fields");
      return;
    }
    
    setLoading(true);
    setError(null);

    const phoneNumber = formData.phone.startsWith('+') ? formData.phone : `+91${formData.phone}`;

    try {
      const profileData = {
        id: crypto.randomUUID(),
        ustad_name: formData.name,
        department: formData.department,
        phone_number: phoneNumber,
      };

      login(profileData);
      navigate("/");
      
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
        <div className="text-center mb-10">
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
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2 font-bold uppercase tracking-widest">Digital Account Ledger for Ustads</p>
        </div>

        <motion.form
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onSubmit={handleLogin}
          className="space-y-6"
        >
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-widest uppercase ml-1">Ustad Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-dodger transition-colors" />
                <input 
                  required
                  type="text" 
                  placeholder="Enter ustad name"
                  className="w-full h-14 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl pl-12 pr-4 text-gray-900 dark:text-snow focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-dodger/20 focus:border-dodger transition-all outline-none font-bold"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-widest uppercase ml-1">Department</label>
              <div className="relative group">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-dodger transition-colors" />
                <select 
                  required
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
