import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Megaphone, Users, MessageSquare, Bell,
  BarChart3, Settings, Sparkles, ChevronLeft, Search, Menu, Plus, UserCheck
} from 'lucide-react';
import RoleSelectionModal from '../components/RoleSelectionModal';

const businessNav = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Campaigns', icon: Megaphone, path: '/dashboard/campaigns' },
  { label: 'Discover Creators', icon: Users, path: '/dashboard/creators' },
  { label: 'Applications', icon: Sparkles, path: '/dashboard/applications' },
  { label: 'Messages', icon: MessageSquare, path: '/dashboard/messages' },
  { label: 'Analytics', icon: BarChart3, path: '/dashboard/analytics' },
  { label: 'Notifications', icon: Bell, path: '/dashboard/notifications' },
  { label: 'Settings', icon: Settings, path: '/dashboard/settings' },
];

const creatorNav = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Browse Sponsorships', icon: Megaphone, path: '/dashboard/campaigns' },
  { label: 'My Applications', icon: Sparkles, path: '/dashboard/applications' },
  { label: 'Messages', icon: MessageSquare, path: '/dashboard/messages' },
  { label: 'My Profile', icon: UserCheck, path: '/dashboard/settings' },
  { label: 'Notifications', icon: Bell, path: '/dashboard/notifications' },
  { label: 'Settings', icon: Settings, path: '/dashboard/settings' },
];

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user } = useUser();

  const [role, setRole] = useState<'BUSINESS' | 'CREATOR' | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  useEffect(() => {
    // 1. Check Clerk metadata
    const metadataRole = user?.unsafeMetadata?.role as 'BUSINESS' | 'CREATOR' | undefined;
    if (metadataRole) {
      setRole(metadataRole);
      localStorage.setItem('promobridge_user_role', metadataRole);
      return;
    }

    // 2. Check localStorage
    const savedRole = localStorage.getItem('promobridge_user_role') as 'BUSINESS' | 'CREATOR' | null;
    if (savedRole) {
      setRole(savedRole);
      return;
    }

    // 3. Show Role Selection Modal if missing
    setShowRoleModal(true);
  }, [user]);

  const navItems = role === 'CREATOR' ? creatorNav : businessNav;

  return (
    <div className="min-h-screen bg-background flex">
      {/* First-time Role Selection Modal */}
      {showRoleModal && (
        <RoleSelectionModal
          onSelectRole={(selectedRole) => {
            setRole(selectedRole);
            setShowRoleModal(false);
          }}
        />
      )}

      {/* Sidebar — Desktop */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        className="hidden lg:flex flex-col border-r border-border/50 bg-card/50 backdrop-blur-xl fixed inset-y-0 left-0 z-40"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-border/50">
          <div className="w-8 h-8 rounded-lg animated-gradient flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight font-['Space_Grotesk'] leading-none">
                PromoBridge
              </span>
              <span className="text-[10px] font-semibold text-primary uppercase tracking-wider mt-1">
                {role === 'CREATOR' ? 'Creator Suite' : 'Business Suite'}
              </span>
            </div>
          )}
        </div>

        {/* Quick Action Button */}
        <div className="px-3 py-4">
          {role === 'CREATOR' ? (
            <Link to="/dashboard/campaigns"
              className={`flex items-center gap-2 rounded-xl bg-primary text-primary-foreground font-medium text-sm transition-all hover:opacity-90 shadow-lg shadow-primary/20 ${collapsed ? 'justify-center p-3' : 'px-4 py-3'}`}>
              <Sparkles className="w-4 h-4" />
              {!collapsed && <span>Find Sponsorships</span>}
            </Link>
          ) : (
            <Link to="/dashboard/campaigns/new"
              className={`flex items-center gap-2 rounded-xl bg-primary text-primary-foreground font-medium text-sm transition-all hover:opacity-90 shadow-lg shadow-primary/20 ${collapsed ? 'justify-center p-3' : 'px-4 py-3'}`}>
              <Plus className="w-4 h-4" />
              {!collapsed && <span>New Campaign</span>}
            </Link>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path + item.label} to={item.path}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all relative
                  ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}
                  ${collapsed ? 'justify-center' : ''}`}>
                <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Role Switcher / Collapse Button */}
        <div className="p-3 border-t border-border/50 space-y-2">
          {!collapsed && (
            <button
              onClick={() => setShowRoleModal(true)}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg w-full hover:bg-muted/40 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" /> Switch Account Role ({role})
            </button>
          )}
          <button onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all w-full">
            <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-card border-r border-border z-50 lg:hidden p-4 space-y-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg animated-gradient flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold font-['Space_Grotesk']">PromoBridge</span>
              </div>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path + item.label} to={item.path} onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all
                      ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}>
                    <item.icon className="w-[18px] h-[18px]" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all ${collapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]'}`}>
        {/* Top Bar */}
        <header className="h-16 border-b border-border/50 bg-background/80 backdrop-blur-xl flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground">
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-muted/50 rounded-xl px-4 py-2 w-[280px]">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input type="text" placeholder="Search campaigns, creators..." className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              {role === 'CREATOR' ? 'Creator Account' : 'Business Account'}
            </span>
            <button className="relative p-2 rounded-xl hover:bg-muted/50 transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </button>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: 'w-8 h-8',
                },
              }}
            />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <Outlet context={{ role }} />
        </main>
      </div>
    </div>
  );
}
