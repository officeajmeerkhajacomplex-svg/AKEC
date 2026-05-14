import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck, Phone, KeyRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function Auth() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!phoneNumber) {
      toast.error('Please enter a valid phone number');
      return;
    }
    
    setIsLoading(true);
    try {
      if (supabase) {
        const { error } = await supabase.auth.signInWithOtp({
          phone: phoneNumber.includes('+') ? phoneNumber : `+91${phoneNumber}`,
        });
        if (error) throw error;
      } else {
        // Mock behavior
        await new Promise(res => setTimeout(res, 1000));
        console.warn('Supabase not configured, using mock OTP');
      }
      setIsOtpSent(true);
      toast.success('OTP sent to your phone');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error('Please enter the OTP');
      return;
    }

    setIsLoading(true);
    try {
      if (supabase) {
        const { error } = await supabase.auth.verifyOtp({
          phone: phoneNumber.includes('+') ? phoneNumber : `+91${phoneNumber}`,
          token: otp,
          type: 'sms',
        });
        if (error) throw error;
        toast.success('Successfully logged in');
        navigate('/');
      } else {
        // Mock behavior
        await new Promise(res => setTimeout(res, 1000));
        toast.success('Mock login successful');
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="absolute inset-0 islamic-pattern opacity-10" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-4 border-2 border-primary/20">
            <ShieldCheck className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-primary leading-none">Ajmeer Khaja</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">
            Professional Portal
          </p>
        </div>

        <Card className="border border-slate-200 shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white">
          <CardHeader className="pb-2 text-center">
            <CardTitle className="text-xl font-bold text-slate-800">
              {isOtpSent ? 'Verify OTP' : 'Staff Login'}
            </CardTitle>
            <CardDescription className="text-xs font-medium text-slate-400">
              {isOtpSent 
                ? `Enter the 6-digit code sent to ${phoneNumber}` 
                : 'Enter your phone number to continue'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {!isOtpSent ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[9px] font-bold uppercase tracking-widest ml-1 text-slate-400">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      id="phone" 
                      type="tel"
                      placeholder="9876543210" 
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="pl-11 h-12 rounded-2xl bg-slate-50 border-slate-200 text-sm font-medium focus:bg-white"
                    />
                  </div>
                </div>

                <Button 
                  disabled={isLoading}
                  onClick={handleSendOtp}
                  className="w-full h-12 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 mt-4 bg-primary hover:bg-primary/90 transition-all hover:translate-y-[-2px]"
                >
                  {isLoading ? 'Sending...' : 'Send OTP'}
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-[9px] font-bold uppercase tracking-widest ml-1 text-slate-400">
                    One-Time Password
                  </Label>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      id="otp" 
                      type="text"
                      maxLength={6}
                      placeholder="XXXXXX" 
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="pl-11 h-12 rounded-2xl bg-slate-50 border-slate-200 text-sm font-medium focus:bg-white tracking-widest"
                    />
                  </div>
                </div>

                <Button 
                  disabled={isLoading}
                  onClick={handleVerifyOtp}
                  className="w-full h-12 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 mt-4 bg-primary hover:bg-primary/90 transition-all hover:translate-y-[-2px]"
                >
                  {isLoading ? 'Verifying...' : 'Access Dashboard'}
                </Button>
                
                <div className="pt-2 text-center">
                  <Button 
                    variant="link" 
                    onClick={() => {
                      setIsOtpSent(false);
                      setOtp('');
                    }}
                    className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
                  >
                    Change Phone Number
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <p className="mt-12 text-center text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
          © 2026 AJMEER KHAJA EDUCATIONAL COMPLEX
        </p>
      </motion.div>
    </div>
  );
}
