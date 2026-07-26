import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Megaphone, Target, CheckCircle2, Wallet, MessageSquare,
  ArrowUpRight, ArrowDownRight, Sparkles, Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../api/client';

function StatCard({ icon: Icon, label, value, trend, trendUp, gradient, to }: {
  icon: React.ElementType; label: string; value: string | number; trend: string; trendUp: boolean; gradient: string; to?: string;
}) {
  const content = (
    <div className="group p-5 rounded-2xl border border-border/50 bg-card hover:shadow-lg hover:border-primary/20 transition-all cursor-pointer block h-full">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${trendUp ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
          {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </span>
      </div>
      <div className="text-2xl font-bold tracking-tight">{value}</div>
      <div className="text-xs text-muted-foreground mt-1 flex items-center justify-between">
        <span>{label}</span>
        <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
      </div>
    </div>
  );

  return to ? <Link to={to}>{content}</Link> : content;
}

interface CampaignItem {
  id: string;
  title: string;
  category?: string;
  budgetMax?: number;
  businessName?: string;
}

export default function CreatorDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const res = await fetch(`${API_BASE_URL}/discovery/campaigns`).catch(() => null);
        if (res && res.ok) {
          const json = await res.json();
          setCampaigns(json.data || json.content || json || []);
        }
      } catch {
        // quiet fallback
      } finally {
        setLoading(false);
      }
    }
    fetchCampaigns();
  }, []);

  const stats = [
    { icon: Megaphone, label: 'Available Campaigns', value: campaigns.length, trend: 'Database live', trendUp: true, gradient: 'from-violet-500 to-purple-600', to: '/dashboard/campaigns' },
    { icon: Target, label: 'Applied Campaigns', value: 0, trend: 'Your submissions', trendUp: true, gradient: 'from-cyan-500 to-blue-600', to: '/dashboard/applications' },
    { icon: CheckCircle2, label: 'Accepted Sponsorships', value: 0, trend: 'Active', trendUp: true, gradient: 'from-emerald-500 to-green-600', to: '/dashboard/applications' },
    { icon: Wallet, label: 'Earnings', value: '₹0', trend: 'Payouts', trendUp: true, gradient: 'from-amber-500 to-orange-600', to: '/dashboard/analytics' },
    { icon: MessageSquare, label: 'Unread Messages', value: 0, trend: 'Direct chats', trendUp: false, gradient: 'from-rose-500 to-pink-600', to: '/dashboard/messages' },
    { icon: Sparkles, label: 'Profile Health', value: '100%', trend: 'Active', trendUp: true, gradient: 'from-indigo-500 to-violet-600', to: '/dashboard/settings' },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Creator Dashboard 🎨</h1>
          <p className="text-muted-foreground text-sm mt-1">Discover brand sponsorships and manage your applications.</p>
        </div>
        <Link to="/dashboard/campaigns"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-lg shadow-primary/20">
          <Eye className="w-4 h-4" /> Browse Sponsorships
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Live Campaigns from Database */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="rounded-2xl border border-border/50 bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" /> Live Sponsorship Opportunities ({campaigns.length})
          </h2>
          <Link to="/dashboard/campaigns" className="text-xs text-primary font-medium hover:underline">View all</Link>
        </div>

        {loading ? (
          <div className="text-center py-8 text-sm text-muted-foreground">Loading sponsorships...</div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">No active campaigns in database yet. Check back soon!</div>
        ) : (
          <div className="space-y-3">
            {campaigns.slice(0, 5).map((c) => (
              <div key={c.id} className="flex items-center gap-4 p-4 rounded-xl border border-border/30 hover:border-primary/20 hover:shadow-sm transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-lg font-bold text-primary flex-shrink-0">
                  {c.title ? c.title.charAt(0) : 'S'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{c.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{c.category || 'General'} · Budget up to ₹{c.budgetMax ? c.budgetMax.toLocaleString() : 'Negotiable'}</div>
                </div>
                <Link to={`/dashboard/campaigns/${c.id}`} className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary hover:text-primary-foreground transition-all">
                  Apply Now
                </Link>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
