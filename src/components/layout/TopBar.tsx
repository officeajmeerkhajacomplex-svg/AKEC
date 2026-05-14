import { Bell, Search, User } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function TopBar() {
  const { role } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full bg-primary text-primary-foreground shadow-md px-6 py-4">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tight leading-none">Ajmeer Khaja</h1>
          <p className="text-[10px] text-primary-foreground/80 mt-1 font-semibold tracking-wider uppercase">
            Smart Islamic Institution Management
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Avatar className="w-10 h-10 border-2 border-primary-foreground/30 shadow-sm">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground text-sm font-bold">
              AK
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
