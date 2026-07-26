import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Megaphone, Users, MessageSquare, Bell, Bookmark,
  BarChart3, Settings, Sparkles, ChevronLeft, Search, Menu, Plus
} from 'lucide-react';

const businessNav = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Campaigns', icon: Megaphone, path: '/dashboard/campaigns' },
  { label: 'Discover Creators', icon: Users, path: '/dashboard/creators' },
  { label: 'Applications', icon: Sparkles, path: '/dashboard/applications' },
  { label: 'Messages', icon: MessageSquare, path: '/dashboard/messages', badge: 3 },
  { label: 'Saved Creators', icon: Bookmark, path: '/dashboard/bookmarks' },
  { label: 'Analytics', icon: BarChart3, path: '/dashboard/analytics' },
  { label: 'Notifications', icon: Bell, path: '/dashboard/notifications', badge: 5 },
  { label: 'Settings', icon: Settings, path: '/dashboard/settings' },
];

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user: _user } = useUser();

  const navItems = businessNav; // TODO: switch based on role

  return (
    <div className="min-h-screen bg-background flex">
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
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lg font-bold tracking-tight font-['Space_Grotesk']">
              PromoBridge
            </motion.span>
          )}
        </div>

        {/* Quick Action */}
        <div className="px-3 py-4">
          <Link to="/dashboard/campaigns/new"
            className={`flex items-center gap-2 rounded-xl bg-primary text-primary-foreground font-medium text-sm transition-all hover:opacity-90 shadow-lg shadow-primary/20 ${collapsed ? 'justify-center p-3' : 'px-4 py-3'}`}>
            <Plus className="w-4 h-4" />
            {!collapsed && <span>New Campaign</span>}
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all relative
                  ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}
                  ${collapsed ? 'justify-center' : ''}`}>
                <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
                {item.badge && (
                  <span className={`${collapsed ? 'absolute -top-1 -right-1' : 'ml-auto'} bg-primary text-primary-foreground text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Button */}
        <div className="p-3 border-t border-border/50">
          <button onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all w-full">
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
                  <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}
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
          <Outlet />
        </main>
      </div>
    </div>
  );
}
