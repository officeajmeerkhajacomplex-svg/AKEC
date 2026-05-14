import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { TopBar } from './TopBar';

export function AppShell() {
  return (
    <div className="min-h-screen bg-background pb-32 selection:bg-primary/20 flex flex-col items-center">
      <div className="fixed inset-0 islamic-pattern pointer-events-none z-0" />
      <TopBar />
      <main className="relative z-10 w-full max-w-lg px-4 pt-8 pb-12 flex-1">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
