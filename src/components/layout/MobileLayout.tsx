import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Settings } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide bottom nav on detail screens
  const isDetailScreen = location.pathname.includes('/student/');

  return (
    <div className="flex flex-col min-h-screen max-w-md w-full mx-auto bg-snow dark:bg-[#121212] text-gray-900 dark:text-gray-100 border-x border-gray-100 dark:border-gray-800 relative shadow-2xl h-[100dvh] overflow-hidden">
      
      {/* Main Content Area - Scrollable with Page Transitions */}
      <main className={cn(
        "flex-1 overflow-y-auto pb-24 no-scrollbar",
        isDetailScreen && "pb-32" 
      )}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            className="min-h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      
      {/* Bottom Navigation */}
      {!isDetailScreen && (
        <nav className="absolute bottom-0 w-full bg-snow dark:bg-[#1C1C1C] border-t border-gray-100 dark:border-gray-800 px-10 pt-4 pb-6 flex justify-around items-center z-40 rounded-t-[2rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
          <button 
            onClick={() => navigate('/')}
            className={cn(
              "flex flex-col items-center gap-1 transition-all relative",
              location.pathname === '/' ? "text-dodger" : "text-gray-400"
            )}
          >
            <motion.div
              animate={{
                scale: location.pathname === '/' ? 1.1 : 1,
                y: location.pathname === '/' ? -2 : 0
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <LayoutDashboard className="w-6 h-6" strokeWidth={location.pathname === '/' ? 2.5 : 2} />
            </motion.div>
            <span className={cn(
                "text-[10px] uppercase tracking-widest font-black transition-all",
                location.pathname === '/' ? "opacity-100 scale-105" : "opacity-70 scale-100"
            )}>Ledger</span>
            {location.pathname === '/' && (
              <motion.div 
                layoutId="nav-indicator"
                className="absolute -bottom-2 w-1 h-1 bg-dodger rounded-full"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
          </button>
          
          <button 
            onClick={() => navigate('/settings')}
            className={cn(
              "flex flex-col items-center gap-1 transition-all relative",
              location.pathname === '/settings' ? "text-dodger" : "text-gray-400"
            )}
          >
            <motion.div
              animate={{
                scale: location.pathname === '/settings' ? 1.1 : 1,
                y: location.pathname === '/settings' ? -2 : 0
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Settings className="w-6 h-6" strokeWidth={location.pathname === '/settings' ? 2.5 : 2} />
            </motion.div>
            <span className={cn(
                "text-[10px] uppercase tracking-widest font-black transition-all",
                location.pathname === '/settings' ? "opacity-100 scale-105" : "opacity-70 scale-100"
            )}>Settings</span>
            {location.pathname === '/settings' && (
              <motion.div 
                layoutId="nav-indicator"
                className="absolute -bottom-2 w-1 h-1 bg-dodger rounded-full"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
          </button>
        </nav>
      )}
    </div>
  );
}
