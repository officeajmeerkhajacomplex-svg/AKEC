import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, ExternalLink, Mail, Globe, Lock } from "lucide-react";

export default function PrivacySecurity() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-snow dark:bg-[#121212] transition-colors duration-300">
      {/* Header */}
      <div className="bg-header-bg text-header-text pt-14 pb-12 px-6 relative rounded-b-[3rem] shadow-xl overflow-hidden border-b border-gray-100 dark:border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-dodger/5 to-transparent opacity-60"></div>
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-dodger/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-3 bg-white/40 dark:bg-white/10 rounded-2xl active:scale-90 transition-all text-header-text backdrop-blur-md border border-white/20 shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-black tracking-tight text-header-text drop-shadow-sm">Privacy & Security</h1>
        </div>
      </div>

      <div className="px-6 py-8 space-y-8 flex-1">
        {/* Paragraph section */}
        <div className="bg-white dark:bg-[#1C1C1C] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="w-12 h-12 bg-dodger/10 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-dodger" />
            </div>
            <h2 className="text-lg font-black text-gray-900 dark:text-snow mb-4 uppercase tracking-tight">Our Commitment</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                AKEC LEDGER is designed with the highest respect for data privacy and local security for our Ustads.
                All student transaction records, names, and contact details are stored securely. We do not share your
                ledger data with any third-party organizations or marketing agencies. The application uses modern
                encryption standards to ensure that your school's financial records remain private and accessible only to you.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium mt-4">
                We believe in transparency and trustworthiness, reflecting the spiritual values of Ajmeer Khaja Educational Complex.
                Your data is managed with integrity, ensuring a fast and reliable experience for your daily digital ledger needs.
            </p>
        </div>

        {/* Security section */}
        <div className="bg-white dark:bg-[#1C1C1C] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Lock className="w-6 h-6 text-emerald-500" />
            </div>
            <h2 className="text-lg font-black text-gray-900 dark:text-snow mb-4 uppercase tracking-tight">Data Security</h2>
            <ul className="space-y-4">
                <li className="flex gap-3 items-start text-sm text-gray-500 dark:text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-dodger mt-1.5 shrink-0" />
                    <span>Real-time local storage and cloud synchronization (when configured) ensures data persistency.</span>
                </li>
                <li className="flex gap-3 items-start text-sm text-gray-500 dark:text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-dodger mt-1.5 shrink-0" />
                    <span>Secure authentication via phone number OTP (One-Time Password) prevents unauthorized access.</span>
                </li>
            </ul>
        </div>

        {/* Developer link */}
        <div className="bg-white dark:bg-[#1C1C1C] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-sm font-black text-gray-400 dark:text-gray-500 mb-6 uppercase tracking-[0.2em]">Developer Support</h2>
            <div className="flex flex-col gap-4">
                <a 
                    href="https://liyaqat-dev.github.io/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-dodger/5 rounded-2xl border border-dodger/10 hover:bg-dodger/10 transition-colors group"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-dodger rounded-xl flex items-center justify-center text-snow">
                            <Globe className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-dodger uppercase tracking-widest leading-none mb-1">Contact Developer</p>
                            <p className="text-sm font-bold text-gray-800 dark:text-snow">liyaqat-dev.github.io</p>
                        </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-dodger group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
            </div>
        </div>
      </div>

      <div className="p-8 text-center">
         <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Ajmeer Khaja Educational Complex</p>
      </div>
    </div>
  );
}
