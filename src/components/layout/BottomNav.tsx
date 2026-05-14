import { Home, Users, Bell, Settings, Plus, CreditCard } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';

export function BottomNav() {
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Users, label: 'Ledger', path: '/ledger' },
    { icon: CreditCard, label: 'Pay', path: '/ledger', isCenter: true },
    { icon: Bell, label: 'Notices', path: '/notices' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around h-[72px] max-w-lg mx-auto relative px-2">
        {navItems.map((item) => {
          if (item.isCenter) {
            return (
              <NavLink key={item.label} to={item.path} className="relative -mt-10 flex flex-col items-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-14 h-14 bg-primary rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white"
                >
                  <Plus className="w-8 h-8 font-bold" />
                </motion.div>
                <span className="text-[10px] font-bold text-primary mt-1">{item.label}</span>
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center px-4 py-2 transition-all ${
                  isActive ? 'text-primary' : 'text-slate-400 opacity-60'
                }`
              }
            >
              <motion.div whileTap={{ scale: 0.9 }}>
                <item.icon className="w-5 h-5" />
              </motion.div>
              <span className="text-[10px] font-bold mt-1 tracking-tight">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
