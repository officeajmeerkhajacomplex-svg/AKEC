import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import QRCode from 'react-qr-code';
import { useApp } from '@/lib/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Search, 
  Filter, 
  Phone, 
  ChevronRight, 
  UserPlus,
  ArrowRightLeft,
  MessageCircle,
  MoreVertical,
  X,
  Wallet,
  ReceiptText,
  Clock,
  Printer
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Ledger() {
  const { students, payments, addStudent, addPayment, deleteStudent } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  // Form states
  const [newStudent, setNewStudent] = useState({
    name: '',
    className: '',
    guardianName: '',
    phoneNumber: '',
    monthlyFee: 500,
  });

  const [paymentAmount, setPaymentAmount] = useState('');

  const filteredStudents = students.filter(student => {
    return student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           student.phoneNumber.includes(searchQuery);
  });

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.className) {
      toast.error('Please fill in all required fields');
      return;
    }
    addStudent(newStudent);
    setIsAddStudentOpen(false);
    setNewStudent({ name: '', className: '', guardianName: '', phoneNumber: '', monthlyFee: 500 });
    toast.success('Student added successfully');
  };

  const handlePayment = () => {
    if (!paymentAmount || !selectedStudent) return;
    addPayment({
      studentId: selectedStudent.id,
      amount: Number(paymentAmount),
      paymentDate: format(new Date(), 'yyyy-MM-dd'),
      month: format(new Date(), 'MMMM'),
      year: new Date().getFullYear(),
      status: Number(paymentAmount) >= selectedStudent.monthlyFee ? 'paid' : 'partial',
      method: 'cash',
    });
    const currentPaymentData = {
      studentId: selectedStudent.id,
      amount: Number(paymentAmount),
      paymentDate: format(new Date(), 'yyyy-MM-dd'),
      month: format(new Date(), 'MMMM'),
      year: new Date().getFullYear(),
      status: Number(paymentAmount) >= selectedStudent.monthlyFee ? 'paid' : 'partial',
      method: 'cash',
      studentName: selectedStudent.name,
      className: selectedStudent.className,
      guardianName: selectedStudent.guardianName
    };
    setSelectedPayment(currentPaymentData);
    setIsPaymentOpen(false);
    setPaymentAmount('');
    toast.success(`Payment of ₹${paymentAmount} received for ${selectedStudent.name}`);
    setIsReceiptOpen(true);
  };

  const handleWhatsApp = (student: any) => {
    const message = `Assalamu Alaikum, this is a reminder from Ajmeer Khaja Educational Complex regarding the pending fees of ${student.name}. Pending Amount: ₹${student.totalPending}. Please clear it at the earliest. Jazakallah.`;
    window.open(`https://wa.me/${student.phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search students..." 
            className="pl-10 h-11 bg-accent/50 border-none rounded-2xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" className="h-11 w-11 rounded-2xl border-none bg-accent/50">
          <Filter className="w-5 h-5 text-muted-foreground" />
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Student Ledger</h2>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">Managing {filteredStudents.length} students across 12 classes</p>
        </div>
        <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-bold rounded-lg px-3 py-1 border border-slate-200">
          {filteredStudents.length} Students
        </Badge>
      </div>

      <div className="space-y-3">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="font-bold text-slate-700">No students found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
              {searchQuery ? "Try adjusting your search filters." : "Tap the + button to add the first student."}
            </p>
          </div>
        ) : (
          filteredStudents.map((student, i) => (
            <motion.div
            key={student.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className={`overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all active:scale-[0.98] rounded-xl ${student.totalPending === 0 ? 'opacity-80 pb-0' : 'pb-0'}`}>
              <CardContent className="p-0">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">{student.name}</h4>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
                        {student.className} • {student.guardianName}
                      </p>
                      <p className="text-[9px] text-slate-400 mt-0.5">
                        <span className="font-medium mr-2">Paid: <span className="font-bold text-slate-600">₹{
                          student.monthlyFee - student.totalPending > 0 ? student.monthlyFee - student.totalPending : 0
                        }</span></span>
                        <span className="font-medium">Last Paid: <span className="font-bold text-slate-600">
                          {student.lastPaymentDate ? format(new Date(student.lastPaymentDate), 'dd MMM yyyy') : 'N/A'}
                        </span></span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                        {student.totalPending > 0 ? 'Pending' : 'Paid'}
                      </p>
                      <p className={`text-sm font-bold ${student.totalPending > 0 ? 'text-rose-500' : 'text-emerald-500 uppercase'}`}>
                        {student.totalPending > 0 ? `₹${student.totalPending}` : 'Settled'}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="rounded-lg h-9 w-9 border-none bg-slate-50"
                        >
                          <MoreVertical className="w-4 h-4 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 rounded-xl">
                        <DropdownMenuItem 
                          className="cursor-pointer font-medium text-xs text-sky-600 mb-1 focus:bg-sky-50 focus:text-sky-700"
                          onClick={() => {
                            setSelectedStudent(student);
                            setIsHistoryOpen(true);
                          }}
                        >
                          View History
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer font-medium text-xs"
                          onClick={() => deleteStudent(student.id)}
                        >
                          Delete Student
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="px-4 pb-4 flex items-center gap-2">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="flex-1 rounded-lg text-[10px] font-bold h-9 gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-100"
                    onClick={() => {
                      setSelectedStudent(student);
                      setIsPaymentOpen(true);
                    }}
                  >
                    <ArrowRightLeft className="w-3 h-3" />
                    {student.totalPending > 0 ? 'Recieve Fee' : 'Receipt'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-lg h-9 px-3 border-emerald-100 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-[10px] font-bold flex items-center gap-2"
                    onClick={() => handleWhatsApp(student)}
                  >
                    Remind <MessageCircle className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          ))
        )}
      </div>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/30 z-50 transition-all"
        onClick={() => setIsAddStudentOpen(true)}
      >
        <Plus className="w-6 h-6 font-bold" />
      </motion.button>

      {/* Dialogs */}
      <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-none p-6 pt-10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-primary" />
              New Student
            </DialogTitle>
            <DialogDescription className="text-xs font-medium">
              Enroll a new student to the institution ledger.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest ml-1 text-muted-foreground">Student Full Name</Label>
              <Input 
                id="name" 
                placeholder="e.g. Ahmed Raza" 
                className="h-12 rounded-2xl bg-accent/50 border-none" 
                value={newStudent.name}
                onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="class" className="text-[10px] font-bold uppercase tracking-widest ml-1 text-muted-foreground">Course / Class</Label>
              <Input 
                id="class" 
                placeholder="e.g. Degree 1st Year, Hifz" 
                className="h-12 rounded-2xl bg-accent/50 border-none" 
                value={newStudent.className}
                onChange={(e) => setNewStudent({...newStudent, className: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="guardian" className="text-[10px] font-bold uppercase tracking-widest ml-1 text-muted-foreground">Guardian Name</Label>
                <Input 
                  id="guardian" 
                  placeholder="Father/Mother" 
                  className="h-12 rounded-2xl bg-accent/50 border-none px-3"
                  value={newStudent.guardianName}
                  onChange={(e) => setNewStudent({...newStudent, guardianName: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone" className="text-[10px] font-bold uppercase tracking-widest ml-1 text-muted-foreground">Phone No (WhatsApp)</Label>
                <Input 
                  id="phone" 
                  placeholder="+91..." 
                  className="h-12 rounded-2xl bg-accent/50 border-none px-3"
                  value={newStudent.phoneNumber}
                  onChange={(e) => setNewStudent({...newStudent, phoneNumber: e.target.value})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button className="w-full h-12 rounded-2xl font-bold text-base shadow-xl shadow-primary/20" onClick={handleAddStudent}>
              Enroll Student
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-none p-6 pt-10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Wallet className="w-6 h-6 text-primary" />
              Collect Fees
            </DialogTitle>
            <DialogDescription className="text-xs font-medium">
              Recording payment for <span className="text-primary font-bold">{selectedStudent?.name}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-6">
            <div className="bg-primary/5 rounded-3xl p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Monthly Fee</p>
                <p className="text-xl font-black">₹{selectedStudent?.monthlyFee}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Pending</p>
                <p className="text-xl font-black text-destructive">₹{selectedStudent?.totalPending}</p>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest ml-1 text-muted-foreground">Amount Paid Today</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-primary">₹</span>
                <Input 
                  type="number" 
                  placeholder="0.00" 
                  className="h-16 pl-10 text-2xl font-black rounded-3xl bg-accent/50 border-none"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-11 rounded-xl border-none bg-accent/50 font-bold" onClick={() => setPaymentAmount(String(selectedStudent?.monthlyFee))}>
                Full Fee
              </Button>
              <Button variant="outline" className="h-11 rounded-xl border-none bg-accent/50 font-bold" onClick={() => setPaymentAmount(String(selectedStudent?.totalPending))}>
                Total Due
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button className="w-full h-12 rounded-2xl font-bold text-base shadow-xl shadow-primary/20" onClick={handlePayment}>
              Confirm Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-none p-6 pt-10 h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Payment History
            </DialogTitle>
            <DialogDescription className="text-xs font-medium">
              Transaction records for <span className="text-primary font-bold">{selectedStudent?.name}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-2">
            {payments.filter(p => p.studentId === selectedStudent?.id).length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <p className="text-xs font-medium">No payment history found.</p>
              </div>
            ) : (
              payments.filter(p => p.studentId === selectedStudent?.id).sort((a,b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()).map(payment => (
                <div key={payment.id} className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{format(new Date(payment.paymentDate), 'dd MMM yyyy')}</p>
                    <Badge variant="outline" className={`${payment.status === 'paid' ? 'border-emerald-200 text-emerald-600 bg-emerald-50' : 'border-amber-200 text-amber-600 bg-amber-50'} text-[9px] uppercase font-bold`}>{payment.status}</Badge>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-lg font-black text-slate-800">₹{payment.amount}</p>
                      <p className="text-[10px] font-medium text-slate-500 mt-0.5">Method: {payment.method}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold text-sky-600 px-2" onClick={() => {
                        setSelectedPayment({
                          ...payment,
                          studentName: selectedStudent?.name,
                          className: selectedStudent?.className,
                          guardianName: selectedStudent?.guardianName
                        });
                        setIsHistoryOpen(false);
                        setIsReceiptOpen(true);
                      }}>
                      View Receipt
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-none p-6 pt-10">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ReceiptText className="w-5 h-5 text-primary" />
                Digital Receipt
              </span>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => {
                // simple print
                window.print();
              }}>
                <Printer className="w-4 h-4 text-slate-500" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative overflow-hidden" id="receipt-content">
            <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
            <div className="text-center mb-6">
              <h2 className="text-lg font-black text-slate-800 leading-none">Ajmeer Khaja</h2>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Educational Complex</p>
            </div>
            
            <div className="space-y-4 mb-6 relative z-10">
              <div className="flex justify-between items-center pb-3 border-b border-dashed border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Receipt No.</span>
                <span className="text-xs font-bold text-slate-800">#{selectedPayment?.id?.toUpperCase() || 'NEW'}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-dashed border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Date</span>
                <span className="text-xs font-bold text-slate-800">{selectedPayment?.paymentDate ? format(new Date(selectedPayment?.paymentDate), 'dd MMM yyyy') : ''}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-dashed border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Student Name</span>
                <span className="text-xs font-bold text-slate-800">{selectedPayment?.studentName}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-dashed border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Course/Class</span>
                <span className="text-xs font-bold text-slate-800">{selectedPayment?.className}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Amount Paid</span>
                <span className="text-lg font-black text-primary">₹{selectedPayment?.amount}</span>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <div className="p-2 bg-white rounded-xl border border-slate-100 shadow-sm">
                <QRCode value={`Receipt:${selectedPayment?.id}|Amount:${selectedPayment?.amount}|Student:${selectedPayment?.studentName}`} size={80} level="L" />
              </div>
            </div>
            <p className="text-center text-[8px] font-bold text-slate-400 mt-3 uppercase tracking-widest">Scan to verify</p>
          </div>
          <DialogFooter className="mt-2">
            <Button className="w-full h-12 rounded-2xl font-bold text-sm bg-slate-100 hover:bg-slate-200 text-slate-700" onClick={() => setIsReceiptOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
