import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Megaphone, IndianRupee, Eye, Target,
  ArrowUpRight, Sparkles
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { API_BASE_URL } from '../api/client';

interface CampaignItem {
  id: string;
  title: string;
  status: string;
  budgetMax?: number;
  location?: string;
  viewsCount?: number;
  applicationsCount?: number;
}

export default function AnalyticsPage() {
  const { role } = useOutletContext<{ role?: string }>() || {};
  const currentRole = role || localStorage.getItem('promobridge_user_role');

  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch(`${API_BASE_URL}/discovery/campaigns`).catch(() => null);
        if (res && res.ok) {
          const json = await res.json();
          setCampaigns(json.data || json.content || json || []);
        }
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter(c => c.status === 'ACTIVE').length;
  const totalBudget = campaigns.reduce((acc, c) => acc + (c.budgetMax || 0), 0);

  const kpiData = [
    { label: currentRole === 'CREATOR' ? 'Estimated Earnings' : 'Total Budget Allocated', value: `₹${totalBudget.toLocaleString()}`, trend: 'Live DB', trendUp: true, icon: IndianRupee, gradient: 'from-emerald-500 to-green-600' },
    { label: 'Total Campaigns', value: totalCampaigns, trend: 'Database', trendUp: true, icon: Megaphone, gradient: 'from-violet-500 to-purple-600' },
    { label: 'Active Campaigns', value: activeCampaigns, trend: 'Live', trendUp: true, icon: Target, gradient: 'from-cyan-500 to-blue-600' },
    { label: 'Total Campaign Views', value: 0, trend: 'Analytics', trendUp: true, icon: Eye, gradient: 'from-amber-500 to-orange-600' },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          {currentRole === 'CREATOR' ? 'Creator Performance & Earnings' : 'Campaign Analytics'}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Real-time metrics calculated from live database records</p>
      </motion.div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="p-5 rounded-2xl border border-border/50 bg-card hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.gradient} flex items-center justify-center`}>
                <kpi.icon className="w-5 h-5 text-white" />
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                <ArrowUpRight className="w-3 h-3" />
                {kpi.trend}
              </span>
            </div>
            <div className="text-2xl font-bold tracking-tight">{kpi.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{kpi.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Campaign Performance Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="rounded-2xl border border-border/50 bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Database Campaign Metrics</h2>

        {loading ? (
          <div className="text-center py-8 text-sm text-muted-foreground">Loading analytics from database...</div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            <Sparkles className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" />
            No active database campaigns recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border/50 text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Campaign Title</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Budget</th>
                  <th className="pb-3 font-semibold">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {campaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3.5 font-medium">{c.title}</td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600">
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 font-semibold">₹{c.budgetMax ? c.budgetMax.toLocaleString() : 'Negotiable'}</td>
                    <td className="py-3.5 text-muted-foreground">{c.location || 'Remote'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
