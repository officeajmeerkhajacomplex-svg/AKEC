import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Shield, 
  Globe, 
  Moon, 
  Sun, 
  LogOut, 
  ChevronRight,
  Database,
  Bell,
  MessageSquare
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useApp } from '@/lib/AppContext';
import { toast } from 'sonner';

export function Settings() {
  const { role, setRole } = useApp();
  const [darkMode, setDarkMode] = useState(false);

  const menuGroups = [
    {
      title: 'General',
      items: [
        { label: 'Language', icon: Globe, value: 'English', action: () => toast.info('Languages: English, Malayalam, Arabic') },
        { label: 'Notifications', icon: Bell, type: 'switch' },
        { label: 'Dark Mode', icon: darkMode ? Moon : Sun, type: 'switch', state: darkMode, toggle: () => setDarkMode(!darkMode) },
      ]
    },
    {
      title: 'Account',
      items: [
        { label: 'Profile Settings', icon: User, action: () => {} },
        { label: 'User Role', icon: Shield, value: role.replace('_', ' '), action: () => {} },
        { label: 'Database Backup', icon: Database, action: () => toast.success('Backup initiated...') },
      ]
    },
    {
      title: 'Support',
      items: [
        { label: 'WhatsApp Support', icon: MessageSquare, action: () => {} },
        { label: 'About App', icon: ChevronRight, action: () => {} },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl border-2 border-primary/20">
          A
        </div>
        <div>
          <h2 className="text-xl font-bold">Admin Office</h2>
          <p className="text-xs text-muted-foreground font-medium">office.ajmeerkhaja@gmail.com</p>
        </div>
      </div>

      <div className="space-y-6">
        {menuGroups.map((group) => (
          <div key={group.title} className="space-y-3">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
              {group.title}
            </h3>
            <Card className="border-none shadow-sm overflow-hidden">
              <CardContent className="p-0">
                {group.items.map((item, i) => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className={`w-full flex items-center justify-between p-4 transition-colors hover:bg-accent/50 active:bg-accent ${
                      i !== group.items.length - 1 ? 'border-b border-border/50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center">
                        <item.icon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-semibold">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.value && (
                        <span className="text-xs font-medium text-muted-foreground capitalize">
                          {item.value}
                        </span>
                      )}
                      {item.type === 'switch' ? (
                        <Switch checked={item.state} onCheckedChange={item.toggle} />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        ))}

        <Button 
          variant="destructive" 
          className="w-full h-12 rounded-2xl font-bold gap-2 bg-red-50 text-red-600 border-none hover:bg-red-100"
        >
          <LogOut className="w-5 h-5" />
          Logout Account
        </Button>

        <div className="text-center pt-4">
          <p className="text-[10px] text-muted-foreground font-medium">Ajmeer Khaja Educational Complex</p>
          <p className="text-[9px] text-muted-foreground opacity-50">Version 1.0.0 (Build 2026)</p>
        </div>
      </div>
    </div>
  );
}
