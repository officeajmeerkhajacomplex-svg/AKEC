import { useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/src/lib/utils";

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000); // 2 seconds splash screen
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-snow dark:bg-[#121212] overflow-hidden"
    >
      {/* Background Gradient & Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-dodger/10 to-transparent dark:from-dodger/5 opacity-80" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] max-w-[600px] max-h-[600px] bg-dodger/5 dark:bg-dodger/10 rounded-full blur-[100px]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="w-24 h-24 bg-white/40 dark:bg-white/10 p-2 rounded-3xl backdrop-blur-md border border-white/20 shadow-xl flex items-center justify-center overflow-hidden"
        >
          <img 
            src="https://github.com/officeajmeerkhajacomplex-svg/akec-dsm/blob/main/logo.png?raw=true" 
            alt="AKEC Logo" 
            className="w-full h-full object-contain drop-shadow-md"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="text-4xl sm:text-5xl font-black tracking-tighter text-gray-900 dark:text-gray-50 drop-shadow-sm"
        >
          AKEC LEDGER
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="w-32 h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden"
        >
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              ease: "easeInOut",
            }}
            className="w-full h-full bg-dodger rounded-full"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
