import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Megaphone, Users, CheckCircle2, MessageSquare, Bell,
  ArrowUpRight, ArrowDownRight, BarChart3, Plus, Eye,
  Rocket, TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

const BASE = 'https://promobridge-api.onrender.com/api';

function StatCard({ icon: Icon, label, value, trend, trendUp, gradient, to }: {
  icon: React.ElementType; label: string; value: string | number; trend: string; trendUp: boolean; gradient: string; to?: string;
}) {
  const content = (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="group p-5 rounded-2xl border border-border/50 bg-card hover:shadow-lg hover:border-primary/20 transition-all cursor-pointer block h-full">
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
    </motion.div>
  );
  return to ? <Link to={to} className="block">{content}</Link> : content;
}

function QuickAction({ icon: Icon, label, description, to, gradient }: {
  icon: React.ElementType; label: string; description: string; to: string; gradient: string;
}) {
  return (
    <Link to={to} className="group flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-primary/20 hover:shadow-md transition-all bg-card">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold">{label}</div>
        <div className="text-xs text-muted-foreground truncate">{description}</div>
      </div>
      <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
    </Link>
  );
}

interface CreatorItem {
  id: string;
  name: string;
  followers?: number;
  location?: string;
  instagramUsername?: string;
  profileImageUrl?: string;
  averageRating?: number;
}

interface CampaignItem {
  id: string;
  title: string;
  status: string;
}

function formatFollowers(n?: number): string {
  if (!n) return '0';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K';
  return n.toString();
}

export default function BusinessDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [creators, setCreators] = useState<CreatorItem[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [cmpRes, creRes] = await Promise.all([
          fetch(`${BASE}/discovery/campaigns?page=0&size=100`).catch(() => null),
          fetch(`${BASE}/discovery/creators?page=0&size=100`).catch(() => null),
        ]);

        if (cmpRes && cmpRes.ok) {
          const json = await cmpRes.json();
          const raw = json?.data?.content ?? json?.content ?? [];
          const seen = new Set<string>();
          setCampaigns(raw.filter((c: CampaignItem) => { if (seen.has(c.id)) return false; seen.add(c.id); return true; }));
        }

        if (creRes && creRes.ok) {
          const json = await creRes.json();
          const raw = json?.data?.content ?? json?.content ?? [];
          const seen = new Set<string>();
          setCreators(raw.filter((c: CreatorItem) => { if (seen.has(c.id)) return false; seen.add(c.id); return true; }));
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalCampaigns   = campaigns.length;
  const activeCampaigns  = campaigns.filter(c => c.status === 'ACTIVE').length;
  const completedCount   = campaigns.filter(c => c.status === 'COMPLETED').length;

  const stats = [
    { icon: Megaphone,    label: 'Total Campaigns',      value: loading ? '—' : totalCampaigns,  trend: 'All time',    trendUp: true,  gradient: 'from-violet-500 to-purple-600', to: '/dashboard/campaigns' },
    { icon: Rocket,       label: 'Active Campaigns',     value: loading ? '—' : activeCampaigns, trend: 'Running now', trendUp: true,  gradient: 'from-cyan-500 to-blue-600',     to: '/dashboard/campaigns' },
    { icon: CheckCircle2, label: 'Completed',            value: loading ? '—' : completedCount,  trend: 'Delivered',   trendUp: true,  gradient: 'from-emerald-500 to-green-600', to: '/dashboard/campaigns' },
    { icon: Users,        label: 'Creator Network',      value: loading ? '—' : creators.length, trend: 'Available',   trendUp: true,  gradient: 'from-amber-500 to-orange-600',  to: '/dashboard/creators' },
    { icon: MessageSquare,label: 'Messages',             value: 0,                               trend: 'Inbox',       trendUp: false, gradient: 'from-rose-500 to-pink-600',     to: '/dashboard/messages' },
    { icon: Bell,         label: 'Notifications',        value: 0,                               trend: 'Latest',      trendUp: true,  gradient: 'from-indigo-500 to-violet-600', to: '/dashboard/notifications' },
  ];

  return (
    <div className="space-y-8 max-w-7xl">

      {/* ── Welcome ─────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome back 👋</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Here's what's happening with your campaigns today.
          </p>
        </div>
        <Link to="/dashboard/campaigns/new"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> New Campaign
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

      {/* ── Main Columns ─────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="rounded-2xl border border-border/50 bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">What do you want to do?</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <QuickAction icon={Plus}      label="Create a Campaign"    description="Set up a new influencer campaign"       to="/dashboard/campaigns/new" gradient="from-violet-500 to-purple-600" />
              <QuickAction icon={Users}     label="Find Creators"        description="Browse creators who match your brand"   to="/dashboard/creators"      gradient="from-cyan-500 to-blue-600" />
              <QuickAction icon={Eye}       label="Review Applications"  description="See who applied to your campaigns"      to="/dashboard/applications"  gradient="from-amber-500 to-orange-600" />
              <QuickAction icon={BarChart3} label="Campaign Analytics"   description="Track reach, engagement and ROI"        to="/dashboard/analytics"     gradient="from-emerald-500 to-green-600" />
            </div>
          </motion.div>

          {/* Campaign activity strip */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="rounded-2xl border border-border/50 bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" /> Your Campaigns
              </h2>
              <Link to="/dashboard/campaigns" className="text-xs text-primary font-semibold hover:underline">See all</Link>
            </div>
            {loading ? (
              <div className="flex flex-col items-center py-8 gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                <p className="text-xs text-muted-foreground">Loading…</p>
              </div>
            ) : campaigns.length === 0 ? (
              <div className="text-center py-8">
                <Megaphone className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">You haven't launched any campaigns yet.</p>
                <Link to="/dashboard/campaigns/new"
                  className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-xl hover:opacity-90 transition-opacity">
                  <Plus className="w-3.5 h-3.5" /> Create your first campaign
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {campaigns.slice(0, 5).map((c) => (
                  <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/40 transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                      {c.title?.charAt(0) ?? 'C'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{c.title}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'}`}>
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Creator Spotlight */}
        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="rounded-2xl border border-border/50 bg-card p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Top Creators</h2>
              <Link to="/dashboard/creators" className="text-xs text-primary font-semibold hover:underline">
                View all {creators.length > 0 ? `(${creators.length})` : ''}
              </Link>
            </div>

            {loading ? (
              <div className="flex flex-col items-center py-8 gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                <p className="text-xs text-muted-foreground">Loading…</p>
              </div>
            ) : creators.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No creators available right now.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {creators.slice(0, 5).map((c) => (
                  <Link key={c.id} to={`/dashboard/creators/${c.id}`}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/40 transition-colors group">
                    {c.profileImageUrl ? (
                      <img src={c.profileImageUrl} alt={c.name}
                        className="w-10 h-10 rounded-full object-cover border border-primary/10 flex-shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                        {c.name?.charAt(0) ?? 'C'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">{c.name}</p>
                      <p className="text-xs text-muted-foreground">@{c.instagramUsername} · {formatFollowers(c.followers)} followers</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
