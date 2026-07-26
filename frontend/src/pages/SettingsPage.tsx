import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserButton, useUser } from '@clerk/clerk-react';
import { 
  User, Building, Lock, Bell, CreditCard, Shield, 
  HelpCircle, LogOut, ChevronRight
} from 'lucide-react';

export default function SettingsPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'business', label: 'Business Details', icon: Building },
    { id: 'security', label: 'Security & Auth', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account preferences and configurations</p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-1">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-colors
                ${activeTab === tab.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'}`}>
              <div className="flex items-center gap-3">
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === tab.id ? 'translate-x-1' : 'opacity-0'}`} />
            </button>
          ))}

          <div className="pt-4 mt-4 border-t border-border/50 space-y-1">
            <button className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
              <HelpCircle className="w-4 h-4" /> Support & Help
            </button>
            <div className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium hover:bg-red-50 text-red-600 transition-colors cursor-pointer">
               {/* Clerk provides its own logout in UserButton, this is just for UI consistency if needed */}
               <LogOut className="w-4 h-4" /> Sign Out
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            
            {activeTab === 'profile' && (
              <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">Profile Information</h3>
                  <p className="text-sm text-muted-foreground">Update your personal details here.</p>
                </div>
                
                <div className="flex items-center gap-4 py-4 border-y border-border/50">
                  <UserButton appearance={{ elements: { avatarBox: "w-16 h-16" } }} />
                  <div>
                    <div className="font-medium">{user?.fullName || 'User'}</div>
                    <div className="text-sm text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</div>
                  </div>
                  <button className="ml-auto px-4 py-2 text-sm font-medium border border-border rounded-xl hover:bg-muted/50 transition-colors">
                    Manage Account
                  </button>
                </div>

                <div className="grid gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Full Name</label>
                    <input type="text" defaultValue={user?.fullName || ''} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Email Address</label>
                    <input type="email" defaultValue={user?.primaryEmailAddress?.emailAddress || ''} disabled className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/50 text-muted-foreground text-sm cursor-not-allowed" />
                  </div>
                  <div className="pt-2">
                    <button className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:opacity-90 transition-opacity">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-6">
                 <div>
                  <h3 className="text-lg font-semibold">Security & Authentication</h3>
                  <p className="text-sm text-muted-foreground">Manage your password and security settings.</p>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/20">
                  <div className="flex items-center gap-3">
                    <Shield className="w-8 h-8 text-emerald-500" />
                    <div>
                      <div className="font-medium text-sm">Two-Factor Authentication</div>
                      <div className="text-xs text-muted-foreground">Add an extra layer of security</div>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-sm font-medium bg-foreground text-background rounded-xl">Enable</button>
                </div>
              </div>
            )}

            {/* Other tabs placeholders */}
            {['business', 'notifications', 'billing'].includes(activeTab) && (
              <div className="rounded-2xl border border-border/50 bg-card p-6 text-center py-12">
                <h3 className="text-lg font-semibold mb-1">Coming Soon</h3>
                <p className="text-sm text-muted-foreground">This section is currently under development.</p>
              </div>
            )}

          </motion.div>
        </div>
      </div>
    </div>
  );
}
