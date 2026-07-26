import { motion } from 'framer-motion';
import {
  TrendingUp, Users, Megaphone, IndianRupee, Eye, Target,
  BarChart3, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

const kpiData = [
  { label: 'Total Revenue', value: '₹3,45,000', trend: '+18%', trendUp: true, icon: IndianRupee, gradient: 'from-emerald-500 to-green-600' },
  { label: 'Total Campaigns', value: '24', trend: '+4 this month', trendUp: true, icon: Megaphone, gradient: 'from-violet-500 to-purple-600' },
  { label: 'Total Reach', value: '2.4M', trend: '+32%', trendUp: true, icon: Eye, gradient: 'from-cyan-500 to-blue-600' },
  { label: 'Avg Engagement', value: '4.8%', trend: '+0.6%', trendUp: true, icon: Target, gradient: 'from-amber-500 to-orange-600' },
];

const campaignPerformance = [
  { name: 'Summer Fashion Lookbook', reach: '340K', engagement: '5.2%', applications: 12, status: 'Active', revenue: '₹15,000' },
  { name: 'Tech Gadget Unboxing', reach: '560K', engagement: '4.1%', applications: 8, status: 'Active', revenue: '₹30,000' },
  { name: 'Weekend Brunch Promo', reach: '1.25M', engagement: '6.8%', applications: 24, status: 'Completed', revenue: '₹8,000' },
  { name: 'Fitness Challenge', reach: '180K', engagement: '3.9%', applications: 6, status: 'Paused', revenue: '₹12,000' },
  { name: 'Diwali Sale Promo', reach: '890K', engagement: '5.5%', applications: 18, status: 'Completed', revenue: '₹25,000' },
];

const monthlyData = [
  { month: 'Jan', value: 28000 },
  { month: 'Feb', value: 35000 },
  { month: 'Mar', value: 42000 },
  { month: 'Apr', value: 38000 },
  { month: 'May', value: 55000 },
  { month: 'Jun', value: 62000 },
  { month: 'Jul', value: 45000 },
];

const maxValue = Math.max(...monthlyData.map((d) => d.value));

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Track your campaign performance and growth metrics</p>
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
              <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${kpi.trendUp ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                {kpi.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {kpi.trend}
              </span>
            </div>
            <div className="text-2xl font-bold tracking-tight">{kpi.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{kpi.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart (Simple Bar Chart) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl border border-border/50 bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" /> Monthly Revenue
            </h2>
            <span className="text-xs text-muted-foreground">Last 7 months</span>
          </div>
          <div className="flex items-end justify-between gap-3 h-48">
            {monthlyData.map((d, i) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] font-medium text-muted-foreground">₹{(d.value / 1000).toFixed(0)}K</span>
                <motion.div initial={{ height: 0 }} animate={{ height: `${(d.value / maxValue) * 100}%` }} transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
                  className="w-full rounded-lg bg-gradient-to-t from-primary to-violet-400 min-h-[4px]" />
                <span className="text-[10px] text-muted-foreground">{d.month}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Creators */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-2xl border border-border/50 bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> Top Performing Creators
            </h2>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Ananya Verma', reach: '450K', engagement: '5.8%', revenue: '₹45,000' },
              { name: 'Karthik Rajan', reach: '320K', engagement: '6.2%', revenue: '₹38,000' },
              { name: 'Divya Singh', reach: '280K', engagement: '4.9%', revenue: '₹32,000' },
              { name: 'Arun Prasad', reach: '520K', engagement: '7.1%', revenue: '₹28,000' },
            ].map((c, i) => (
              <div key={c.name} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors">
                <span className="text-xs font-bold text-muted-foreground w-5">#{i + 1}</span>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-sm font-bold text-primary">{c.name.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.reach} reach · {c.engagement} eng.</div>
                </div>
                <span className="text-sm font-semibold text-emerald-600">{c.revenue}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Campaign Performance Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="rounded-2xl border border-border/50 bg-card p-6 overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" /> Campaign Performance
        </h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground">Campaign</th>
              <th className="text-right py-3 px-2 text-xs font-medium text-muted-foreground">Reach</th>
              <th className="text-right py-3 px-2 text-xs font-medium text-muted-foreground">Engagement</th>
              <th className="text-right py-3 px-2 text-xs font-medium text-muted-foreground">Applications</th>
              <th className="text-right py-3 px-2 text-xs font-medium text-muted-foreground">Revenue</th>
              <th className="text-right py-3 px-2 text-xs font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {campaignPerformance.map((c) => (
              <tr key={c.name} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                <td className="py-3 px-2 font-medium">{c.name}</td>
                <td className="py-3 px-2 text-right">{c.reach}</td>
                <td className="py-3 px-2 text-right">{c.engagement}</td>
                <td className="py-3 px-2 text-right">{c.applications}</td>
                <td className="py-3 px-2 text-right font-medium text-emerald-600">{c.revenue}</td>
                <td className="py-3 px-2 text-right">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                    ${c.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : c.status === 'Paused' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
