import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Megaphone, Users, CheckCircle2, MessageSquare, Bell,
  ArrowUpRight, ArrowDownRight, BarChart3, Plus, Eye,
  Rocket
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../api/client';

// Stat Card
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

// Quick Action Card
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

interface CampaignItem {
  id: string;
  title: string;
  status: string;
  category?: string;
}

interface CreatorItem {
  id: string;
  name: string;
  category?: string;
  followers?: number;
  matchScore?: number;
}

export default function BusinessDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [creators, setCreators] = useState<CreatorItem[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [cmpRes, creRes] = await Promise.all([
          fetch(`${API_BASE_URL}/discovery/campaigns`).catch(() => null),
          fetch(`${API_BASE_URL}/discovery/creators`).catch(() => null)
        ]);

        if (cmpRes && cmpRes.ok) {
          const json = await cmpRes.json();
          const list = Array.isArray(json.data) ? json.data : (json.data?.content || json.content || []);
          setCampaigns(list);
        }

        if (creRes && creRes.ok) {
          const json = await creRes.json();
          const list = Array.isArray(json.data) ? json.data : (json.data?.content || json.content || []);
          setCreators(list);
        }
      } catch {
        // Handle network error quietly
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalCampaigns = campaigns.length;
  const runningCampaigns = campaigns.filter(c => c.status === 'ACTIVE').length;
  const completedCampaigns = campaigns.filter(c => c.status === 'COMPLETED').length;

  const stats = [
    { icon: Megaphone, label: 'Total Campaigns', value: totalCampaigns, trend: 'From DB', trendUp: true, gradient: 'from-violet-500 to-purple-600', to: '/dashboard/campaigns' },
    { icon: Rocket, label: 'Running Campaigns', value: runningCampaigns, trend: 'Active', trendUp: true, gradient: 'from-cyan-500 to-blue-600', to: '/dashboard/campaigns' },
    { icon: CheckCircle2, label: 'Completed', value: completedCampaigns, trend: 'Finished', trendUp: true, gradient: 'from-emerald-500 to-green-600', to: '/dashboard/campaigns' },
    { icon: Users, label: 'Total Applications', value: 0, trend: 'Real time', trendUp: true, gradient: 'from-amber-500 to-orange-600', to: '/dashboard/applications' },
    { icon: MessageSquare, label: 'Unread Messages', value: 0, trend: 'Inbox', trendUp: false, gradient: 'from-rose-500 to-pink-600', to: '/dashboard/messages' },
    { icon: Bell, label: 'Notifications', value: 0, trend: 'Live', trendUp: true, gradient: 'from-indigo-500 to-violet-600', to: '/dashboard/notifications' },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Business Dashboard 🏢</h1>
          <p className="text-muted-foreground text-sm mt-1">Live metrics directly connected to PostgreSQL Database.</p>
        </div>
        <Link to="/dashboard/campaigns/new"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> New Campaign
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

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="rounded-2xl border border-border/50 bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <QuickAction icon={Plus} label="Create Campaign" description="Launch a new campaign" to="/dashboard/campaigns/new" gradient="from-violet-500 to-purple-600" />
              <QuickAction icon={Users} label="Find Creators" description="Browse DB creators" to="/dashboard/creators" gradient="from-cyan-500 to-blue-600" />
              <QuickAction icon={Eye} label="View Applications" description="Review live applications" to="/dashboard/applications" gradient="from-amber-500 to-orange-600" />
              <QuickAction icon={BarChart3} label="Analytics" description="Campaign metrics" to="/dashboard/analytics" gradient="from-emerald-500 to-green-600" />
            </div>
          </motion.div>
        </div>

        {/* Right Column: Database Creators */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="rounded-2xl border border-border/50 bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Available Creators ({creators.length})</h2>
              <Link to="/dashboard/creators" className="text-xs text-primary font-medium hover:underline">View all</Link>
            </div>
            
            {loading ? (
              <div className="text-center py-6 text-sm text-muted-foreground">Loading database creators...</div>
            ) : creators.length === 0 ? (
              <div className="text-center py-6 text-sm text-muted-foreground">No creators in database yet.</div>
            ) : (
              <div className="space-y-3">
                {creators.slice(0, 4).map((c) => (
                  <div key={c.id || c.name} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors cursor-pointer border border-border/30">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {c.name ? c.name.charAt(0) : 'C'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.category || 'Creator'} · {c.followers ? c.followers.toLocaleString() : 0} followers</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
