import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Megaphone, Target, CheckCircle2, Wallet, MessageSquare,
  ArrowUpRight, ArrowDownRight, Sparkles, Eye, IndianRupee
} from 'lucide-react';
import { Link } from 'react-router-dom';

const BASE = 'https://promobridge-api.onrender.com/api';

function StatCard({ icon: Icon, label, value, trend, trendUp, gradient, to }: {
  icon: React.ElementType; label: string; value: string | number; trend: string; trendUp: boolean; gradient: string; to?: string;
}) {
  const content = (
    <div className="group p-5 rounded-2xl border border-border/50 bg-card hover:shadow-lg hover:border-primary/20 transition-all cursor-pointer block h-full">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center group-hover:scale-105 transition-transform`}>
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
  budget?: number;
  creatorCategory?: string;
}

export default function CreatorDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const res = await fetch(`${BASE}/discovery/campaigns?page=0&size=100`).catch(() => null);
        if (res && res.ok) {
          const json = await res.json();
          setCampaigns(json?.data?.content ?? json?.content ?? []);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchCampaigns();
  }, []);

  const stats = [
    { icon: Megaphone,    label: 'Open Sponsorships',    value: loading ? '—' : campaigns.length, trend: 'Apply now',    trendUp: true,  gradient: 'from-violet-500 to-purple-600', to: '/dashboard/campaigns' },
    { icon: Target,       label: 'My Applications',      value: 0,                               trend: 'Submitted',    trendUp: true,  gradient: 'from-cyan-500 to-blue-600',     to: '/dashboard/applications' },
    { icon: CheckCircle2, label: 'Accepted Deals',        value: 0,                               trend: 'Active',       trendUp: true,  gradient: 'from-emerald-500 to-green-600', to: '/dashboard/applications' },
    { icon: Wallet,       label: 'Estimated Earnings',   value: '₹0',                            trend: 'This month',   trendUp: true,  gradient: 'from-amber-500 to-orange-600',  to: '/dashboard/analytics' },
    { icon: MessageSquare,label: 'Messages',              value: 0,                               trend: 'Unread',       trendUp: false, gradient: 'from-rose-500 to-pink-600',     to: '/dashboard/messages' },
    { icon: Sparkles,     label: 'Profile Score',        value: '100%',                          trend: 'Excellent',    trendUp: true,  gradient: 'from-indigo-500 to-violet-600', to: '/dashboard/settings' },
  ];

  return (
    <div className="space-y-8 max-w-7xl">

      {/* ── Welcome ─────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome back 👋</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Explore brand campaigns and grow your income as a creator.
          </p>
        </div>
        <Link to="/dashboard/campaigns"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/20">
          <Eye className="w-4 h-4" /> Find Sponsorships
        </Link>
      </motion.div>

      {/* ── Stats ───────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* ── Open Sponsorship Opportunities ──────── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="rounded-2xl border border-border/50 bg-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Open Brand Sponsorships
          </h2>
          <Link to="/dashboard/campaigns" className="text-xs text-primary font-semibold hover:underline">
            Browse all {campaigns.length > 0 ? `(${campaigns.length})` : ''}
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-10 gap-2">
            <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-primary" />
            <p className="text-xs text-muted-foreground">Fetching campaigns…</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-10">
            <Megaphone className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No open sponsorships at the moment. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {campaigns.slice(0, 5).map((c) => (
              <div key={c.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-border/30 hover:border-primary/20 hover:shadow-sm transition-all">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-violet-500/10 flex items-center justify-center text-lg font-bold text-primary flex-shrink-0">
                  {c.title?.charAt(0) ?? 'S'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{c.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    {c.creatorCategory && <span>{c.creatorCategory} · </span>}
                    {c.budget ? (
                      <span className="flex items-center gap-0.5 text-emerald-600 font-semibold">
                        <IndianRupee className="w-3 h-3" />{c.budget.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Budget negotiable</span>
                    )}
                  </p>
                </div>
                <Link to={`/dashboard/campaigns/${c.id}`}
                  className="flex-shrink-0 text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary hover:text-primary-foreground transition-all">
                  Apply →
                </Link>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
