import { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '@/lib/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Megaphone, Calendar, Bookmark, BellRing, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from 'sonner';

export function Notices() {
  const { notices, addNotice, role } = useApp();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    type: 'general' as any,
    authorId: 'admin'
  });

  const typeIcons: Record<string, any> = {
    event: Calendar,
    ramadan: BellRing,
    holiday: Bookmark,
    exam: Bookmark,
    general: Megaphone,
  };

  const handleAddNotice = () => {
    if (!newNotice.title || !newNotice.content) {
      toast.error('Please fill in title and content');
      return;
    }
    addNotice(newNotice);
    setIsAddOpen(false);
    setNewNotice({ title: '', content: '', type: 'general', authorId: 'admin' });
    toast.success('Notice published successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Notice Board</h2>
        {role === 'super_admin' && (
          <Button 
            size="icon" 
            className="rounded-2xl h-11 w-11 shadow-lg shadow-primary/20"
            onClick={() => setIsAddOpen(true)}
          >
            <Plus className="w-6 h-6" />
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-accent/50 rounded-2xl p-1 h-12 w-full grid grid-cols-3">
          <TabsTrigger value="all" className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm">All</TabsTrigger>
          <TabsTrigger value="events" className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm">Events</TabsTrigger>
          <TabsTrigger value="updates" className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm">Updates</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        {notices.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
              <Megaphone className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="font-bold text-slate-700">No Announcements</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-[220px]">
              {role === 'super_admin' ? 'Tap the + button to post a new notice.' : 'You will see new announcements here.'}
            </p>
          </div>
        ) : (
          notices.map((notice, i) => {
          const Icon = typeIcons[notice.type] || Megaphone;
          return (
            <motion.div
              key={notice.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-none shadow-sm overflow-hidden bg-gradient-to-br from-card to-secondary/20 rounded-3xl">
                <CardContent className="p-5">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest h-5 px-2 border-primary/20 text-primary rounded-lg">
                          {notice.type}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground font-medium">
                          {format(new Date(notice.publishDate), 'MMM dd')}
                        </span>
                      </div>
                      <h3 className="font-bold text-base leading-snug">{notice.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {notice.content}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <Button variant="secondary" className="w-full rounded-2xl h-11 text-xs font-bold bg-primary/5 hover:bg-primary/10 text-primary border-none">
                      Read Details
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-2xl h-11 w-11 border-none bg-accent/50">
                      <Bookmark className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })
        )}
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-none p-6 pt-10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Megaphone className="w-6 h-6 text-primary" />
              New Notice
            </DialogTitle>
            <DialogDescription className="text-xs font-medium">
              Post an announcement for staff and parents.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest ml-1 text-muted-foreground">Notice Title</Label>
              <Input 
                placeholder="e.g. Ramadan Break" 
                className="h-12 rounded-2xl bg-accent/50 border-none"
                value={newNotice.title}
                onChange={(e) => setNewNotice({...newNotice, title: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest ml-1 text-muted-foreground">Category</Label>
              <Select 
                value={newNotice.type} 
                onValueChange={(val) => setNewNotice({...newNotice, type: val})}
              >
                <SelectTrigger className="h-12 rounded-2xl bg-accent/50 border-none">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-xl">
                  {['event', 'holiday', 'exam', 'ramadan', 'general'].map(t => (
                    <SelectItem key={t} value={t} className="rounded-xl capitalize">{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest ml-1 text-muted-foreground">Content</Label>
              <textarea 
                placeholder="Details of the announcement..."
                className="min-h-[120px] p-4 rounded-2xl bg-accent/50 border-none resize-none text-sm font-medium"
                value={newNotice.content}
                onChange={(e) => setNewNotice({...newNotice, content: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button className="w-full h-12 rounded-2xl font-bold text-base shadow-xl shadow-primary/20" onClick={handleAddNotice}>
              Publish Notice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
