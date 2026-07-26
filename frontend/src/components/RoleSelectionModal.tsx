import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { Building2, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

interface RoleSelectionModalProps {
  onSelectRole: (role: 'BUSINESS' | 'CREATOR') => void;
}

export default function RoleSelectionModal({ onSelectRole }: RoleSelectionModalProps) {
  const { user } = useUser();
  const [selectedRole, setSelectedRole] = useState<'BUSINESS' | 'CREATOR' | null>(null);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!selectedRole) return;
    setLoading(true);

    try {
      if (user) {
        await user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            role: selectedRole
          }
        });
      }

      localStorage.setItem('promobridge_user_role', selectedRole);
      toast.success(`Welcome! Account configured as ${selectedRole === 'BUSINESS' ? 'Business' : 'Creator'}.`);
      onSelectRole(selectedRole);
    } catch {
      localStorage.setItem('promobridge_user_role', selectedRole);
      onSelectRole(selectedRole);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl rounded-3xl border border-border/50 bg-card p-6 md:p-8 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Choose Your Account Type</h2>
          <p className="text-sm text-muted-foreground">Select how you plan to use Collably AI (PromoBridge). Your dashboard will be customized accordingly.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Business Option */}
          <div
            onClick={() => setSelectedRole('BUSINESS')}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-3 relative ${selectedRole === 'BUSINESS' ? 'border-primary bg-primary/5 shadow-md' : 'border-border/50 hover:border-border hover:bg-muted/30'}`}
          >
            {selectedRole === 'BUSINESS' && (
              <CheckCircle2 className="w-5 h-5 text-primary absolute top-4 right-4" />
            )}
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Business Account</h3>
              <p className="text-xs text-muted-foreground mt-1">Post campaigns, discover content creators, review proposals, and measure ROI.</p>
            </div>
          </div>

          {/* Creator Option */}
          <div
            onClick={() => setSelectedRole('CREATOR')}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-3 relative ${selectedRole === 'CREATOR' ? 'border-primary bg-primary/5 shadow-md' : 'border-border/50 hover:border-border hover:bg-muted/30'}`}
          >
            {selectedRole === 'CREATOR' && (
              <CheckCircle2 className="w-5 h-5 text-primary absolute top-4 right-4" />
            )}
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Creator Account</h3>
              <p className="text-xs text-muted-foreground mt-1">Browse brand sponsorships, submit campaign applications, and track earnings.</p>
            </div>
          </div>
        </div>

        <button
          disabled={!selectedRole || loading}
          onClick={handleConfirm}
          className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
        >
          {loading ? 'Setting up account...' : 'Continue to Dashboard'} <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}
