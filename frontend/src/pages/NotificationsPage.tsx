import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2, Megaphone, MessageSquare, Star, UserPlus,
  Sparkles, X, Check, BellOff
} from 'lucide-react';

type NotifType = 'application' | 'accepted' | 'rejected' | 'message' | 'invitation' | 'ai' | 'verified';

interface Notif {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const notifConfig: Record<NotifType, { icon: React.ElementType; gradient: string }> = {
  application: { icon: Megaphone, gradient: 'from-violet-500 to-purple-600' },
  accepted: { icon: CheckCircle2, gradient: 'from-emerald-500 to-green-600' },
  rejected: { icon: X, gradient: 'from-red-500 to-rose-600' },
  message: { icon: MessageSquare, gradient: 'from-cyan-500 to-blue-600' },
  invitation: { icon: UserPlus, gradient: 'from-amber-500 to-orange-600' },
  ai: { icon: Sparkles, gradient: 'from-indigo-500 to-violet-600' },
  verified: { icon: Star, gradient: 'from-yellow-500 to-amber-600' },
};

const mockNotifications: Notif[] = [
  { id: '1', type: 'application', title: 'New Application', message: 'Ananya Verma applied to your "Summer Fashion Lookbook" campaign', time: '2 min ago', read: false },
  { id: '2', type: 'ai', title: 'AI Recommendation', message: '5 new creators match your campaign preferences with 90%+ scores', time: '15 min ago', read: false },
  { id: '3', type: 'message', title: 'New Message', message: 'Karthik Rajan sent you a message about the collaboration details', time: '1 hour ago', read: false },
  { id: '4', type: 'accepted', title: 'Application Accepted', message: 'Your application to "Tech Gadget Review" has been accepted!', time: '3 hours ago', read: true },
  { id: '5', type: 'invitation', title: 'Campaign Invitation', message: 'FitZone Gym invited you to their "New Year Challenge" campaign', time: '5 hours ago', read: true },
  { id: '6', type: 'verified', title: 'Profile Verified', message: 'Congratulations! Your profile has been verified successfully', time: '1 day ago', read: true },
  { id: '7', type: 'rejected', title: 'Application Update', message: 'Your application to "Food Festival Promo" was not selected', time: '2 days ago', read: true },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications(notifications.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : 'You\'re all caught up!'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-border overflow-hidden">
            <button onClick={() => setFilter('all')} className={`px-4 py-2 text-sm font-medium transition-colors ${filter === 'all' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/50'}`}>All</button>
            <button onClick={() => setFilter('unread')} className={`px-4 py-2 text-sm font-medium transition-colors ${filter === 'unread' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/50'}`}>Unread ({unreadCount})</button>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
              <Check className="w-3.5 h-3.5" /> Mark all read
            </button>
          )}
        </div>
      </motion.div>

      {/* Notification List */}
      <div className="space-y-2">
        {filtered.map((notif, i) => {
          const config = notifConfig[notif.type];
          const Icon = config.icon;
          return (
            <motion.div key={notif.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              onClick={() => markRead(notif.id)}
              className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer
                ${notif.read ? 'border-border/30 bg-card hover:bg-muted/20' : 'border-primary/20 bg-primary/[0.02] hover:bg-primary/[0.04] shadow-sm'}`}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{notif.title}</span>
                  {!notif.read && <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{notif.message}</p>
                <span className="text-xs text-muted-foreground mt-1 block">{notif.time}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center py-16 rounded-2xl border border-dashed border-border">
          <BellOff className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-1">No notifications</h3>
          <p className="text-muted-foreground text-sm">{filter === 'unread' ? 'All caught up! No unread notifications.' : 'You don\'t have any notifications yet.'}</p>
        </motion.div>
      )}
    </div>
  );
}
