import { motion } from 'motion/react';
import { useApp } from '@/lib/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Wallet, 
  Clock, 
  CalendarDays, 
  Plus, 
  ArrowUpRight, 
  ClipboardCheck,
  Megaphone,
  ReceiptText
} from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

export function Dashboard() {
  const { students, notices, payments } = useApp();
  const navigate = useNavigate();

  const totalStudents = students.length;
  const todayCollections = payments
    .filter(p => p.paymentDate === format(new Date(), 'yyyy-MM-dd'))
    .reduce((sum, p) => sum + p.amount, 0);
  const totalPending = students.reduce((sum, s) => sum + s.totalPending, 0);

  const stats = [
    { label: 'Total Students', value: totalStudents, icon: Users, color: 'text-sky-600', sub: 'Enrolled' },
    { label: 'Collected', value: `₹${todayCollections}`, icon: Wallet, color: 'text-emerald-600', sub: 'Today' },
    { label: 'Pending', value: `₹${totalPending}`, icon: Clock, color: 'text-destructive', sub: 'Total Dues' },
  ];

  const quickActions = [
    { 
      label: 'Add Payment', 
      icon: Wallet, 
      bgColor: 'bg-primary/5', 
      iconColor: 'bg-primary', 
      textColor: 'text-primary',
      action: () => navigate('/ledger')
    },
    { 
      label: 'Add Student', 
      icon: Plus, 
      bgColor: 'bg-emerald-50', 
      iconColor: 'bg-emerald-500', 
      textColor: 'text-emerald-700',
      action: () => navigate('/ledger')
    },
    { 
      label: 'Send Notice', 
      icon: Megaphone, 
      bgColor: 'bg-amber-50', 
      iconColor: 'bg-amber-500', 
      textColor: 'text-amber-700',
      action: () => navigate('/notices')
    },
    { 
      label: 'Generate Receipt', 
      icon: ReceiptText, 
      bgColor: 'bg-purple-50', 
      iconColor: 'bg-purple-500', 
      textColor: 'text-purple-700',
      action: () => navigate('/ledger')
    },
  ];

  return (
    <div className="space-y-8">
      {/* Khatabook Style Summary */}
      <section>
        <Card className="overflow-hidden border border-slate-200 shadow-sm bg-white rounded-2xl">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
            <span className="font-bold text-slate-600 text-xs uppercase tracking-wider">Overview ({format(new Date(), 'MMM yyyy')})</span>
          </div>
          <div className="flex divide-x divide-slate-100">
            {stats.map((stat) => (
              <div key={stat.label} className="flex-1 p-4 flex flex-col items-center justify-center text-center">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1">{stat.label}</span>
                <span className={`text-xl font-black ${stat.color}`}>{stat.value}</span>
                <span className="text-[8px] text-slate-400 font-medium mt-1 uppercase tracking-widest">{stat.sub}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Quick Action Grid */}
      <section>
        <h2 className="text-sm font-bold text-slate-800 mb-4 px-1 uppercase tracking-widest">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, i) => (
            <motion.button
              key={action.label}
              whileTap={{ scale: 0.98 }}
              onClick={action.action}
              className={`flex flex-col items-center justify-center p-4 ${action.bgColor} rounded-2xl border border-transparent shadow-sm transition-all group hover:opacity-90`}
            >
              <div className={`w-10 h-10 ${action.iconColor} rounded-full flex items-center justify-center mb-2 shadow-sm text-white group-hover:scale-110 transition-transform`}>
                <action.icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold ${action.textColor}`}>{action.label}</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Upcoming Events / Announcements Feed */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            Upcoming Events
          </h3>
          <Button variant="ghost" className="text-[10px] uppercase font-bold tracking-widest h-auto p-0 text-primary" onClick={() => navigate('/notices')}>View All</Button>
        </div>
        <div className="space-y-5">
          {notices.length === 0 ? (
            <div className="text-center py-6 text-slate-400">
              <CalendarDays className="w-8 h-8 mx-auto mb-2 opacity-20" />
              <p className="text-xs font-medium">No upcoming events.</p>
            </div>
          ) : (
            notices.slice(0, 3).map((notice, i) => {
            const borderColors = {
              ramadan: 'border-emerald-400',
              event: 'border-sky-400',
              holiday: 'border-amber-400',
              exam: 'border-rose-400',
              general: 'border-slate-400'
            };
            const borderColor = borderColors[notice.type as keyof typeof borderColors] || 'border-slate-400';
            
            return (
              <motion.div 
                key={notice.id} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`border-l-4 ${borderColor} pl-4 py-1 relative group cursor-pointer hover:bg-slate-50 transition-colors rounded-r-md`}
              >
                <p className="text-xs font-bold text-slate-800 group-hover:text-primary transition-colors">{notice.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-[10px] text-slate-500 font-medium">
                    {format(new Date(notice.publishDate), 'MMM dd')} • Admin
                  </p>
                  <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-400 font-bold uppercase tracking-tighter">
                    {notice.type}
                  </span>
                </div>
              </motion.div>
            );
          })
          )}
        </div>
      </section>

      {/* Recent Payments Feed */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            Recent Payments
          </h3>
          <Button variant="ghost" className="text-[10px] uppercase font-bold tracking-widest h-auto p-0 text-primary" onClick={() => navigate('/ledger')}>Ledger</Button>
        </div>
        <div className="space-y-4">
          {payments.length === 0 ? (
            <div className="text-center py-6 text-slate-400">
              <Wallet className="w-8 h-8 mx-auto mb-2 opacity-20" />
              <p className="text-xs font-medium">No recent payments.</p>
            </div>
          ) : (
            payments.sort((a,b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()).slice(0, 3).map((payment, i) => {
            const student = students.find(s => s.id === payment.studentId);
            return (
              <motion.div 
                key={payment.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer"
                onClick={() => navigate('/ledger')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    {student ? student.name.charAt(0) : '?'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{student ? student.name : 'Unknown'}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{format(new Date(payment.paymentDate), 'MMM dd, h:mm a')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-emerald-600">+₹{payment.amount}</p>
                  <Badge variant="outline" className="text-[8px] bg-slate-50 text-slate-500 border-slate-200 mt-1 uppercase">
                    {payment.method}
                  </Badge>
                </div>
              </motion.div>
            );
          })
          )}
        </div>
      </section>
    </div>
  );
}
